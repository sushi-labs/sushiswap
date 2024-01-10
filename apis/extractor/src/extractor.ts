import * as Sentry from '@sentry/node'
import { Extractor, WarningLevel } from '@sushiswap/extractor'
// import { BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { ChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { TokenList } from 'sushi/token-list'
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

fetch('https://token-list.sushi.com')
  .then((res) => res.json() as Promise<TokenList>)
  .then((tokenList) => {
    const tokens = tokenList.tokens
      .filter((token) => token.chainId === CHAIN_ID)
      // .slice(0, 400)
      .map(
        (token) =>
          new Token({
            chainId: token.chainId,
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            name: token.name,
          }),
      )
    console.log(
      `Starting extractor for ${tokens.length} tokens, includes WETH ${
        tokens.some((token) => token.symbol === 'WETH') ? '✅' : '❌'
      } includes USDC ${
        tokens.some((token) => token.symbol === 'USDC') ? '✅' : '❌'
      } includes WBTC ${
        tokens.some((token) => token.symbol === 'WBTC') ? '✅' : '❌'
      }`,
    )
    extractor.start(tokens)
  })
  .catch((e) => {
    console.log('Error fetching tokens')
    throw e
  })

// extractor.start(BASES_TO_CHECK_TRADES_AGAINST[CHAIN_ID])

export default extractor
