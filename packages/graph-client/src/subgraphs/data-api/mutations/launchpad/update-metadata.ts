import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const UpdateLaunchpadMetadataMutation = graphql(
  `
    mutation UpdateLaunchpadMetadata($input: LaunchpadUpdateMetadataInput!, $signature: Bytes!) {
      launchpad {
        updateMetadata(input: $input, signature: $signature) {
          description
          links {
            kind
            url
            label
          }
          revision
          updatedAt
        }
      }
    }
  `,
)

export type UpdateLaunchpadMetadata = VariablesOf<
  typeof UpdateLaunchpadMetadataMutation
>

export async function updateLaunchpadMetadata(
  variables: UpdateLaunchpadMetadata,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: UpdateLaunchpadMetadataMutation,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) return result.launchpad.updateMetadata

  throw new Error('No updated launchpad metadata')
}

export type UpdatedLaunchpadMetadata = Awaited<
  ReturnType<typeof updateLaunchpadMetadata>
>
