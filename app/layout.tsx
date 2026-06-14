import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CheckoutErrorBanner } from "./components/checkout-error-banner";
import { PwaRegister } from "./components/pwa-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neverstill Operator Toolkit",
  description: "Practical micro-tools built by a farmer-chef for farmers, chefs, and families running real small food businesses. PaperAirplane printables, FarmForge forecasting, and more.",
  applicationName: "Neverstill Operator Toolkit",
  appleWebApp: {
    capable: true,
    title: "Neverstill",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        <CheckoutErrorBanner />
        {children}
      </body>
    </html>
  );
}
