import {ThListIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const benefitGridSectionType = defineType({
  name: 'benefitGridSection',
  title: 'Benefit Grid',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Why teams choose this',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'A site your team can actually run.',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'benefit',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(8),
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
        title: title || 'Benefit Grid',
        subtitle: eyebrow || 'Marketing benefits section',
        media: ThListIcon,
      }
    },
  },
})
