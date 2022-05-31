import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { Currency, CurrencyAmount, Rebase, Token } from '@sushiswap/core-sdk'
import { computeConstantProductPoolAddress, Fee } from '@sushiswap/trident-sdk'
import { SelectedAsset, SpendSource } from 'app/features/trident/create/SelectedAsset'
import { toShareJSBI } from 'app/functions'

const sortTokens = (assets: SelectedAsset[]): [Token, Token] => {
  const [a, b] = assets.map((asset) => asset.currency!!.wrapped)
  return a.sortsBefore(b) ? [a, b] : [b, a]
}

const addLiquidityAction = ({
  assets,
  rebases,
  constantProductPoolFactory,
  router,
  feeTier,
  twap,
  account,
}: PoolCreationActionProps) => {
  const liquidityInput = assets.map((asset) => {
    const spendFromWallet = asset.spendFromSource === SpendSource.WALLET
    return {
      token: asset.currency?.isNative && spendFromWallet ? AddressZero : asset.parsedAmount!!.currency.wrapped.address,
      native: spendFromWallet,
      amount: spendFromWallet
        ? asset.parsedAmount!!.quotient.toString()
        : toShareJSBI(rebases[asset.currency!!.wrapped.address], asset.parsedAmount!!.quotient).toString(),
    }
  })
  const [tokenA, tokenB] = sortTokens(assets)

  return router?.interface?.encodeFunctionData('addLiquidity', [
    liquidityInput,
    computeConstantProductPoolAddress({
      factoryAddress: constantProductPoolFactory.address,
      tokenA,
      tokenB,
      fee: feeTier,
      twap,
    }),
    1,
    defaultAbiCoder.encode(['address'], [account]),
  ])
}

const deployNewPoolAction = ({
  assets,
  constantProductPoolFactory,
  router,
  feeTier,
  twap,
}: PoolCreationActionProps): string => {
  const [tokenA, tokenB] = sortTokens(assets)
  const deployData = defaultAbiCoder.encode(
    ['address', 'address', 'uint8', 'bool'],
    [tokenA.wrapped.address, tokenB.wrapped.address, feeTier, twap]
  )

  return router.interface.encodeFunctionData('deployPool', [constantProductPoolFactory.address, deployData])
}

type NativeIdentifier = { value?: string }

/* Native Eth must be passed with a value object */
export const valueIfNative = (parsedAmounts: CurrencyAmount<Currency>[]): NativeIdentifier => {
  const indexOfNative = parsedAmounts.findIndex((el: CurrencyAmount<Currency>) => el.currency.isNative)
  return indexOfNative >= 0 ? { value: parsedAmounts[indexOfNative]!!.quotient.toString() } : {}
}

export interface PoolCreationActionProps {
  account: string
  assets: SelectedAsset[]
  feeTier: Fee
  twap: boolean
  router: Contract
  constantProductPoolFactory: Contract
  rebases: Record<string, Rebase>
  parsedAmounts: CurrencyAmount<Currency>[]
}

type BatchAction = string

export const poolCreationActions = (props: PoolCreationActionProps): BatchAction[] => {
  return [deployNewPoolAction(props), addLiquidityAction(props)]
}
