import "~/styles/globals.css";

import { Klee_One, Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import "@xyflow/react/dist/style.css";

const kleeOne = Klee_One({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Mini Forecast",
  description: "A tiny forecasting tool",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${kleeOne.variable} ${inter.variable}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
