import { QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import ClientProviders from "./ClientProviders";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body>
        <ClientProviders>
          <div>{children}</div>
        </ClientProviders>
      </body>
    </html>
  );
}
