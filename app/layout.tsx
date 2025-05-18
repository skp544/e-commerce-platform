import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const barlowFont = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "GoShop",
  description:
    "GoShop is a modern e-commerce platform offering a seamless shopping experience with the latest products, exclusive deals, and fast delivery. Shop electronics, fashion, home essentials, and more—all in one place.",
  keywords:
    "online shopping, GoShop, e-commerce, buy online, fashion, electronics, home decor, deals, free delivery, secure checkout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${barlowFont.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>{children}</ModalProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
