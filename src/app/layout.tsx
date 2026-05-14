import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDR IA WhatsApp",
  description: "MVP de agente SDR com IA, WhatsApp, CRM, agenda e aprendizado operacional."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
