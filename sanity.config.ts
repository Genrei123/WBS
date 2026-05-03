'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {resolve} from './sanity/presentation/resolve'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_STUDIO_API_VERSION ||
  '2026-05-03'

const studioMetaEnv = (import.meta as {env?: Record<string, string | undefined>}).env

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  studioMetaEnv?.SANITY_STUDIO_PROJECT_ID

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  studioMetaEnv?.SANITY_STUDIO_DATASET

if (!projectId) {
  throw new Error(
    'Missing Sanity project id. Set SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID.',
  )
}

if (!dataset) {
  throw new Error(
    'Missing Sanity dataset. Set SANITY_STUDIO_DATASET or NEXT_PUBLIC_SANITY_DATASET.',
  )
}

export default defineConfig({
  basePath: '/',
  projectId,
  dataset,
  document: {
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((item) => item.templateId !== 'siteSettings')
      }

      return prev
    },
    actions: (prev, {schemaType}) => {
      if (schemaType === 'siteSettings') {
        return prev.filter(({action}) => action !== 'duplicate' && action !== 'delete')
      }

      return prev
    },
  },
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve,
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_PREVIEW_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
