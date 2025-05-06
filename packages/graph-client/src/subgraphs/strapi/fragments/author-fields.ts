import { graphql } from '../graphql.js'
import { ImageFieldsFragment } from './image-fields.js'

export const AuthorFieldsFragment = graphql(
  `
  fragment AuthorFields on AuthorEntity @_unmask {
    id
    attributes {
      name
      email
      handle
      avatar {
        data {
          ...ImageFields
        }
      }
    }
  }
`,
  [ImageFieldsFragment],
)
