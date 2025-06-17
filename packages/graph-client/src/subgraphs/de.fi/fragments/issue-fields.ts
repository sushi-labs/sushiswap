import { graphql } from '../graphql.js'

export const IssueFieldsFragment = graphql(
  `
  fragment IssueFields on ScannerProjectScanDeclaration @_unmask {
    scwId
    scwTitle
    scwDescription
    issues {
      id
      confidence
      impact
      description
      additionalData {
        title
        description
      }
    }
  }
`,
)
