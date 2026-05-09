"use client";

import { type VariantProps } from "class-variance-authority";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import SocialIcon from "../../ui/social-icon";

import LaunchUI from "../../logos/launch-ui";
import { Button, buttonVariants } from "../../ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
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
  icon?: string;
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
  icon?: string;
}

interface NavbarAction {
  label: string;
  linkType?: "internal" | "external";
  internalPage?: { slug?: { current?: string } };
  externalUrl?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: string;
}

interface NavbarData {
  homeLink?: LinkData;
  navigationItems?: NavigationItem[];
  actions?: NavbarAction[];
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
      icon: di.icon,
    })) || [],
    featuredItem: item.featuredItem ? {
      text: item.featuredItem.label,
      href: getLinkHref({
        linkType: item.featuredItem.linkType,
        internalPage: item.featuredItem.internalPage,
        externalUrl: item.featuredItem.externalUrl,
      }),
    } : undefined,
    icon: item.icon,
    iconUrl: item.iconUrl,
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
                  {action.icon ? (
                    <span className="mr-2 inline-block align-middle text-current">
                      {action.icon === "custom" && (action as any).iconUrl ? (
                        <img src={(action as any).iconUrl} alt="" className="inline-block h-4 w-4 object-contain" />
                      ) : (
                        <SocialIcon name={action.icon} />
                      )}
                    </span>
                  ) : null}
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
                <nav className="grid gap-4 text-lg font-medium">
                  <a
                    href={homeUrl}
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    <span>{name}</span>
                  </a>
                  <Accordion type="multiple" className="grid gap-2">
                    {navigationItems.map((link) => {
                      const hasDropdown = link.dropdownVariant !== "none" && link.dropdownVariant !== undefined;
                      const linkHref = getLinkHref(link.mainLink);
                      const isExternal = isExternalLink(link.mainLink);

                      if (!hasDropdown) {
                        return (
                          <div key={link.label} className="py-1">
                            <a
                              href={linkHref}
                              target={isExternal ? "_blank" : undefined}
                              rel={isExternal ? "noopener noreferrer" : undefined}
                              className="text-muted-foreground hover:text-foreground block"
                            >
                              {link.icon ? (
                                <span className="mr-2 inline-block align-middle text-muted-foreground">
                                  <SocialIcon name={link.icon} />
                                </span>
                              ) : null}
                              {link.label}
                            </a>
                          </div>
                        );
                      }

                      return (
                        <AccordionItem key={link.label} value={link.label} className="border-b border-white/10">
                          <AccordionTrigger className="py-3 text-left text-base font-medium hover:no-underline">
                            {link.label}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-3 pl-1">
                              {link.mainLink ? (
                                <a
                                  href={linkHref}
                                  target={isExternal ? "_blank" : undefined}
                                  rel={isExternal ? "noopener noreferrer" : undefined}
                                  className="text-muted-foreground hover:text-foreground text-sm"
                                >
                                  {link.icon ? (
                                    <span className="mr-2 inline-block align-middle text-muted-foreground">
                                      <SocialIcon name={link.icon} />
                                    </span>
                                  ) : null}
                                  Open {link.label}
                                </a>
                              ) : null}
                              {link.dropdownItems?.map((dropItem) => {
                                const dropHref = getLinkHref({
                                  linkType: dropItem.linkType,
                                  internalPage: dropItem.internalPage,
                                  externalUrl: dropItem.externalUrl,
                                });
                                const dropExternal = isExternalLink({
                                  linkType: dropItem.linkType,
                                  internalPage: dropItem.internalPage,
                                  externalUrl: dropItem.externalUrl,
                                });

                                return (
                                  <a
                                    key={dropItem.label}
                                    href={dropHref}
                                    target={dropExternal ? "_blank" : undefined}
                                    rel={dropExternal ? "noopener noreferrer" : undefined}
                                    className="text-muted-foreground hover:text-foreground text-sm"
                                  >
                                    {dropItem.icon ? (
                                      <span className="mr-2 inline-block align-middle text-muted-foreground">
                                        <SocialIcon name={dropItem.icon} />
                                      </span>
                                    ) : null}
                                    {dropItem.label}
                                  </a>
                                );
                              })}
                              {link.featuredItem ? (() => {
                                const featuredHref = getLinkHref({
                                  linkType: link.featuredItem.linkType,
                                  internalPage: link.featuredItem.internalPage,
                                  externalUrl: link.featuredItem.externalUrl,
                                });
                                const featuredExternal = isExternalLink({
                                  linkType: link.featuredItem.linkType,
                                  internalPage: link.featuredItem.internalPage,
                                  externalUrl: link.featuredItem.externalUrl,
                                });

                                return (
                                  <Button asChild className="mt-1 w-full">
                                    <a
                                      href={featuredHref}
                                      target={featuredExternal ? "_blank" : undefined}
                                      rel={featuredExternal ? "noopener noreferrer" : undefined}
                                    >
                                      {link.featuredItem.label}
                                    </a>
                                  </Button>
                                );
                              })() : null}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                  {actions.length > 0 ? (
                    <div className="grid gap-3 pt-2">
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
                            target={isExternalLink({ linkType: action.linkType, externalUrl: action.externalUrl }) ? "_blank" : undefined}
                            rel={isExternalLink({ linkType: action.linkType, externalUrl: action.externalUrl }) ? "noopener noreferrer" : undefined}
                          >
                            {action.label}
                          </a>
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
