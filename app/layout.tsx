import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canary Travel Oman | Votre Oman, à votre façon",
  description: "Découvrez Oman à votre façon avec Canary. Une première route, construite autour de vos envies.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
