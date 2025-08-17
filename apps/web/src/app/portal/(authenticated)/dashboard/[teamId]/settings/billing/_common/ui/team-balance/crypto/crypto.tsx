'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import { StyroClient } from '@sushiswap/styro-client'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Dots,
  SkeletonBox,
  SkeletonText,
  Tabs,
  TabsContent,
  classNames,
} from '@sushiswap/ui'
import { CheckMarkIcon } from '@sushiswap/ui/icons/CheckMarkIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useQuery } from '@tanstack/react-query'
import type { SendTransactionReturnType } from '@wagmi/core'
import { useRouter } from 'next/navigation'
import type { GetServicesErc20DepositsConfig200Response } from 'node_modules/@sushiswap/styro-client/dist/generated'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { getNetworkName } from 'src/lib/network'
import { NetworkSelector } from 'src/lib/wagmi/components/network-selector'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/Currency'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { WagmiProvider } from 'src/providers/wagmi-provider'
import type { EvmChainId } from 'sushi'
import { erc20Abi_transfer } from 'sushi/abi'
import { type Amount, Token, tryParseAmount } from 'sushi/currency'
import { shortenAddress } from 'sushi/format'
import type { Address, Hex } from 'viem'
import { UserRejectedRequestError } from 'viem'
import { encodePacked } from 'viem/utils'
import { useWriteContract } from 'wagmi'
import { usePublicClient, useSimulateContract } from 'wagmi'
import { useAccount, useChainId, useDisconnect, useSwitchChain } from 'wagmi'
import { BalanceProvider } from '~evm/_common/ui/balance-provider/balance-provider'
import { PriceProvider } from '~evm/_common/ui/price-provider/price-provider/price-provider'

function useErc20BillingServiceConfig() {
  const client = useStyroClient(true)

  return useQuery({
    queryKey: ['portal-getServicesErc20DepositsConfig'],
    queryFn: async () => {
      const response = await client.getServicesErc20DepositsConfig()
      return response
    },
    select: useCallback(
      (response: GetServicesErc20DepositsConfig200Response) => ({
        chainIds: response.data.chains.map(
          (chain) => chain.chainId as EvmChainId,
        ),
        configs: response.data.chains.map((chain) => ({
          ...chain,
          chainId: chain.chainId as EvmChainId,
          stables: chain.stables.reduce(
            (acc, token) => {
              acc[token.address.toLowerCase() as Address] = new Token({
                ...token,
                chainId: chain.chainId as EvmChainId,
              })

              return acc
            },
            {} as Record<Address, Token>,
          ),
        })),
      }),
      [],
    ),
  })
}

