export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">DeskcommCRM</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          CRM operacional multi-tenant para e-commerce, com IA conversacional integrada,
          WhatsApp via WAHA e LGPD nativa.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          MVP em desenvolvimento. Acesse o painel via{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/app</code> ou{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/admin</code>.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Health check:{" "}
          <a className="underline" href="/api/v1/health">
            /api/v1/health
          </a>
        </p>
      </div>
    </main>
  );
}
