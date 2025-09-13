import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const neueMontreal = localFont({
  src: [
    {
      path: '../../fonts/PPNeueMontreal-Book.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/PPNeueMontreal-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../fonts/PPNeueMontreal-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-neue-montreal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Billr: Usage-based billing made for future",
  description: "Modern business management platform with usage-based billing capabilities",
  icons: {
    icon: '/favicon-billr.png',
  },
  other: {
    // Help with DarkReader compatibility
    'darkreader-lock': '',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${neueMontreal.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <HeroUIProvider>
            {children}
          </HeroUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
