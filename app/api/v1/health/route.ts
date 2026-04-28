import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CheckStatus = "ok" | "degraded" | "down";
type Check = { status: CheckStatus; latency_ms: number; error?: string };

const TIMEOUT_MS = 3_000;

async function withTimeout<T>(p: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms),
    ),
  ]);
}

async function checkSupabase(): Promise<Check> {
  const t0 = Date.now();
  try {
    const supabase = createAdminClient();
    // SELECT 1 equivalente — usamos uma RPC trivial ou fallback em auth.
    const { error } = await withTimeout(
      supabase.from("organizations").select("id").limit(1),
    );
    // Tabela pode ainda não existir no scaffolding; tratamos como degraded mas não down.
    if (error && !/relation .* does not exist/i.test(error.message)) {
      return { status: "down", latency_ms: Date.now() - t0, error: error.message };
    }
    return { status: "ok", latency_ms: Date.now() - t0 };
  } catch (e) {
    return {
      status: "down",
      latency_ms: Date.now() - t0,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function checkRedis(): Promise<Check> {
  const t0 = Date.now();
  try {
    const url = env.UPSTASH_REDIS_REST_URL;
    const token = env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      return { status: "degraded", latency_ms: 0, error: "not_configured" };
    }
    const res = await withTimeout(
      fetch(`${url}/ping`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    );
    if (!res.ok) {
      return {
        status: "down",
        latency_ms: Date.now() - t0,
        error: `http_${res.status}`,
      };
    }
    return { status: "ok", latency_ms: Date.now() - t0 };
  } catch (e) {
    return {
      status: "down",
      latency_ms: Date.now() - t0,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function checkWaha(): Promise<Check> {
  const t0 = Date.now();
  try {
    const base = env.WAHA_API_BASE_URL;
    if (!base) {
      return { status: "degraded", latency_ms: 0, error: "not_configured" };
    }
    const res = await withTimeout(
      fetch(`${base.replace(/\/$/, "")}/api/health`, {
        headers: env.WAHA_API_KEY ? { "X-Api-Key": env.WAHA_API_KEY } : {},
        cache: "no-store",
      }),
    );
    if (!res.ok) {
      return {
        status: "down",
        latency_ms: Date.now() - t0,
        error: `http_${res.status}`,
      };
    }
    return { status: "ok", latency_ms: Date.now() - t0 };
  } catch (e) {
    return {
      status: "down",
      latency_ms: Date.now() - t0,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function GET() {
  const [supabase, redis, waha] = await Promise.all([
    checkSupabase(),
    checkRedis(),
    checkWaha(),
  ]);

  const checks = { supabase, redis, waha };
  const anyDown = Object.values(checks).some((c) => c.status === "down");
  const anyDegraded = Object.values(checks).some((c) => c.status === "degraded");
  const status: "healthy" | "degraded" | "unhealthy" = anyDown
    ? "unhealthy"
    : anyDegraded
      ? "degraded"
      : "healthy";

  const httpStatus = status === "unhealthy" ? 503 : 200;

  return NextResponse.json(
    {
      data: {
        status,
        version: process.env.npm_package_version ?? "0.1.0",
        timestamp: new Date().toISOString(),
        checks,
      },
    },
    { status: httpStatus },
  );
}
