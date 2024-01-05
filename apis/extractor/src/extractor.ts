import * as Sentry from '@sentry/node'
import { Extractor, WarningLevel } from '@sushiswap/extractor'
import { TokenInfo } from 'sushi'
import { ChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { CHAIN_ID, EXTRACTOR_CONFIG } from './config'

const extractor = new Extractor({
  ...EXTRACTOR_CONFIG[CHAIN_ID],
  warningMessageHandler: (
    chain: ChainId | number | undefined,
    message: string,
    level: WarningLevel,
  ) => {
    Sentry.captureMessage(`${chain}: ${message}`, level)
  },
})

fetch(`https://tokens.sushi.com/v1/${CHAIN_ID}`)
  .then((res) => res.json() as Promise<TokenInfo[]>)
  .then((tokenList) => {
    extractor.start(tokenList as Token[])
  })

// extractor.start(BASES_TO_CHECK_TRADES_AGAINST[CHAIN_ID])

export default extractor
