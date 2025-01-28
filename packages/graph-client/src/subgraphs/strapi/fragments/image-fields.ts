import { graphql } from '../graphql.js'

export const ImageFieldsFragment = graphql(`
  fragment ImageFields on UploadFileEntity @_unmask {
    id
    attributes {
      name
      alternativeText
      caption
      width
      height
      # formats
      mime
      url
      hash
      provider_metadata
    }
  }
`)
