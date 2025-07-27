"use client"; // ✅ Ensures this runs only on the client
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();
  return (
    <html lang="en" className="h-full">
      <body>
        <QueryClientProvider client={queryClient}>
          <div>{children}</div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
