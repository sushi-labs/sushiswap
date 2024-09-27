import { getGhostBody } from './ghost'

export type WithGhostBody<T extends Record<string, unknown>> = T & {
  body: string
}

export async function addGhostBody<T extends Record<string, unknown>>(
  data: T,
  ghostSlug: string,
) {
  const { html: ghostBody } = await getGhostBody(ghostSlug)

  return {
    ...data,
    body: ghostBody,
  }
}
