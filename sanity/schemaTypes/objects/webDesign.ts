import { BlockElementIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const webDesign = defineType({
  name: "webDesign",
  title: "Web Design Portfolio",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Section Description",
      type: "text",
    }),
    defineField({
      name: "projects",
      title: "Web Design Projects",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "webProject",
          title: "Web Project",
          fields: [
            defineField({
              name: "title",
              title: "Project Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Project Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "image",
              title: "Project Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "url",
              title: "Project URL",
              type: "url",
              description: "Link to the live project (optional)",
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "image",
            },
            prepare({ title, media }) {
              return {
                title: title || "Web Project",
                media,
              };
            },
          },
        }),
      ],
      description: "Add web design projects to showcase your work.",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Web Design Portfolio",
      };
    },
  },
});
