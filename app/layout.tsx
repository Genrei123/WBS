import "@/app/globals.css";

import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { ThemeProvider } from "next-themes";

import FooterSection from "@/components/sections/footer/default";
import Navbar from "@/components/sections/navbar/default";
import { inter } from "@/lib/fonts";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { footerQuery, navbarQuery, siteSettingsQuery } from "@/sanity/lib/queries";

import { siteConfig } from "../config/site";


async function getSiteSettings() {
  const { data } = await sanityFetch({ query: siteSettingsQuery });
  return data;
}

async function getNavbar() {
  const { data } = await sanityFetch({ query: navbarQuery });
  return data;
}

async function getFooter() {
  const { data } = await sanityFetch({ query: footerQuery });
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const siteTitle = settings?.siteTitle || siteConfig.name;
  const description = settings?.siteDescription || siteConfig.description;
  const siteUrl = settings?.siteUrl || siteConfig.url;
  const ogImage = settings?.ogImage?.asset
    ? urlFor(settings.ogImage).width(1200).height(630).fit("crop").url()
    : siteConfig.ogImage;

  return {
    title: {
      default: siteTitle,
      template: `%s - ${siteTitle}`,
    },
    metadataBase: new URL(siteUrl),
    description,
    keywords: [
      "Landing page template",
      "Components",
      "Shadcn",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Radix UI",
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: siteTitle,
      description,
      siteName: siteTitle,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: settings?.ogImage?.alt || siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description,
      images: [ogImage],
      creator: settings?.twitterHandle,
    },
    alternates: {
      canonical: siteUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.svg",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();
  const siteSettings = await getSiteSettings();
  const navbarData = await getNavbar();
  const footerData = await getFooter();

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${inter.variable} bg-background font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="fixed top-0 left-0 w-full z-50 backdrop-blur">
            <Navbar
              data={navbarData || undefined}
              brandName={siteSettings?.brandName}
              logo={siteSettings?.logo}
            />
          </header>
          {children}
          <FooterSection
            data={footerData || undefined}
            brandName={siteSettings?.brandName}
            logo={siteSettings?.logo}
          />
          {isEnabled ? <VisualEditing /> : null}
          <SanityLive />
        </ThemeProvider>
      </body>
    </html>
  );
}
