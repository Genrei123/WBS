import {BlockElementIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const spacerSectionType = defineType({
  name: 'spacerSection',
  title: 'Spacer',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'paddingTop',
      title: 'Padding Top (px)',
      type: 'number',
      initialValue: 24,
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom (px)',
      type: 'number',
      initialValue: 24,
    }),
  ],
  preview: {
    select: {
      top: 'paddingTop',
      bottom: 'paddingBottom',
    },
    prepare({top, bottom}) {
      return {
        title: 'Spacer',
        subtitle: `${top || 24}px top / ${bottom || 24}px bottom`,
        media: BlockElementIcon,
      }
    },
  },
})
