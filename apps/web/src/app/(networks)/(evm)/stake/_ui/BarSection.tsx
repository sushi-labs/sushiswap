'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { Button, Dots } from '@sushiswap/ui'
import { useCallback, useMemo, useState } from 'react'
import { useTrade, useTradeQuote } from 'src/lib/hooks/react-query'
import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  useApproved,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/Checker/provider'
import { Amount } from 'sushi'
import {
  EvmChainId,
  type EvmToken,
  RED_SNWAPPER_ADDRESS,
  SUSHI,
  XSUSHI,
  addGasMargin,
} from 'sushi/evm'
import type { SendTransactionReturnType } from 'viem'
import { useConnection, usePublicClient, useSendTransaction } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { BarSectionWidget } from './BarSectionWidget'

export const BarSection = withCheckerRoot(
  ({
    approveTag,
    inputToken,
    outputToken,
  }: { approveTag: string; inputToken: EvmToken; outputToken: EvmToken }) => {
    const { approved } = useApproved(approveTag)

    const [input, setInput] = useState('')

    const action = inputToken.isSame(SUSHI[EvmChainId.ETHEREUM])
      ? 'stake'
      : 'unstake'

    const parsedInput = useMemo(() => {
      return Amount.tryFromHuman(inputToken, input)
    }, [input, inputToken])

    const { address } = useConnection()
    const client = usePublicClient()

    const { refetchChain: refetchBalances } = useRefetchBalances()

    const onSuccess = useCallback(
      (data: SendTransactionReturnType) => {
        if (!parsedInput) return

        const receipt = client.waitForTransactionReceipt({ hash: data })
        receipt.then(() => {
          refetchBalances(EvmChainId.ETHEREUM)
        })

        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'enterBar',
          chainId: EvmChainId.ETHEREUM,
          txHash: data,
          promise: receipt,
          summary: {
            pending: `${action === 'stake' ? 'Staking' : 'Unstaking'} ${parsedInput.toSignificant(6)} SUSHI`,
            completed: `Successfully ${action === 'stake' ? 'staked' : 'unstaked'} SUSHI`,
            failed: `Something went wrong when ${action === 'stake' ? 'staking' : 'unstaking'} SUSHI`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      },
      [refetchBalances, parsedInput, address, client, action],
    )

    const onError = useCallback((e: Error) => {
      if (isUserRejectedError(e)) {
        return
      }

      logger.error(e, {
        location: 'BarSection',
        action: 'mutationError',
      })
      createErrorToast(e?.message, true)
    }, [])

    const useQuote = Boolean(!address || !approved)

    const { data: quote } = useTradeQuote({
      chainId: EvmChainId.ETHEREUM,
      fromToken: inputToken,
      toToken: outputToken,
      amount: parsedInput,
      slippagePercentage: '0',
      recipient: address,
      enabled: Boolean(parsedInput?.gt(0n) && useQuote),
      carbonOffset: false,
      onlyPools: [XSUSHI[EvmChainId.ETHEREUM].address],
      fee: 0,
    })

    const { data: trade } = useTrade({
      chainId: EvmChainId.ETHEREUM,
      fromToken: inputToken,
      toToken: outputToken,
      amount: parsedInput,
      slippagePercentage: '0',
      recipient: address,
      enabled: Boolean(parsedInput?.gt(0n) && !useQuote),
      carbonOffset: false,
      onlyPools: [XSUSHI[EvmChainId.ETHEREUM].address],
      fee: 0,
    })

    const amountOut = (useQuote ? quote : trade)?.amountOut

    const { sendTransactionAsync, isPending: isWritePending } =
      useSendTransaction({
        mutation: { onSuccess, onError },
      })

    const write = useMemo(() => {
      if (!sendTransactionAsync || !trade?.tx || address !== trade.tx.from)
        return undefined

      const { to, gas, data, value } = trade.tx

      return async () => {
        try {
          await sendTransactionAsync({
            to,
            data,
            value,
            gas: gas ? addGasMargin(BigInt(gas)) : undefined,
          })
        } catch {}
      }
    }, [address, sendTransactionAsync, trade?.tx])

    return (
      <BarSectionWidget
        input={input}
        amountOut={amountOut}
        onInput={setInput}
        inputToken={inputToken}
        outputToken={outputToken}
      >
        <Checker.Connect size="xl" fullWidth>
          <Checker.Network
            size="xl"
            fullWidth
            chainId={EvmChainId.ETHEREUM}
            hoverCardContent={
              <span className="text-xs text-muted-foreground text-center w-full">
                {`Sushi Bar is only available on Ethereum Mainnet. You are
                connected to an unsupported network.`}
              </span>
            }
          >
            <Checker.Amounts
              size="xl"
              fullWidth
              chainId={EvmChainId.ETHEREUM}
              amount={parsedInput}
            >
              <Checker.ApproveERC20
                size="xl"
                id="approve-sushi"
                className="whitespace-nowrap"
                fullWidth
                amount={parsedInput}
                contract={RED_SNWAPPER_ADDRESS[EvmChainId.ETHEREUM]}
              >
                <Checker.Success tag={approveTag}>
                  <Button
                    size="xl"
                    onClick={() => write?.().then(() => setInput(''))}
                    fullWidth
                    disabled={isWritePending || !approved || !write}
                    testId="stake-sushi"
                  >
                    {isWritePending ? (
                      <Dots>Confirm transaction</Dots>
                    ) : action === 'stake' ? (
                      'Stake'
                    ) : (
                      'Unstake'
                    )}
                  </Button>
                </Checker.Success>
              </Checker.ApproveERC20>
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connect>
      </BarSectionWidget>
    )
  },
)
