import { BlockElementIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const AIAutomation = defineType({
  name: "AIAutomation",
  title: "AI Automation Component",
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
        title: title || "AI Automation",
        media: BlockElementIcon,
      };
    },
  },
});
