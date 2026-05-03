import {defineType, defineField} from 'sanity'

export const navbarSettingsType = defineType({
  name: 'navbarSettings',
  title: 'Navbar',
  type: 'document',
  fields: [
    defineField({
      name: 'homeLink',
      title: 'Home Link',
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
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'internalPage',
          title: 'Select Page',
          type: 'reference',
          to: [{type: 'page'}],
          hidden: ({parent}) => parent?.linkType !== 'internal',
          validation: (Rule) => Rule.custom((value, context) => {
            if (context.parent === 'internal' && !value) {
              return 'Please select a page';
            }
            return true;
          }),
        }),
        defineField({
          name: 'externalUrl',
          title: 'External URL',
          type: 'url',
          hidden: ({parent}) => parent?.linkType !== 'external',
          validation: (Rule) => Rule.custom((value, context) => {
            if (context.parent === 'external' && !value) {
              return 'Please enter a URL';
            }
            return true;
          }),
        }),
      ],
    }),
    defineField({
      name: 'navigationItems',
      title: 'Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navigationItem',
          title: 'Navigation Item',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            {
              name: 'mainLink',
              title: 'Main Link',
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
                  hidden: ({parent}) => parent?.linkType !== 'external',
                }),
              ],
            },
            defineField({
              name: 'dropdownVariant',
              title: 'Dropdown Variant',
              type: 'string',
              options: {
                list: [
                  {title: 'None', value: 'none'},
                  {title: 'Standard List', value: 'standard'},
                  {title: 'Featured Button', value: 'featured'},
                ],
              },
              initialValue: 'none',
            }),
            defineField({
              name: 'dropdownItems',
              title: 'Dropdown Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'dropdownItem',
                  fields: [
                    {name: 'label', type: 'string', title: 'Label'},
                    {
                      name: 'linkType',
                      type: 'string',
                      title: 'Link Type',
                      options: {
                        list: [
                          {title: 'Internal Page', value: 'internal'},
                          {title: 'External URL', value: 'external'},
                        ],
                      },
                      initialValue: 'internal',
                    },
                    {
                      name: 'internalPage',
                      type: 'reference',
                      to: [{type: 'page'}],
                      hidden: ({parent}) => parent?.linkType !== 'internal',
                    },
                    {
                      name: 'externalUrl',
                      type: 'url',
                      hidden: ({parent}) => parent?.linkType !== 'external',
                    },
                  ],
                },
              ],
              hidden: ({parent}) => !parent?.dropdownVariant || parent?.dropdownVariant === 'none',
            }),
            defineField({
              name: 'featuredItem',
              title: 'Featured Button (Main CTA)',
              type: 'object',
              fields: [
                {name: 'label', type: 'string', title: 'Label'},
                {
                  name: 'linkType',
                  type: 'string',
                  title: 'Link Type',
                  options: {
                    list: [
                      {title: 'Internal Page', value: 'internal'},
                      {title: 'External URL', value: 'external'},
                    ],
                  },
                  initialValue: 'internal',
                },
                {
                  name: 'internalPage',
                  type: 'reference',
                  to: [{type: 'page'}],
                  hidden: ({parent}) => parent?.linkType !== 'internal',
                },
                {
                  name: 'externalUrl',
                  type: 'url',
                  hidden: ({parent}) => parent?.linkType !== 'external',
                },
              ],
              hidden: ({parent}) => parent?.dropdownVariant !== 'featured',
              description: 'The prominent button displayed on the right side of dropdown',
            }),
          ],
          preview: {
            select: {
              title: 'label',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(6).warning('Consider limiting to 6 items for mobile'),
    }),
    defineField({
      name: 'actions',
      title: 'Action Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navbarAction',
          title: 'Navbar Action',
          fields: [
            {name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required()},
            {
              name: 'linkType',
              type: 'string',
              title: 'Link Type',
              options: {
                list: [
                  {title: 'Internal Page', value: 'internal'},
                  {title: 'External URL', value: 'external'},
                ],
              },
              initialValue: 'internal',
            },
            {
              name: 'internalPage',
              type: 'reference',
              to: [{type: 'page'}],
              hidden: ({parent}) => parent?.linkType !== 'internal',
            },
            {
              name: 'externalUrl',
              type: 'url',
              hidden: ({parent}) => parent?.linkType !== 'external',
            },
            {
              name: 'variant',
              type: 'string',
              title: 'Button Variant',
              options: {
                list: [
                  {title: 'Default', value: 'default'},
                  {title: 'Outline', value: 'outline'},
                  {title: 'Ghost', value: 'ghost'},
                  {title: 'Secondary', value: 'secondary'},
                  {title: 'Destructive', value: 'destructive'},
                  {title: 'Glow', value: 'glow'},
                  {title: 'Link', value: 'link'},
                ],
              },
              initialValue: 'default',
            },
          ],
          preview: {
            select: {
              title: 'label',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(2).warning('Limit to 2 action buttons for best UX'),
    }),
    defineField({
      name: 'mobileLinks',
      title: 'Mobile Menu Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'mobileLink',
          fields: [
            {name: 'label', type: 'string', title: 'Label'},
            {
              name: 'linkType',
              type: 'string',
              title: 'Link Type',
              options: {
                list: [
                  {title: 'Internal Page', value: 'internal'},
                  {title: 'External URL', value: 'external'},
                ],
              },
              initialValue: 'internal',
            },
            {
              name: 'internalPage',
              type: 'reference',
              to: [{type: 'page'}],
              hidden: ({parent}) => parent?.linkType !== 'internal',
            },
            {
              name: 'externalUrl',
              type: 'url',
              hidden: ({parent}) => parent?.linkType !== 'external',
            },
          ],
        },
      ],
      description: 'Optional: Alternative links shown only in mobile menu',
    }),
  ],
})
