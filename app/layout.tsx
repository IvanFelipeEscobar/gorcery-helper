import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grocery Helper",
  description: "Keep track of your grocery list everywhere you go",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
       <div className="min-h-screen flex flex-col">
      <Header/>
        {children}
        <Footer/>
       </div>
      </body>
    </html>
  );
}
