"use client";

import Link from "next/link";
import * as React from "react";
import { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import LaunchUI from "../logos/launch-ui";
import { Button } from "./button";
import SocialIcon from "./social-icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";

interface DropdownItem {
  text: string;
  href: string;
  icon?: string;
  iconUrl?: string;
}

interface NavigationItemStructure {
  text: string;
  href?: string;
  hasDropdown?: boolean;
  dropdownVariant?: "none" | "standard" | "featured";
  dropdownItems?: DropdownItem[];
  featuredItem?: DropdownItem;
  icon?: string;
  iconUrl?: string;
}

interface ComponentItem {
  title: string;
  href: string;
  description: string;
}

interface MenuItem {
  title: string;
  href?: string;
  isLink?: boolean;
  content?: ReactNode;
}

interface NavigationProps {
  menuItems?: MenuItem[];
  structure?: NavigationItemStructure[];
  components?: ComponentItem[];
  logo?: ReactNode;
  logoTitle?: string;
  logoDescription?: string;
  logoHref?: string;
  introItems?: {
    title: string;
    href: string;
    description: string;
  }[];
}

export default function Navigation({
  menuItems,
  structure,
  components = [
    {
      title: "Alert Dialog",
      href: `${siteConfig.url}/docs/primitives/alert-dialog`,
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
      title: "Hover Card",
      href: `${siteConfig.url}/docs/primitives/hover-card`,
      description:
        "For sighted users to preview content available behind a link.",
    },
    {
      title: "Progress",
      href: `${siteConfig.url}/docs/primitives/progress`,
      description:
        "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
      title: "Scroll Area",
      href: `${siteConfig.url}/docs/primitives/scroll-area`,
      description: "A scrollable container with custom scrollbars.",
    },
    {
      title: "Tabs",
      href: `${siteConfig.url}/docs/primitives/tabs`,
      description:
        "A set of layered sections of content, known as tab panels, that are displayed one at a time.",
    },
    {
      title: "Tooltip",
      href: `${siteConfig.url}/docs/primitives/tooltip`,
      description:
        "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
  ],
  logo = <LaunchUI />,
  logoTitle = "Launch UI",
  logoDescription = "Landing page template built with React, Shadcn/ui and Tailwind that you can copy/paste into your project.",
  logoHref = siteConfig.getStartedUrl,
  introItems = [
    {
      title: "Introduction",
      href: siteConfig.getStartedUrl,
      description: "Reusable components built using Radix UI and Tailwind CSS.",
    },
    {
      title: "Installation",
      href: siteConfig.getStartedUrl,
      description: "How to install dependencies and structure your app.",
    },
    {
      title: "Typography",
      href: siteConfig.getStartedUrl,
      description: "Styles for headings, paragraphs, and lists.",
    },
  ],
}: NavigationProps) {
  // Use structure if provided, otherwise fall back to menuItems
  const defaultMenuItems = [
    {
      title: "Getting started",
      content: "default",
    },
    {
      title: "Components",
      content: "components",
    },
    {
      title: "Documentation",
      isLink: true,
      href: siteConfig.getStartedUrl,
    },
  ];

  const itemsToRender = menuItems || defaultMenuItems;

  // Helper to check if href is external
  const isExternal = (href?: string) => {
    return href?.startsWith("http://") || href?.startsWith("https://");
  };

  // If structure is provided, render dynamic items
  if (structure && structure.length > 0) {
    return (
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {structure.map((item) => (
            <NavigationMenuItem key={item.text}>
              {!item.hasDropdown ? (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <a 
                    href={item.href || "/"}
                    target={isExternal(item.href) ? "_blank" : undefined}
                    rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
                  >
                        {item.icon ? (
                          <span className="mr-2 inline-block align-middle text-muted-foreground">
                            {item.icon === "custom" && item.iconUrl ? (
                              <img src={item.iconUrl} alt="" className="inline-block h-4 w-4 object-contain" />
                            ) : (
                              <SocialIcon name={item.icon} className="inline-block" />
                            )}
                          </span>
                        ) : null}
                        {item.text}
                  </a>
                </NavigationMenuLink>
              ) : (
                <>
                  <NavigationMenuTrigger>{item.text}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {item.dropdownVariant === "featured" ? (
                      // Featured variant: main button takes ~50% on right
                      <div className="flex w-[500px] gap-0">
                        <ul className="flex-1 grid gap-3 p-4">
                          {item.dropdownItems?.map((dropItem) => (
                            <ListItem
                              key={dropItem.text}
                              href={dropItem.href}
                              title={dropItem.text}
                              
                            >
                              {/* No description for featured variant */}
                            </ListItem>
                          ))}
                        </ul>
                        {item.featuredItem && (
                          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/30 rounded-r-md border-l border-border">
                            <Button
                              asChild
                              size="lg"
                              className="w-full"
                            >
                              <a 
                                href={item.featuredItem.href}
                                target={isExternal(item.featuredItem.href) ? "_blank" : undefined}
                                rel={isExternal(item.featuredItem.href) ? "noopener noreferrer" : undefined}
                              >
                                {item.featuredItem.text}
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Standard variant: simple list
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.dropdownItems?.map((dropItem) => (
                          <ListItem
                            key={dropItem.text}
                            title={dropItem.text}
                            href={dropItem.href}
                          >
                            {/* Add description if available */}
                          </ListItem>
                        ))}
                      </ul>
                    )}
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  // Default behavior with menuItems
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {itemsToRender.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.isLink ? (
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link href={item.href || ""}>{item.title}</Link>
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.content === "default" ? (
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="from-muted/30 to-muted/10 flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                            href={logoHref}
                          >
                            {logo}
                            <div className="mt-4 mb-2 text-lg font-medium">
                              {logoTitle}
                            </div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              {logoDescription}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {introItems.map((intro) => (
                        <ListItem
                          key={intro.title}
                          href={intro.href}
                          title={intro.title}
                        >
                          {intro.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : item.content === "components" ? (
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : (
                    item.content
                  )}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="list-item"
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
