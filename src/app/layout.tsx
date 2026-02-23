import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { getBaseUrl } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "SubliMotion - Visualisez vos designs sur mug en 3D",
    template: "%s | SubliMotion",
  },
  description:
    "Créez et visualisez instantanément vos designs sur mug en 3D avec SubliMotion. Importez vos images, personnalisez et exportez en vidéo.",
  keywords: [
    "mug 3d",
    "visualisation mug",
    "sublimation",
    "design mug",
    "mockup mug",
    "impression mug",
    "personnalisation",
  ],
  authors: [{ name: "Baptiste LECHAT" }],
  creator: "Baptiste LECHAT",
  metadataBase: new URL(getBaseUrl()),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title: "SubliMotion - Visualisez vos designs sur mug en 3D",
    description:
      "Créez et visualisez instantanément vos designs sur mug en 3D avec SubliMotion.",
    siteName: "SubliMotion",
  },
  twitter: {
    card: "summary_large_image",
    title: "SubliMotion - Visualisez vos designs sur mug en 3D",
    description:
      "Créez et visualisez instantanément vos designs sur mug en 3D avec SubliMotion.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
