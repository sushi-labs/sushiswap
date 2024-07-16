import { graphql } from '../graphql'
import { ImageFieldsFragment } from './image-fields'

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
