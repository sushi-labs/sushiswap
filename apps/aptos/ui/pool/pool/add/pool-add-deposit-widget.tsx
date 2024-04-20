'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { PlusIcon } from '@heroicons/react-v1/solid'
import { Button, FormSection } from '@sushiswap/ui'
import { Provider } from 'aptos'
import { AddSectionReviewModal } from 'components/Pool/AddSectionReviewModel'
import { networkNameToNetwork } from 'config/chains'
import { FC, useCallback, useMemo } from 'react'
import { Checker } from 'ui/common/checker'
import { CurrencyInput } from 'ui/common/currency/currency-input/currency-input'
import { createToast } from 'ui/common/toast'
import {
  usePoolActions,
  usePoolState,
} from 'ui/pool/pool/add/pool-add-provider/pool-add-provider'
import { useNetwork } from 'utils/hooks/useNetwork'
import { liquidityArgs } from 'utils/payload/get-add-liquidity-payload'

export const PoolAddDepositWidget: FC = () => {
  const {
    contracts: { swap: swapContract },
    network,
  } = useNetwork()
  const { account, signAndSubmitTransaction } = useWallet()

  const {
    setToken0,
    setToken1,
    setAmount0,
    setAmount1,
    setIndependentField,
    setisTransactionPending,
  } = usePoolActions()
  const {
    token0,
    token1,
    amount0,
    amount1,
    slippageAmount0,
    slippageAmount1,
    poolReserves,
    isTransactionPending,
  } = usePoolState()

  const checkerAmounts = useMemo(() => {
    const tokens = [token0, token1]
    const amounts = [amount0, amount1]

    return tokens.map((token, i) => ({
      currency: token.address,
      amount: Number(amounts[i] || 0) / 10 ** token.decimals,
    }))
  }, [token0, token1, amount0, amount1])

  const _setAmount0 = useCallback(
    (value: string) => {
      setAmount0(value)
      setIndependentField('token0')
    },
    [setAmount0, setIndependentField],
  )

  const _setAmount1 = useCallback(
    (value: string) => {
      setAmount1(value)
      setIndependentField('token1')
    },
    [setAmount1, setIndependentField],
  )

  return (
    <FormSection
      title="Deposit"
      description="Select the amount of tokens you want to deposit"
    >
      <div className="flex flex-col gap-4">
        <CurrencyInput
          id={'liquidity-from'}
          token={token0}
          value={String(amount0)}
          onSelect={setToken0}
          onChange={_setAmount0}
          type="INPUT"
          className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
        />
        <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
          <button
            type="button"
            className="z-10 p-2 bg-gray-100 rounded-full dark:bg-slate-900"
          >
            <PlusIcon
              strokeWidth={3}
              className="w-4 h-4 dark:text-slate-400 text-slate-600"
            />
          </button>
        </div>
        <CurrencyInput
          id={'liquidity-to'}
          token={token1}
          value={String(amount1)}
          onSelect={setToken1}
          onChange={_setAmount1}
          type="INPUT"
          className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
        />
      </div>
      <Checker.Connect size="xl" fullWidth>
        <Checker.Amounts size="xl" amounts={checkerAmounts} fullWidth>
          <AddSectionReviewModal>
            <Button size="xl" fullWidth>
              Add Liquidity
            </Button>
          </AddSectionReviewModal>
        </Checker.Amounts>
      </Checker.Connect>
    </FormSection>
  )
}
