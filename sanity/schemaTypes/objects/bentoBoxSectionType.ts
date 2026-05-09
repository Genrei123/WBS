import {ThLargeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const bentoBoxSectionType = defineType({
  name: 'bentoBoxSection',
  title: 'Bento Box Section',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Optional small text above the title',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main section title',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional description for the section',
    }),
    defineField({
      name: 'bentoBoxes',
      title: 'Bento Boxes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'bentoBox',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'url',
              title: 'Hoverable Link URL',
              type: 'url',
              description: 'URL to navigate to when the box is clicked',
              validation: Rule => Rule.uri({scheme: ['http', 'https', 'mailto', 'tel']})
            }),
            defineField({
              name: 'image',
              title: 'Main Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'hoverAction',
              title: 'Hover Action',
              type: 'string',
              options: {
                list: [
                  {title: 'Move Upwards', value: 'moveUp'},
                  {title: 'Move Sideways', value: 'moveSideways'},
                  {title: 'Zoom In', value: 'zoomIn'},
                  {title: 'Zoom Out', value: 'zoomOut'},
                  {title: 'Morph Image', value: 'morph'},
                ],
                layout: 'dropdown',
              },
              initialValue: 'moveUp',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'morphImage',
              title: 'Secondary Image (for Morph)',
              type: 'image',
              options: {
                hotspot: true,
              },
              hidden: ({parent}) => parent?.hoverAction !== 'morph',
            }),
            defineField({
              name: 'hasGlow',
              title: 'Enable Glow Effect',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'glowColor',
              title: 'Glow Color',
              type: 'string',
              options: {
                list: [
                  {title: 'Orange/Bronze', value: 'orange'},
                  {title: 'Blue', value: 'blue'},
                  {title: 'White', value: 'white'},
                  {title: 'Green', value: 'green'},
                ],
                layout: 'dropdown',
              },
              hidden: ({parent}) => !parent?.hasGlow,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subtitle',
              media: 'image',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
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
        title: title || 'Bento Box Section',
        subtitle: eyebrow || 'A grid of bento boxes',
        media: ThLargeIcon,
      }
    },
  },
})
