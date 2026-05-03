"use client";

import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

import LaunchUI from "../../logos/launch-ui";
import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "../../ui/footer";

interface FooterLink {
  text: string;
  linkType?: "internal" | "external";
  internalPage?: { slug?: { current?: string } };
  externalUrl?: string;
}

interface FooterColumnData {
  title: string;
  links?: FooterLink[];
}

interface FooterPolicy {
  text: string;
  linkType?: "internal" | "external";
  internalPage?: { slug?: { current?: string } };
  externalUrl?: string;
}

interface LogoImage {
  asset?: { _id?: string; url?: string };
  alt?: string;
}

interface FooterData {
  columns?: FooterColumnData[];
  copyright?: string;
  policies?: FooterPolicy[];
}

interface FooterProps {
  data?: FooterData;
  brandName?: string;
  logo?: LogoImage;
  className?: string;
}

// Helper function to convert link data to href
const getLinkHref = (link?: FooterLink | FooterPolicy): string => {
  if (!link) return "/";
  
  if (link.linkType === "internal" && link.internalPage?.slug?.current) {
    return `/${link.internalPage.slug.current}`;
  }
  
  if (link.linkType === "external" && link.externalUrl) {
    return link.externalUrl;
  }
  
  return "/";
};

// Helper function to check if link is external
const isExternalLink = (link?: FooterLink | FooterPolicy): boolean => {
  return link?.linkType === "external" && !!link?.externalUrl;
};

export default function FooterSection({
  data,
  brandName,
  logo,
  className,
}: FooterProps) {
  const name = brandName;
  const columns = data?.columns || [];
  const copyright = data?.copyright || "© 2026 All rights reserved";
  const policies = data?.policies || [];

  // Render logo
  const logoElement = logo && logo.asset ? (
    <img 
      src={urlFor(logo).width(40).fit("max").url()}
      alt={logo.alt || name} 
      className="h-8 w-auto"
    />
  ) : (
    <LaunchUI />
  );

  return (
    <footer className={cn("bg-background w-full px-4", className)}>
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                {logoElement}
                <h3 className="text-xl font-bold">{name}</h3>
              </div>
            </FooterColumn>
            {columns.map((column) => (
              <FooterColumn key={column.title}>
                <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
                {column.links?.map((link) => (
                  <a
                    key={`${getLinkHref(link)}-${link.text}`}
                    href={getLinkHref(link)}
                    target={isExternalLink(link) ? "_blank" : undefined}
                    rel={isExternalLink(link) ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground text-sm"
                  >
                    {link.text}
                  </a>
                ))}
              </FooterColumn>
            ))}
          </FooterContent>
          <FooterBottom>
            <div>{copyright}</div>
            <div className="flex items-center gap-4">
              {policies.map((policy) => (
                <a 
                  key={`${getLinkHref(policy)}-${policy.text}`}
                  href={getLinkHref(policy)}
                  target={isExternalLink(policy) ? "_blank" : undefined}
                  rel={isExternalLink(policy) ? "noopener noreferrer" : undefined}
                >
                  {policy.text}
                </a>
              ))}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
