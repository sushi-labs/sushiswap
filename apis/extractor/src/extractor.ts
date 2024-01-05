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

// extractor.start(BASES_TO_CHECK_TRADES_AGAINST[CHAIN_ID])

export default extractor
