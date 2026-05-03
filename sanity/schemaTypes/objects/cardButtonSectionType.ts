import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const cardButtonSectionType = defineType({
  name: 'cardButtonSection',
  title: 'Card Button',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'object',
      fields: [
        defineField({
          name: 'linkType',
          title: 'Link Type',
          type: 'string',
          options: {
            list: [
              {title: 'Internal Page', value: 'internal'},
              {title: 'External URL', value: 'external'},
            ],
          },
          initialValue: 'internal',
        }),
        defineField({
          name: 'internalPage',
          title: 'Select Page',
          type: 'reference',
          to: [{type: 'page'}],
          hidden: ({parent}) => parent?.linkType !== 'internal',
        }),
        defineField({
          name: 'externalUrl',
          title: 'External URL',
          type: 'url',
          validation: (Rule) => Rule.uri({allowRelative: true}),
          hidden: ({parent}) => parent?.linkType !== 'external',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      media: 'image',
    },
    prepare({title, description, media}) {
      return {
        title: title || 'Untitled Card Button',
        subtitle: description || 'Card Button',
        media: media ?? LinkIcon,
      }
    },
  },
})
