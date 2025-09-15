import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
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
      <head>
        {/* Hide body until scroll position is restored to prevent flash at top */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                visibility: hidden;
                opacity: 0;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${neueMontreal.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Preserve scroll position on refresh without jump */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Get saved scroll position
                const savedPos = sessionStorage.getItem('pageScrollPos');
                
                // If we have a saved position, restore it immediately
                if (savedPos && savedPos !== '0') {
                  // Disable smooth scrolling temporarily
                  document.documentElement.style.scrollBehavior = 'auto';
                  // Set scroll position before first paint
                  window.scrollTo(0, parseInt(savedPos, 10));
                  // Re-enable smooth scrolling after a moment
                  setTimeout(function() {
                    document.documentElement.style.scrollBehavior = '';
                  }, 50);
                }
                
                // Show the page immediately after scroll restoration
                // Using requestAnimationFrame ensures it happens after scroll
                requestAnimationFrame(function() {
                  document.body.style.visibility = 'visible';
                  document.body.style.opacity = '1';
                  document.body.style.transition = 'opacity 0.15s ease-in';
                });
                
                // Save position on page unload
                window.addEventListener('beforeunload', function() {
                  sessionStorage.setItem('pageScrollPos', window.scrollY);
                });
              })();
            `,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="billr-theme"
        >
          <HeroUIProvider>
            {children}
          </HeroUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
