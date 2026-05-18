import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const heroLandingType = defineType({
  name: "heroLanding",
  title: "Hero Landing",
  type: "object",
  icon: StarIcon,
  fields: [
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
      name: "primaryCtaLabel",
      title: "Primary CTA Label",
      type: "string",
    }),
    defineField({
      name: "primaryCtaHref",
      title: "Primary CTA URL",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Secondary CTA Label",
      type: "string",
    }),
    defineField({
      name: "secondaryCtaHref",
      title: "Secondary CTA URL",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    }),
    defineField({
      name: "image",
      title: "Background Image (Light Mode)",
      description: "Full-width background image for Light Mode",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "imageDark",
      title: "Background Image (Dark Mode)",
      description: "Full-width background image for Dark Mode",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
      image: "image",
    },
    prepare({ title, eyebrow, image }) {
      return {
        title: title || "Untitled Hero Landing",
        subtitle: eyebrow || "Hero Landing Section",
        media: image,
      };
    },
  },
});
