import type { ResultOf } from 'gql.tada'
import type { ImageFieldsFragment } from 'src/subgraphs/strapi/fragments/image-fields.js'

export type Image = ReturnType<typeof transformImage>

export function transformImage(image: ResultOf<typeof ImageFieldsFragment>) {
  return {
    id: image.id,
    url: image.attributes.url,
    name: image.attributes.name,
    width: image.attributes.width!,
    height: image.attributes.height!,
    caption: image.attributes.caption || '',
    alternativeText: image.attributes.alternativeText || '',
    mime: image.attributes.mime,
    hash: image.attributes.hash,
    provider_metadata: image.attributes.provider_metadata,
  }
}
