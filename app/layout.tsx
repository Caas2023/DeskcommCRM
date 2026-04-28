import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeskcommCRM",
  description:
    "CRM operacional multi-tenant para e-commerce com IA conversacional, WhatsApp e LGPD nativa.",
  robots: { index: false, follow: false }, // produto interno; remover quando SaaS público
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
