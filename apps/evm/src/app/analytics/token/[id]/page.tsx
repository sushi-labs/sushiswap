import { Token } from '@sushiswap/graph-client'
import { FC } from 'react'
import notFound from 'src/app/pool/not-found'

import { unsanitize } from 'sushi'
import { getToken } from '../../../../lib/analytics/api'
import { TokenHeader } from '../../../../ui/analytics/token-page-header'
import { TokenInformation } from '../../../../ui/analytics/token-page-information'
import { TokenPairs } from '../../../../ui/analytics/token-page-pairs'
import { TokenStats } from '../../../../ui/analytics/token-page-stats'

const TokenPage: FC<{ params: { id: string } }> = async ({ params }) => {
  const token = (await getToken(unsanitize(params.id))) as Token
  if (!token) {
    return notFound()
  }

  return (
    <>
      <TokenHeader token={token} />
      <TokenStats token={token} />
      <TokenInformation token={token} />
      <TokenPairs token={token} />
    </>
  )
}

export default TokenPage
