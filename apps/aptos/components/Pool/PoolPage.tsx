'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/20/solid'
import {
  Button,
  IconButton,
  SettingsModule,
  SettingsOverlay,
} from '@sushiswap/ui'
import Loading from 'app/loading'
import { Provider } from 'aptos'
import { ContentBlock } from 'components/ContentBlock'
import { networkNameToNetwork } from 'config/chains'
import Link from 'next/link'
import { FC, useCallback } from 'react'
import { CurrencyInput } from 'ui/common/currency/currency-input/currency-input'
import { createToast } from 'ui/common/toast'
import { liquidityArgs } from 'utils/liquidityPayload'
import { usePoolPairs } from 'utils/swap-get-route/utilFunctions'
import { useAccount } from 'utils/useAccount'
import { useNetwork } from 'utils/useNetwork'
import {
  usePoolActions,
  usePoolState,
} from '../../ui/pool/pool/add/pool-add-provider/pool-add-provider'
import { AddLiquidityButton } from './AddLiquidityButton'
import { AddSectionReviewModal } from './AddSectionReviewModel'

export function Add() {
  const { isLoadingAccount } = useAccount()
  usePoolPairs()

  return (
    <>
      {isLoadingAccount && <Loading />}
      <div className="flex justify-center">
        <div className="flex flex-col gap-2">
          <Link
            className="flex items-center gap-4 mb-2 group"
            href="/pool"
            shallow={true}
          >
            <IconButton icon={ArrowLeftIcon} size="sm" name="arrow" />
            <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
              Go back to pools list
            </span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="mt-2 text-3xl font-medium">Add Liquidity</h1>
            <SettingsOverlay modules={[SettingsModule.SlippageTolerance]} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:w-[340px] md:w-[572px] gap-10">
          <div>
            <_Add />
          </div>
        </div>
      </div>
    </>
  )
}

type PayloadType = {
  type: string
  type_arguments: string[]
  arguments: number[]
  function: string
}

const _Add: FC = () => {
  const {
    setToken0,
    setToken1,
    setAmount0,
    setAmount1,
    setIndependentField,
    setisTransactionPending,
  } = usePoolActions()

  const { account, signAndSubmitTransaction } = useWallet()
  const {
    token0,
    token1,
    amount0,
    amount1,
    poolReserves,
    slippageAmount0,
    slippageAmount1,
  } = usePoolState()

  const {
    network,
    contracts: { swap: swapContract },
  } = useNetwork()

  const addLiquidity = async (close: () => void) => {
    const provider = new Provider(networkNameToNetwork(network))

    const payload: PayloadType = liquidityArgs(
      swapContract,
      token0.address,
      token1.address,
      parseInt(String(Number(amount0) * 10 ** token0.decimals)),
      parseInt(String(Number(amount1) * 10 ** token1.decimals)),
      parseInt(String(Number(slippageAmount0) * 10 ** token0.decimals)),
      parseInt(String(Number(slippageAmount1) * 10 ** token1.decimals)),
    )

    setisTransactionPending(true)
    if (!account) return []
    try {
      const response: any = await signAndSubmitTransaction(payload)
      await provider.waitForTransaction(response?.hash)
      if (!response?.success) return
      const toastId = `completed:${response?.hash}`
      const summery = poolReserves
        ? `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`
        : `Created the ${token0.symbol}/${token1.symbol} liquidity pool`
      createToast({
        summery: summery,
        toastId: toastId,
      })
      setisTransactionPending(false)
      close()
      setAmount0('')
      setAmount1('')
    } catch (_e) {
      const toastId = `failed:${Math.random()}`
      createToast({ summery: 'User rejected request', toastId: toastId })
    } finally {
      setisTransactionPending(false)
    }
  }

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      const regexPattern = /^(((0\.?)|[1-9][0-9]*)(\.[0-9]*)?)?$/
      if (regexPattern.test(value)) {
        setAmount0(value)
        setIndependentField('token0')
      }
    },
    [setAmount0, setIndependentField],
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      const regexPattern = /^(((0\.?)|[1-9][0-9]*)(\.[0-9]*)?)?$/
      if (regexPattern.test(value)) {
        setAmount1(value)
        setIndependentField('token1')
      }
    },
    [setAmount1, setIndependentField],
  )
  return (
    <>
      <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
        <ContentBlock
          title={
            <span className="text-gray-900 dark:text-white">Deposit.</span>
          }
        >
          <div className="flex flex-col gap-4">
            <CurrencyInput
              id={'liquidity-from'}
              token={token0}
              value={String(amount0)}
              onSelect={setToken0}
              onChange={onChangeToken0TypedAmount}
              type="INPUT"
              className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
            />
            <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-10">
              <div className="p-1 bg-white dark:bg-slate-900 border border-accent rounded-full">
                <PlusIcon
                  width={16}
                  height={16}
                  className="text-muted-foreground"
                />
              </div>
            </div>
            <CurrencyInput
              id={'liquidity-to'}
              token={token1}
              value={String(amount1)}
              onSelect={setToken1}
              onChange={onChangeToken1TypedAmount}
              type="INPUT"
              className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
            />
            <AddLiquidityButton
              buttonError={'asdasda'}
              token1Value={String(amount0)}
            />
          </div>
        </ContentBlock>
        <AddSectionReviewModal>
          {({ close }) => (
            <Button
              size="xl"
              fullWidth
              onClick={() => {
                addLiquidity(close)
              }}
            >
              Add
            </Button>
          )}
        </AddSectionReviewModal>
      </div>
    </>
  )
}
