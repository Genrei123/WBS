"use client";

import { type VariantProps } from "class-variance-authority";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

import LaunchUI from "../../logos/launch-ui";
import { Button, buttonVariants } from "../../ui/button";
import { ModeToggle } from "../../ui/mode-toggle";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar";
import Navigation from "../../ui/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../ui/sheet";

interface LinkData {
  linkType?: "internal" | "external";
  internalPage?: { slug?: { current?: string } };
  externalUrl?: string;
}

interface DropdownItem {
  label: string;
  linkType?: "internal" | "external";
  internalPage?: { slug?: { current?: string } };
  externalUrl?: string;
}

interface FeaturedItem {
  label: string;
  linkType?: "internal" | "external";
  internalPage?: { slug?: { current?: string } };
  externalUrl?: string;
}

interface NavigationItem {
  label: string;
  mainLink?: LinkData;
  dropdownVariant?: "none" | "standard" | "featured";
  dropdownItems?: DropdownItem[];
  featuredItem?: FeaturedItem;
}

interface NavbarAction {
  label: string;
  linkType?: "internal" | "external";
  internalPage?: { slug?: { current?: string } };
  externalUrl?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}

interface MobileLink {
  label: string;
  linkType?: "internal" | "external";
  internalPage?: { slug?: { current?: string } };
  externalUrl?: string;
}

interface NavbarData {
  homeLink?: LinkData;
  navigationItems?: NavigationItem[];
  actions?: NavbarAction[];
  mobileLinks?: MobileLink[];
}

interface LogoImage {
  asset?: { _id?: string; url?: string };
  alt?: string;
}

interface NavbarProps {
  data?: NavbarData;
  brandName?: string;
  logo?: LogoImage;
  className?: string;
}

// Helper function to convert link data to href
const getLinkHref = (link?: LinkData): string => {
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
const isExternalLink = (link?: LinkData): boolean => {
  return link?.linkType === "external" && !!link?.externalUrl;
};

export default function Navbar({
  data,
  brandName,
  logo,
  className,
}: NavbarProps) {
  const defaultName = "Launch UI";
  const name = brandName || defaultName;
  const homeLink = data?.homeLink;
  const navigationItems = data?.navigationItems || [];
  const actions = data?.actions || [];
  const mobileLinks = data?.mobileLinks || [];

  const homeUrl = getLinkHref(homeLink);

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

  // Map navigation items to Navigation component structure
  const navStructure = navigationItems.map((item) => ({
    text: item.label,
    href: getLinkHref(item.mainLink),
    hasDropdown: item.dropdownVariant !== "none" && item.dropdownVariant !== undefined,
    dropdownVariant: item.dropdownVariant,
    dropdownItems: item.dropdownItems?.map(di => ({
      text: di.label,
      href: getLinkHref({
        linkType: di.linkType,
        internalPage: di.internalPage,
        externalUrl: di.externalUrl,
      }),
    })) || [],
    featuredItem: item.featuredItem ? {
      text: item.featuredItem.label,
      href: getLinkHref({
        linkType: item.featuredItem.linkType,
        internalPage: item.featuredItem.internalPage,
        externalUrl: item.featuredItem.externalUrl,
      }),
    } : undefined,
  }));

  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <a
              href={homeUrl}
              className="flex items-center gap-2 text-xl font-bold"
            >
              {logoElement}
              {name}
            </a>
            {navigationItems.length > 0 && <Navigation structure={navStructure} />}
          </NavbarLeft>
          <NavbarRight>
            <ModeToggle />
            {actions.map((action) => (
              <Button
                key={`${action.label}`}
                variant={action.variant as VariantProps<typeof buttonVariants>["variant"] || "default"}
                asChild
              >
                <a 
                  href={getLinkHref({
                    linkType: action.linkType,
                    internalPage: action.internalPage,
                    externalUrl: action.externalUrl,
                  })}
                  target={isExternalLink({linkType: action.linkType, externalUrl: action.externalUrl}) ? "_blank" : undefined}
                  rel={isExternalLink({linkType: action.linkType, externalUrl: action.externalUrl}) ? "noopener noreferrer" : undefined}
                >
                  {action.label}
                </a>
              </Button>
            ))}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <nav className="grid gap-6 text-lg font-medium">
                  <a
                    href={homeUrl}
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    <span>{name}</span>
                  </a>
                  {(mobileLinks.length > 0 ? mobileLinks : navigationItems).map((link) => {
                    let linkHref = "/";
                    let isExternal = false;
                    
                    // Handle both navigationItem and mobileLink structures
                    if ("mainLink" in link) {
                      // navigationItem with mainLink
                      linkHref = getLinkHref(link.mainLink);
                      isExternal = isExternalLink(link.mainLink);
                    } else {
                      // mobileLink with direct link properties
                      const mobileLink = link as MobileLink;
                      linkHref = getLinkHref({
                        linkType: mobileLink.linkType,
                        internalPage: mobileLink.internalPage,
                        externalUrl: mobileLink.externalUrl,
                      });
                      isExternal = isExternalLink({
                        linkType: mobileLink.linkType,
                        internalPage: mobileLink.internalPage,
                        externalUrl: mobileLink.externalUrl,
                      });
                    }
                    
                    return (
                      <a
                        key={`${link.label}`}
                        href={linkHref}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
