import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/globals.css";
import { ColorSchemeScript } from "@mantine/core";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import { StoreProvider } from "@/providers/StoreProvider";
import { MantineClientProvider } from "@/providers/MantineClientProvider";

export const metadata: Metadata = {
  title: "Nawasanga — Platform Monitoring Emisi Karbon & BBM Armada",
  description: "Solusi terpadu pemantauan efisiensi bahan bakar dan jejak karbon armada transportasi korporasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning={true}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className="antialiased bg-[#F7F5EF] text-[#1A1A18]">
        <MantineClientProvider>
          <QueryProvider>
            <StoreProvider>
              {children}
              <Toaster position="top-right" />
            </StoreProvider>
          </QueryProvider>
        </MantineClientProvider>
      </body>
    </html>
  );
}
