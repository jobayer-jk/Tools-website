import type { Metadata, Viewport } from "next";
import { Syne, Manrope, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FooterWrapper } from "@/components/layout/footer-wrapper";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let siteName = "Free Web Tools Hub";
  let faviconUrl = "/favicon.ico";

  try {
    const res = await fetch("http://localhost:3001/settings/public", { cache: "no-store", next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      if (data.siteName) siteName = data.siteName;
      if (data.siteFaviconUrl) faviconUrl = `http://localhost:3001${data.siteFaviconUrl}`;
    }
  } catch (e) {}

  return {
    title: {
      default: `${siteName} - Developer & Productivity Tools`,
      template: `%s | ${siteName}`,
    },
    description:
      "Free online tools for developers and professionals. Password generator, text converter, freelance calculator, and more - all free, fast, and private.",
    keywords: [
      "free web tools",
      "online tools",
      "developer tools",
      "password generator",
      "text converter",
      "freelance calculator",
    ],
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteName,
      title: `${siteName} - Developer & Productivity Tools`,
      description:
        "Free online tools for developers and professionals. Password generator, text converter, freelance calculator, and more.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/*
  themeColor matches the new page.tsx palette:
    light -> warm parchment #f7f6f1
    dark  -> near-black     #0f0f0b
*/
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#06070e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${syne.variable} ${manrope.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/*
        No bg-background / text-foreground on body.
        Each page owns its background via its own CSS variables so there
        is no flash of the wrong colour during theme transitions.

        The inline transition gives smooth background colour changes when
        the user toggles the theme. disableTransitionOnChange has been
        intentionally omitted from ThemeProvider so our CSS transitions
        are not stripped during the toggle.
      */}
      <body
        className="min-h-full flex flex-col"
        style={{ transition: "background-color 0.22s ease, color 0.22s ease" }}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <FooterWrapper>
              <Footer />
            </FooterWrapper>
            <Toaster position="bottom-right" />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}