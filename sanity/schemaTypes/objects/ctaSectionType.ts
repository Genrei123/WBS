import {InlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const ctaSectionType = defineType({
  name: 'ctaSection',
  title: 'Call to Action',
  type: 'object',
  icon: InlineIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Primary CTA URL',
      type: 'url',
      validation: (Rule) => Rule.uri({allowRelative: true}),
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Secondary CTA URL',
      type: 'url',
      validation: (Rule) => Rule.uri({allowRelative: true}),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eyebrow: 'eyebrow',
    },
    prepare({title, eyebrow}) {
      return {
        title: title || 'Untitled CTA',
        subtitle: eyebrow || 'Call to Action',
        media: InlineIcon,
      }
    },
  },
})
