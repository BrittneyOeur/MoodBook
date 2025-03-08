'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { metadata } from "./config/metadata";
import "./globals.css";
import { Account } from "./components/Account";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description}/>
        <title>{metadata.title}</title>
      </head>
      <body className="font-caveat antialiased">
        <Account>
          {children}
        </Account>
      </body>
    </html>
  );
}