import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const pageType = defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
      description: 'Use "home" for your homepage.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Optional override for meta title.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Optional override for meta description.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({type: 'heroSection'}),
        defineArrayMember({type: 'richTextSection'}),
        defineArrayMember({type: 'ctaSection'}),
        defineArrayMember({type: 'imageSection'}),
        defineArrayMember({type: 'cardButtonSection'}),
        defineArrayMember({type: 'containerSection'}),
        defineArrayMember({type: 'spacerSection'}),
        defineArrayMember({type: 'pdfAutomation'}),
        defineArrayMember({type: 'graphicDesign'}),
      ],
      description: 'Add and reorder the sections rendered on this page.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title,
        subtitle: slug ? `/${slug}` : 'No slug',
      }
    },
  },
})
