import { defineField, defineType } from "sanity";

export const footerSettingsType = defineType({
  name: "footerSettings",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "columns",
      title: "Footer Columns",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerColumn",
          title: "Footer Column",
          fields: [
            defineField({
              name: "title",
              title: "Column Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "footerLink",
                  fields: [
                    { name: "text", type: "string", title: "Link Text" },
                    {
                      name: "linkType",
                      type: "string",
                      title: "Link Type",
                      options: {
                        list: [
                          { title: "Internal Page", value: "internal" },
                          { title: "External URL", value: "external" },
                        ],
                      },
                      initialValue: "internal",
                    },
                    {
                      name: "internalPage",
                      type: "reference",
                      to: [{ type: "page" }],
                      title: "Select Page",
                      hidden: ({ parent }) => parent?.linkType !== "internal",
                    },
                    {
                      name: "externalUrl",
                      type: "url",
                      title: "External URL",
                      hidden: ({ parent }) => parent?.linkType !== "external",
                    },
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
            },
          },
        },
      ],
    }),
    defineField({
      name: "copyright",
      title: "Copyright Text",
      type: "string",
      initialValue: "© 2026 Mikołaj Dobrucki. All rights reserved",
    }),
    defineField({
      name: "policies",
      title: "Policy Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "policyLink",
          fields: [
            { name: "text", type: "string", title: "Link Text" },
            {
              name: "linkType",
              type: "string",
              title: "Link Type",
              options: {
                list: [
                  { title: "Internal Page", value: "internal" },
                  { title: "External URL", value: "external" },
                ],
              },
              initialValue: "internal",
            },
            {
              name: "internalPage",
              type: "reference",
              to: [{ type: "page" }],
              title: "Select Page",
              hidden: ({ parent }) => parent?.linkType !== "internal",
            },
            {
              name: "externalUrl",
              type: "url",
              title: "External URL",
              hidden: ({ parent }) => parent?.linkType !== "external",
            },
          ],
        },
      ],
      description: "Links like Privacy Policy, Terms of Service, etc.",
    }),
  ],
  preview: {
    select: {
      firstColumn: "columns.0.title",
      copyright: "copyright",
    },
    prepare({ firstColumn, copyright }) {
      return {
        title: firstColumn || "Footer Settings",
        subtitle: copyright || undefined,
      };
    },
  },
});
