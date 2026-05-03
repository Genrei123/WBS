import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const imageSectionType = defineType({
  name: 'imageSection',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image (Light Mode)',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe this image for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'imageDark',
      title: 'Image (Dark Mode)',
      description: 'Optional image to display for Dark Mode. If not provided, the Light Mode image will be used.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe this image for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top (px)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom (px)',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      media: 'image',
      alt: 'image.alt',
    },
    prepare({media, alt}) {
      return {
        title: alt || 'Image Section',
        subtitle: 'Image',
        media: media ?? ImageIcon,
      }
    },
  },
})
