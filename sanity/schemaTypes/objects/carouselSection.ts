import { BlockElementIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const carouselSectionType = defineType({
  name: "carouselSection",
  title: "Carousel Section",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Section Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "items",
      title: "Carousel Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "item",
          title: "Item",
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title: title || "Untitled Item" };
            },
          },
          fields: [
            defineField({
              name: "backgroundImage",
              title: "Background Image",
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
              name: "eyebrow",
              title: "Eyebrow",
              type: "string",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
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
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      items: "items",
    },
    prepare({ title, items }) {
      return {
        title: title || "Carousel",
        subtitle: `${items?.length || 0} items`,
      };
    },
  },
});
