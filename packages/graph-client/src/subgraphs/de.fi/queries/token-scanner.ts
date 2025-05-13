import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { TOKEN_SCANNER_GRAPHQL_URL } from '../constants.js'
import { IssueFieldsFragment } from '../fragments/issue-fields.js'
import { graphql } from '../graphql.js'
import { TOKEN_SCANNER_REQUEST_HEADERS } from '../request-headers.js'
import { DE_FI_CHAIN_ID, type TokenScannerChainId } from '../types/index.js'

export const TokenScannerQuery = graphql(
  `query TokenScanner($address: String!, $chainId: Int!) {
    scannerProject(where: {address: $address, chainId: $chainId}) {
      aiScore
      coreIssues {
        ...IssueFields
      }
      generalIssues {
        ...IssueFields
      }
      stats {
        low
        medium
        high
        critical
        total
        percentage
        scammed
      }
    }
  }`,
  [IssueFieldsFragment],
)

export type ScanToken = Omit<
  VariablesOf<typeof TokenScannerQuery>,
  'chainId'
> & { chainId: TokenScannerChainId }

export type TokenScannerResponse = Awaited<ReturnType<typeof scanToken>>

export async function scanToken(
  _variables: ScanToken,
  options?: RequestOptions,
) {
  const variables = {
    ..._variables,
    chainId: DE_FI_CHAIN_ID[_variables.chainId],
  } as VariablesOf<typeof TokenScannerQuery>

  const result = await request(
    {
      url: TOKEN_SCANNER_GRAPHQL_URL,
      document: TokenScannerQuery,
      variables,
      requestHeaders: TOKEN_SCANNER_REQUEST_HEADERS,
    },
    options,
  )

  if (!result.scannerProject) {
    throw new Error('Failed to scanToken')
  }

  return result.scannerProject
}
