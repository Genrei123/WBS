'use server'

import { revalidateTag } from 'next/cache'

export async function refreshAndRevalidate(tags: string[]): Promise<'refresh'> {
  for (const tag of tags) {
    revalidateTag(`sanity:${tag}`, 'max')
  }
  return 'refresh'
}
