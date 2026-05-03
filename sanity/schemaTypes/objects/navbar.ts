import {defineType, defineField} from 'sanity'

// Dropdown item type for navigation items with dropdown variants
export const dropdownItemType = defineType({
  name: 'dropdownItem',
  title: 'Dropdown Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Internal page slug (e.g., "services") or external URL (e.g., "https://example.com")',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
    },
  },
})

// Navigation item type with dropdown variant support
export const navigationItemType = defineType({
  name: 'navigationItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Internal page slug (e.g., "services") or external URL (e.g., "https://example.com")',
    }),
    defineField({
      name: 'dropdownVariant',
      title: 'Dropdown Variant',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Standard List', value: 'standard'},
          {title: 'Featured Button', value: 'featured'},
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'dropdownItems',
      title: 'Dropdown Items',
      type: 'array',
      of: [{type: 'dropdownItem'}],
      hidden: ({parent}) => !parent?.dropdownVariant || parent?.dropdownVariant === 'none',
    }),
    defineField({
      name: 'featuredItem',
      title: 'Featured Button (Main CTA)',
      type: 'dropdownItem',
      hidden: ({parent}) => parent?.dropdownVariant !== 'featured',
      description: 'The prominent button displayed on the right side of dropdown',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
      variant: 'dropdownVariant',
    },
    prepare({title, subtitle, variant}) {
      return {
        title,
        subtitle: subtitle || (variant && variant !== 'none' ? `Dropdown: ${variant}` : 'No link'),
      }
    },
  },
})

// Action button type for navbar actions
export const navbarActionType = defineType({
  name: 'navbarAction',
  title: 'Navbar Action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Internal page slug or external URL',
    }),
    defineField({
      name: 'variant',
      title: 'Button Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Outline', value: 'outline'},
          {title: 'Ghost', value: 'ghost'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Destructive', value: 'destructive'},
          {title: 'Glow', value: 'glow'},
          {title: 'Link', value: 'link'},
        ],
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'variant',
    },
  },
})

// Main navbar type
export const navbarType = defineType({
  name: 'navbar',
  title: 'Navbar',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Brand Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Launch UI',
    }),
    defineField({
      name: 'logoUrl',
      title: 'Logo URL',
      type: 'url',
      description: 'URL to logo image or relative path',
    }),
    defineField({
      name: 'homeUrl',
      title: 'Home URL',
      type: 'string',
      initialValue: '/',
      description: 'Where logo/brand name links to',
    }),
    defineField({
      name: 'navigationItems',
      title: 'Navigation Items',
      type: 'array',
      of: [{type: 'navigationItem'}],
      validation: (Rule) => Rule.max(6).warning('Consider limiting to 6 items for mobile'),
    }),
    defineField({
      name: 'actions',
      title: 'Action Buttons',
      type: 'array',
      of: [{type: 'navbarAction'}],
      validation: (Rule) => Rule.max(2).warning('Limit to 2 action buttons for best UX'),
    }),
    defineField({
      name: 'mobileLinks',
      title: 'Mobile Menu Links',
      type: 'array',
      of: [{type: 'navigationItem'}],
      description: 'Optional: Alternative links shown only in mobile menu',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      items: 'navigationItems.0.label',
    },
    prepare({title, items}) {
      return {
        title: title || 'Navbar',
        subtitle: items ? `${items} +` : 'Empty navigation',
      }
    },
  },
})
