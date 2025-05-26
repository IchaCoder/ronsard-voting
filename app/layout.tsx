import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Ronsard Voting",
  description: "Ecole Ronsard Voting System",
  keywords: ["Ronsard", "Voting", "Ecole", "Election"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
