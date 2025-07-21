'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { Button, Dots } from '@sushiswap/ui'
import { useCallback, useMemo, useState } from 'react'
import { useTrade, useTradeQuote } from 'src/lib/hooks/react-query'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  useApproved,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/Checker/Provider'
import { gasMargin } from 'sushi/calculate'
import { ChainId } from 'sushi/chain'
import { RED_SNWAPPER_ADDRESS } from 'sushi/config'
import { SUSHI, type Token, XSUSHI, tryParseAmount } from 'sushi/currency'
import { type SendTransactionReturnType, UserRejectedRequestError } from 'viem'
import { useAccount, usePublicClient, useSendTransaction } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { BarSectionWidget } from './BarSectionWidget'

const SLIPPAGE = '0'

export const BarSection = withCheckerRoot(
  ({
    approveTag,
    inputToken,
    outputToken,
  }: { approveTag: string; inputToken: Token; outputToken: Token }) => {
    const { approved } = useApproved(approveTag)

    const [input, setInput] = useState('')

    const action = inputToken.equals(SUSHI[ChainId.ETHEREUM])
      ? 'stake'
      : 'unstake'

    const parsedInput = useMemo(() => {
      return tryParseAmount(input, inputToken)
    }, [input, inputToken])

    const { address } = useAccount()
    const client = usePublicClient()

    const { refetchChain: refetchBalances } = useRefetchBalances()

    const onSuccess = useCallback(
      (data: SendTransactionReturnType) => {
        if (!parsedInput) return

        const receipt = client.waitForTransactionReceipt({ hash: data })
        receipt.then(() => {
          refetchBalances(ChainId.ETHEREUM)
        })

        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'enterBar',
          chainId: ChainId.ETHEREUM,
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
      if (!(e.cause instanceof UserRejectedRequestError)) {
        createErrorToast(e?.message, true)
      }
    }, [])

    const useQuote = Boolean(!address || !approved)

    const { data: quote } = useTradeQuote({
      chainId: ChainId.ETHEREUM,
      fromToken: inputToken,
      toToken: outputToken,
      amount: parsedInput,
      slippagePercentage: SLIPPAGE,
      recipient: address,
      enabled: Boolean(parsedInput?.greaterThan(0) && useQuote),
      carbonOffset: false,
      onlyPools: [XSUSHI[ChainId.ETHEREUM].address],
    })

    const { data: trade } = useTrade({
      chainId: ChainId.ETHEREUM,
      fromToken: inputToken,
      toToken: outputToken,
      amount: parsedInput,
      slippagePercentage: SLIPPAGE,
      recipient: address,
      enabled: Boolean(parsedInput?.greaterThan(0) && !useQuote),
      carbonOffset: false,
      onlyPools: [XSUSHI[ChainId.ETHEREUM].address],
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
            gas: gas ? gasMargin(BigInt(gas)) : undefined,
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
            chainId={ChainId.ETHEREUM}
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
              chainId={ChainId.ETHEREUM}
              amount={parsedInput}
            >
              <Checker.ApproveERC20
                size="xl"
                id="approve-sushi"
                className="whitespace-nowrap"
                fullWidth
                amount={parsedInput}
                contract={RED_SNWAPPER_ADDRESS[ChainId.ETHEREUM]}
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
