import {SquareIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const containerSectionType = defineType({
  name: 'containerSection',
  title: 'Container',
  type: 'object',
  icon: SquareIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Optional small text above the title',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      description: 'Optional title to display above the container',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      description: 'Optional description to display below or beside the title',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'headerLayout',
      title: 'Header Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Center', value: 'center'},
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
          {title: 'Split (Title Left, Desc Right)', value: 'split'},
        ],
      },
      initialValue: 'center',
    }),

    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid (Responsive columns)', value: 'grid'},
          {title: 'Flex Row (Wrap)', value: 'flex'},
          {title: 'Vertical Stack', value: 'stack'},
        ],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'columns',
      title: 'Grid Columns (Desktop)',
      type: 'number',
      options: {
        list: [1, 2, 3, 4],
      },
      initialValue: 3,
      hidden: ({parent}) => parent?.layout !== 'grid',
    }),
    defineField({
      name: 'gap',
      title: 'Gap',
      type: 'string',
      options: {
        list: [
          {title: 'Small (16px)', value: '4'},
          {title: 'Medium (24px)', value: '6'},
          {title: 'Large (32px)', value: '8'},
          {title: 'X-Large (48px)', value: '12'},
        ],
      },
      initialValue: '6',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top (px)',
      type: 'number',
      initialValue: 64,
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom (px)',
      type: 'number',
      initialValue: 64,
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({type: 'cardButtonSection'}),
        defineArrayMember({type: 'imageSection'}),
        defineArrayMember({type: 'richTextSection'}),
        defineArrayMember({type: 'ctaSection'}),
        defineArrayMember({type: 'pdfAutomation'}),
        defineArrayMember({type: 'headlessPageBuilderDemo'}),
        defineArrayMember({type: 'graphicDesign'}),
        defineArrayMember({type: 'webDesign'}),
        defineArrayMember({type: 'bentoBoxSection'}),
        defineArrayMember({type: 'AIAutomation'}),
        defineArrayMember({type: 'tabPaneSection'}),
      ],
      description: 'Add items to be displayed inside this container',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
      layout: 'layout'
    },
    prepare({title, items, layout}) {
      const itemCount = items?.length || 0
      return {
        title: title || 'Container',
        subtitle: `${itemCount} item(s) • ${layout} layout`,
        media: SquareIcon,
      }
    },
  },
})
