import { BlockElementIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const pdfAutomation = defineType({
  name: "pdfAutomation",
  title: "PDF Automation Component",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "PDF Automation",
        media: BlockElementIcon,
      };
    },
  },
});