function Deposit({
  treasury,
  teamId,
  amount,
  onTxConfirmed,
}: {
  treasury: Address
  teamId: string
  amount: Amount<Token>
  onTxConfirmed: (txData: TxData) => void
}) {
  const { address } = useAccount()

  const client = usePublicClient()

  const onSuccess = useCallback(
    async (data: SendTransactionReturnType) => {
      const receipt = client.waitForTransactionReceipt({ hash: data })

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'portal-deposit',
        chainId: amount.currency.chainId,
        txHash: data,
        promise: receipt,
        summary: {
          pending: `Depositing ${amount.toSignificant(6)} ${amount.currency.symbol}`,
          completed: `Succesfully deposited ${amount.currency.symbol}`,
          failed: `Something went wrong when depositing ${amount.currency.symbol}`,
        },
        groupTimestamp: ts,
        timestamp: ts,
      })

      await receipt
      onTxConfirmed({ txHash: data, chainId: amount.currency.chainId })
    },
    [amount, address, client.waitForTransactionReceipt, onTxConfirmed],
  )

  const onError = useCallback((e: Error) => {
    if (!(e.cause instanceof UserRejectedRequestError)) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const { data: simulation } = useSimulateContract({
    address: amount.currency.address,
    abi: erc20Abi_transfer,
    functionName: 'transfer',
    chainId: amount.currency.chainId as 1,
    args: [treasury, amount.quotient],
    dataSuffix: encodePacked(
      ['uint128'],
      [BigInt(`0x${teamId.replaceAll('-', '')}`)],
    ),
  })

  const { writeContractAsync, isPending } = useWriteContract({
    mutation: { onSuccess, onError },
  })

  const write = useMemo(() => {
    if (!writeContractAsync || !simulation) return undefined

    return async () => {
      try {
        await writeContractAsync(simulation.request)
      } catch {}
    }
  }, [writeContractAsync, simulation])

  return (
    <Button
      fullWidth
      size="xl"
      onClick={() => write?.()}
      disabled={!write || isPending}
    >
      {!isPending ? (
        'Deposit'
      ) : (
        <span>
          Depositing
          <Dots />
        </span>
      )}
    </Button>
  )
}

function DepositTab({
  teamId,
  onTxConfirmed,
}: { teamId: string; onTxConfirmed: (txData: TxData) => void }) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()

  const [value, setValue] = useState('')
  const [_token, setToken] = useState<Token | undefined>(undefined)

  const { data, isLoading } = useErc20BillingServiceConfig()

  const activeConfig = useMemo(() => {
    return data?.configs.find((chain) => chain.chainId === chainId)
  }, [data, chainId])

  const token = _token?.chainId === activeConfig?.chainId ? _token : undefined

  const isChainIdSupported = !!activeConfig

  const amount = useMemo(
    () =>
      isChainIdSupported && token ? tryParseAmount(value, token) : undefined,
    [isChainIdSupported, token, value],
  )

  useEffect(() => {
    if (!activeConfig) {
      setToken(undefined)
    } else {
      setToken(Object.values(activeConfig.stables)[0])
    }
  }, [activeConfig])

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="justify-between flex items-center px-3 py-2 rounded-xl bg-muted">
          <span>Selected Network</span>
          {!isLoading && data?.chainIds ? (
            <NetworkSelector
              networks={data.chainIds}
              selected={chainId}
              onSelect={async (chainId) => switchChainAsync({ chainId })}
            >
              <Button
                variant="secondary"
                className="flex items-center space-x-0.5"
              >
                {isChainIdSupported ? (
                  <>
                    <NetworkIcon chainId={chainId} width={24} height={24} />
                    <span className="text-md">{getNetworkName(chainId)}</span>
                  </>
                ) : (
                  'Select Network'
                )}
              </Button>
            </NetworkSelector>
          ) : (
            <SkeletonBox className="h-10 w-28" />
          )}
        </div>
        <CurrencyInput
          chainId={activeConfig?.chainId || chainId}
          currency={token}
          type="INPUT"
          value={value}
          onChange={setValue}
          onSelect={(address) => setToken(address as Token)}
          hidePricing
          currencies={activeConfig?.stables}
          currencyClassName="!rounded-xl"
          className="rounded-xl !px-3 py-2 bg-muted"
          disableInsufficientBalanceError
          loading={isLoading}
        />
        <div className="flex justify-between px-3 text-sm py-2 rounded-xl bg-muted">
          <span className="space-x-2 items-center flex">
            <div
              className={classNames(
                'w-3 h-3 rounded-full',
                address ? 'bg-green-500' : 'bg-red-500',
              )}
            />
            <span>{address ? shortenAddress(address) : 'None'}</span>
          </span>
          {address && (
            <span
              className="text-blue-500 cursor-pointer text-sm font-medium"
              onKeyUp={() => disconnect()}
              onClick={() => disconnect()}
            >
              Disconnect
            </span>
          )}
        </div>
      </div>
      <CheckerProvider>
        <Checker.Guard
          guardText="Select a supported network"
          guardWhen={!isChainIdSupported || !activeConfig}
        >
          {activeConfig && (
            <Checker.Connect>
              <Checker.Network chainId={activeConfig?.chainId}>
                <Checker.Amounts
                  chainId={amount?.currency.chainId}
                  amount={amount}
                >
                  {amount && (
                    <Deposit
                      teamId={teamId}
                      treasury={activeConfig.treasury}
                      amount={amount}
                      onTxConfirmed={onTxConfirmed}
                    />
                  )}
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connect>
          )}
        </Checker.Guard>
      </CheckerProvider>
    </div>
  )
}

