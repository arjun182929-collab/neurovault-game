import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeuroVault — Extreme Puzzle Lab",
  description: "Think harder. Fail faster. Solve the impossible. The hardest Gen Z brain game on the internet.",
  keywords: ["NeuroVault", "puzzle", "brain game", "logic", "IQ challenge", "Gen Z"],
  authors: [{ name: "Arjun Kumar Das" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "NeuroVault — Extreme Puzzle Lab",
    description: "Think harder. Fail faster. Solve the impossible.",
    type: "website",
    siteName: "NeuroVault",
    creator: "Arjun Kumar Das",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-vault-bg text-foreground`}
      >
        <script>
  atOptions = {
    'key' : 'c074d08b5aad838eaf5e659a0adf0c7b',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/c074d08b5aad838eaf5e659a0adf0c7b/invoke.js"></script>
        
        <main className="min-h-screen flex flex-col relative">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
