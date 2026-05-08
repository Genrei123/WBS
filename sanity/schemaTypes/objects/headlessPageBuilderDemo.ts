import {BlockElementIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const headlessPageBuilderDemo = defineType({
  name: 'headlessPageBuilderDemo',
  title: 'Headless Page Builder Demo',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Headless Page Builder',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Build pages from reusable CMS blocks',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      initialValue:
        'A frontend-only demo that shows how Sanity-powered pages can add, edit, reorder, preview, and publish reusable website sections.',
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA Label',
      type: 'string',
      initialValue: 'Try the demo',
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Primary CTA URL',
      type: 'url',
      validation: (Rule) => Rule.uri({allowRelative: true}),
      initialValue: '#builder-demo',
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA Label',
      type: 'string',
      initialValue: 'See the workflow',
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Secondary CTA URL',
      type: 'url',
      validation: (Rule) => Rule.uri({allowRelative: true}),
      initialValue: '#builder-workflow',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top (px)',
      type: 'number',
      initialValue: 96,
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom (px)',
      type: 'number',
      initialValue: 96,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eyebrow: 'eyebrow',
    },
    prepare({title, eyebrow}) {
      return {
        title: title || 'Headless Page Builder Demo',
        subtitle: eyebrow || 'Interactive CMS demo',
        media: BlockElementIcon,
      }
    },
  },
})
