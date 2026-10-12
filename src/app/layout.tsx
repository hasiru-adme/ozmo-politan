import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import SmoothScroll from "@/components/SmoothScroll";
import SiteLoader from "@/components/SiteLoader";


export const metadata: Metadata = {
  title: "Ozmo",
  description: "Digital solutions built around your business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteLoader />
        <SmoothScroll />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}