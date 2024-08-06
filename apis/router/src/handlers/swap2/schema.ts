import { RouterLiquiditySource, TransferValue } from 'sushi/router'
import { isAddressFast } from 'sushi/serializer'
import type { Address } from 'viem'
import z from 'zod'

// Swap 2.0
// maxPriceImpact - max current price impact (during route planning). Default - no control
// maxSlippage - max slippage (during route processing). Default - 0.5%

export const querySchema5 = z.object({
  tokenIn: z.custom<Address>(
    (val) => isAddressFast(val),
    (val) => ({ message: `Incorrect address for tokenIn: ${val}` }),
  ),
  tokenOut: z.custom<Address>(
    (val) => isAddressFast(val),
    (val) => ({ message: `Incorrect address for tokenIn: ${val}` }),
  ),
  amount: z.coerce.bigint().positive(),
  gasPrice: z.optional(
    z.coerce
      .number()
      .int('gasPrice should be integer')
      .gt(0, 'gasPrice should be positive'),
  ),
  source: z
    .optional(z.nativeEnum(RouterLiquiditySource))
    .default(RouterLiquiditySource.Sender),
  to: z.optional(
    z.custom<Address | undefined>(
      (val) => typeof val === 'string' && isAddressFast(val),
      (val) => ({ message: `Incorrect address for 'to': ${val}` }),
    ),
  ),
  preferSushi: z.optional(z.coerce.boolean()).default(true),
  maxPriceImpact: z.optional(
    z.coerce
      .number()
      .lt(1, 'maxPriceImpact should be lesser than 1')
      .positive(),
  ),
  maxSlippage: z.coerce
    .number()
    .lt(1, 'maxSlippage should be lesser than 1')
    .positive()
    .default(0.005),
  // includeRoute: z.boolean().default(true),
  // includeRpArgs: z.boolean().default(true),
  // includeTx: z.boolean().default(true),
  enableFee: z.coerce.boolean().default(true),
  feeReceiver: z.optional(
    z.custom<Address>(
      (val) => isAddressFast(val),
      (val) => ({ message: `Incorrect fee receiver address: ${val}` }),
    ),
  ),
  feeAmount: z
    .optional(
      z.coerce
        .number()
        .lte(0.003, 'feeAmount should be less than or equal to 0.003')
        .positive(),
    )
    .default(0.0025),
  chargeFeeBy: z
    .optional(z.nativeEnum(TransferValue))
    .default(TransferValue.Output),
})

export type querySchema5 = z.infer<typeof querySchema5>
