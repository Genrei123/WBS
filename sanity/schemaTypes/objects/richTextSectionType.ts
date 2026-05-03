import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const richTextSectionType = defineType({
  name: 'richTextSection',
  title: 'Rich Text',
  type: 'object',
  icon: DocumentTextIcon,
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
  ],
  preview: {
    select: {
      title: 'title',
      eyebrow: 'eyebrow',
    },
    prepare({title, eyebrow}) {
      return {
        title: title || 'Untitled Rich Text',
        subtitle: eyebrow || 'Rich Text',
        media: DocumentTextIcon,
      }
    },
  },
})
