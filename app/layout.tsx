import type { Metadata } from "next";
import { inter } from "@/app/fonts";
import "./globs.css";

export const metadata: Metadata = {
  title: "Chrysopoeia",
  description: "drifting... searching... reaching...",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
