import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import "@xyflow/react/dist/style.css";
import type { Metadata } from "next";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

const description =
  "Your AI companion for swift, voice-driven math and predictive modeling. Perfect for on-the-fly, back-of-the-envelope calculations! Free, no sign-up required.";

const title = "Back of the Envelope";
export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://backoftheenvelope.app"),
  keywords: [
    "back of the envelope",
    "math",
    "calculator",
    "ai",
    "predictive modeling",
    "calculations",
  ],
  creator: "tone-row",
  authors: [
    {
      name: "tone-row",
      url: "https://tone-row.com",
    },
  ],
  icons: [{ rel: "icon", url: "/favicon.svg" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://backoftheenvelope.app",
    title,
    description,
    siteName: title,
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [{ url: "/og-image.png" }],
    creator: "@tone_row_",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
