import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { PERPS_LANDING_API_GRAPHQL_URL } from '../../constants.js'
import { graphql } from '../../graphql.js'

export const SubmitTelegramMutation = graphql(
  `
  mutation Mutation($telegramHandle: String!, $address: String) {
    submitTelegram(telegramHandle: $telegramHandle, address: $address) {
      message
      success
    }
  }
`,
)

export type SubmitTelegram = VariablesOf<typeof SubmitTelegramMutation>

export async function submitTelegram(
  variables: SubmitTelegram,
  options?: RequestOptions,
) {
  const url = `${PERPS_LANDING_API_GRAPHQL_URL}/graphql`

  const result = await request(
    { url, document: SubmitTelegramMutation, variables },
    options,
  )
  if (result) {
    return result.submitTelegram
  }

  throw new Error('No submit telegram data')
}

export type SubmitTelegramType = Awaited<ReturnType<typeof submitTelegram>>
