import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CheckoutErrorBanner } from "./components/checkout-error-banner";
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
  icons: { icon: "/favicon.ico" },
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
        <CheckoutErrorBanner />
        {children}
      </body>
    </html>
  );
}
