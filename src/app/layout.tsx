import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VANTAIR | The Computational Software Reality Engine",
  description: "In-Silico Wind Tunnel and Digital Twin for Software Reality with 5-Way Bi-Simulation and Pearl's Do-Calculus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[#030712] text-slate-100 antialiased min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
