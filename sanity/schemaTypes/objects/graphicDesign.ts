import { BlockElementIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const graphicDesign = defineType({
  name: "graphicDesign",
  title: "Graphic Design Assets",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "graphicImage",
          title: "Graphic Image",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "image",
            },
            prepare({ title, media }) {
              return {
                title: title || "Graphic Image",
                media,
              };
            },
          },
        }),
      ],
      description: "Upload images to be used as textures, backgrounds, or references.",
    }),
    defineField({
      name: "models",
      title: "3D Models",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "graphicModel",
          title: "Graphic Model",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "thumbnail",
              title: "Thumbnail",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "file",
              type: "file",
              title: "3D Model File",
              options: {
                accept: "model/gltf-binary,model/gltf+json,model/vnd.usdz+zip,application/octet-stream,application/zip",
              },
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "thumbnail",
            },
            prepare({ title, media }) {
              return {
                title: title || "Graphic Model",
                media,
              };
            },
          },
        }),
      ],
      description: "Upload 3D model files for later rendering.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      image0: "images.0.image",
      images: "images",
      models: "models",
    },
    prepare(selection) {
      const { title, image0, images, models } = selection as any;
      const countImages = (images || []).length;
      const countModels = (models || []).length;
      return {
        title: title || "Graphic Design",
        subtitle: `${countImages} image(s), ${countModels} model(s)`,
        media: image0 ? image0 : BlockElementIcon,
      };
    },
  },
});
