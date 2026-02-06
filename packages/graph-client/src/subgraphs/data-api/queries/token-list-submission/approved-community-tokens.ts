import { request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const ApprovedCommunityTokensQuery = graphql(
  `
 query ApprovedCommunityTokens {
  evm: approvedCommunityTokens {
    ... on EvmApprovedToken {
      chainId
      address
      symbol
      name
      decimals
      approved
      logoUrl
    }
  }
  svm: approvedCommunityTokens {
    ... on SvmApprovedToken {
      chainId
      address
      symbol
      name
      decimals
      approved
      logoUrl
    }
  }
}
`,
)

export async function getApprovedCommunityTokens() {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request({
    url,
    document: ApprovedCommunityTokensQuery,
    requestHeaders: SUSHI_REQUEST_HEADERS,
  })

  if (result) {
    return [...result.evm, ...result.svm]
  }

  throw new Error('No Approved Community Tokens found')
}

export type ApprovedCommunityTokens = Awaited<
  ReturnType<typeof getApprovedCommunityTokens>
>
