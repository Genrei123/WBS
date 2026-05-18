import { BlockElementIcon } from "@sanity/icons";
import { ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const tabPaneSectionType = defineType({
  name: "tabPaneSection",
  title: "Tab Pane Section",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "tabs",
      title: "Tabs",
      type: "array",
      of: [
        {
          type: "object",
          name: "tabItem",
          title: "Tab",
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title: title || "Untitled Tab" };
            },
          },
          fields: [
            defineField({
              name: "title",
              title: "Tab Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "ctaLabel",
              title: "Button Label",
              type: "string",
            }),
            defineField({
              name: "ctaHref",
              title: "Button URL",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Image (Deprecated - use Light/Dark images)",
              type: "image",
              hidden: true,
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "lightImage",
              title: "Light Mode Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "darkImage",
              title: "Dark Mode Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                }),
              ],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "tabs[0].title",
      media: "tabs[0].lightImage",
      alt: "tabs[0].lightImage.alt",
    },
    prepare({title, media, alt}) {
      return {
        title: title || alt || 'Image Section',
        subtitle: 'Tab Pane Section',
        media: media ?? ImageIcon,
      }
    },
  },
});