function Steps({ steps }: { steps: { text: string; completed: boolean }[] }) {
  const lastCompleted = steps.findIndex((step) => !step.completed) - 1

  return (
    <div key="steps" className="flex flex-row items-center w-full px-6">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div
            className={classNames(
              step.completed ? 'bg-blue-500' : 'border-opacity-50',
              lastCompleted + 1 === i && 'animate-pulse',
              'h-10 w-10 rounded-full border-blue-500 border-2 flex-shrink-0 relative flex justify-center items-center',
            )}
          >
            {step.completed && <CheckMarkIcon className="!text-transparent" />}
            <div className="absolute top-12 text-sm">{step.text}</div>
          </div>
          {steps.length - 1 !== i && (
            <div
              className={classNames(
                lastCompleted === i && 'animate-pulse',
                !step.completed && 'bg-opacity-50',
                'w-full h-1 bg-blue-500',
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

type TxData = {
  txHash: Hex
  chainId: EvmChainId
}

function WaitTab({ txData }: { txData: TxData }) {
  const router = useRouter()
  const client = useStyroClient(true)

  const { data: config, isLoading: isConfigLoading } =
    useErc20BillingServiceConfig()

  const { data, isLoading } = useQuery({
    queryKey: ['portal-getServicesErc20DepositsTxStatus', txData],
    queryFn: async () => {
      const response = await client.getServicesErc20DepositsTxStatus({
        txHash: txData.txHash,
        chainId: String(txData.chainId),
      })

      return response
    },
    select: (response) => response.data,
    refetchInterval: 2500,
  })

  const chainConfig = config?.configs.find(
    (chain) => chain.chainId === txData.chainId,
  )

  useEffect(() => {
    if (data?.txState.type === 'CONFIRMED') {
      router.refresh()
    }
  }, [data?.txState, router])

  if (isLoading) {
    return <div className="h-52 w-full">loading</div>
  }

  if (!data) {
    return <div className="h-52 w-full">error</div>
  }

  return (
    <div className="h-52 flex items-center justify-between w-full flex-col space-y-8 mt-8 pb-12">
      <span className="text-2xl font-medium items-center justify-center flex flex-col h-full">
        {data.txState.type === 'UNKNOWN' && (
          <div>
            Looking for transaction
            <Dots />
          </div>
        )}
        {data.txState.type === 'SEEN' && (
          <div>
            Transaction found, pending
            <Dots />
          </div>
        )}
        {data.txState.type === 'PENDING' && (
          <div className="flex items-center justify-between flex-col space-y-2">
            <span>
              Transaction succeeded, confirming
              <Dots />
            </span>
            <span className="text-base">
              {data.txState.confirmations}/
              {!isConfigLoading && chainConfig ? (
                <>{chainConfig.confirmations}</>
              ) : (
                <SkeletonText className="w-4" />
              )}
            </span>
          </div>
        )}
        {data.txState.type === 'CONFIRMED' && <div>Transaction confirmed</div>}
      </span>

      <Steps
        steps={[
          {
            text: 'Detected',
            completed:
              data.txState.type === 'SEEN' ||
              data.txState.type === 'PENDING' ||
              data.txState.type === 'CONFIRMED',
          },
          {
            text: 'Confirmed',
            completed:
              data.txState.type === 'PENDING' ||
              data.txState.type === 'CONFIRMED',
          },
          { text: 'Finalized', completed: data.txState.type === 'CONFIRMED' },
        ]}
      />
    </div>
  )
}

export function Crypto({ teamId }: { teamId: string }) {
  const [tab, setTab] = useState<'deposit' | 'wait'>('deposit')
  const [txData, setTxData] = useState<TxData | undefined>()

  return (
    <WagmiProvider>
      <Tabs value={tab}>
        <TabsContent value="deposit">
          <BalanceProvider>
            <PriceProvider>
              <DepositTab
                teamId={teamId}
                onTxConfirmed={(txData) => {
                  setTxData(txData)
                  setTab('wait')
                }}
              />
            </PriceProvider>
          </BalanceProvider>
        </TabsContent>
        <TabsContent value="wait">
          {txData && <WaitTab txData={txData} />}
        </TabsContent>
      </Tabs>
    </WagmiProvider>
  )
}
