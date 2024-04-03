import * as Sentry from '@sentry/node'
import { Extractor, Logger, LogsMessageLevel } from '@sushiswap/extractor'
import { BASES_TO_CHECK_TRADES_AGAINST } from 'sushi/config'
// import { Token } from 'sushi/currency'
// import { TokenList } from 'sushi/token-list'
import { CHAIN_ID, EXTRACTOR_CONFIG } from './config.js'

Logger.setLogsExternalHandler(
  (msg: string, level: LogsMessageLevel, context?: string) => {
    Sentry.captureMessage(
      msg,
      context === undefined
        ? level
        : {
            level,
            contexts: {
              trace: { data: { context }, trace_id: '0', span_id: '0' },
            },
          },
    )
  },
)

const extractor = new Extractor(EXTRACTOR_CONFIG[CHAIN_ID])

// const start = Date.now()
// fetch('https://token-list.sushi.com')
//   .then((res) => res.json() as Promise<TokenList>)
//   .then((tokenList) => {
//     const additional = tokenList.tokens
//       .filter((token) => token.chainId === CHAIN_ID)
//       .map(
//         (token) =>
//           new Token({
//             chainId: token.chainId,
//             address: token.address,
//             decimals: token.decimals,
//             symbol: token.symbol,
//             name: token.name,
//           }),
//       )

//     return extractor.start(BASES_TO_CHECK_TRADES_AGAINST[CHAIN_ID], additional)
//   })
//   .then(() => {
//     const time = Date.now() - start
//     console.log('Preload complete, took', time * 1000, 'seconds')
//   })
//   .catch((e) => {
//     console.log('Error fetching tokens to preload')
//     throw e
//   })

extractor.start(BASES_TO_CHECK_TRADES_AGAINST[CHAIN_ID])

export default extractor
