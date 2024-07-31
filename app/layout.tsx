import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
       <div className="nim-h-screen">
       <nav>
          <h1 className="font-extrabold text-2xl tracking-wide text-center py-2">
            Grocery Helper
          </h1>
        </nav>
        {children}
        <footer className="footer footer-center">
          created by Ivan Felipe Escobar 2024
        </footer>
       </div>
      </body>
    </html>
  );
}
