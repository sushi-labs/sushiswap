import { z } from 'zod'
import { ChainId } from '@sushiswap/chain'
import { SwapChainId } from '../../types'
import { isUniswapV2FactoryChainId } from '@sushiswap/sushiswap'
import { isConstantProductPoolFactoryChainId, isStablePoolFactoryChainId } from '@sushiswap/trident'
import { isV3ChainId } from '@sushiswap/v3-sdk'
import { defaultQuoteCurrency } from '@sushiswap/currency'

export const queryParamsSchema = z
  .object({
    fromChainId: z.coerce
      .number()
      .int()
      .gte(0)
      .lte(2 ** 256)
      .optional()
      .transform((_chainId) => {
        let chainId: ChainId = ChainId.ETHEREUM
        if (
          _chainId &&
          (isV3ChainId(_chainId) ||
            isUniswapV2FactoryChainId(_chainId) ||
            isConstantProductPoolFactoryChainId(_chainId) ||
            isStablePoolFactoryChainId(_chainId))
        ) {
          chainId = _chainId
        }
        return chainId as SwapChainId
      }),
    fromCurrency: z.string().default('NATIVE'),
    toChainId: z.coerce
      .number()
      .int()
      .gte(0)
      .lte(2 ** 256)
      .optional()
      .transform((_chainId) => {
        let chainId: ChainId = ChainId.ETHEREUM
        if (
          _chainId &&
          (isV3ChainId(_chainId) ||
            isUniswapV2FactoryChainId(_chainId) ||
            isConstantProductPoolFactoryChainId(_chainId) ||
            isStablePoolFactoryChainId(_chainId))
        ) {
          chainId = _chainId
        }
        return chainId as SwapChainId
      }),
    toCurrency: z.string().default('SUSHI'),
    amount: z.string().default(''),
    recipient: z.optional(z.coerce.string()),
    review: z.optional(z.coerce.boolean()),
  })
  .transform((val) => {
    return {
      ...val,
      toCurrency:
        val.toCurrency === 'SUSHI' && defaultQuoteCurrency[val.toChainId as keyof typeof defaultQuoteCurrency]?.address
          ? defaultQuoteCurrency[val.toChainId as keyof typeof defaultQuoteCurrency].address
          : val.toCurrency,
    }
  })
