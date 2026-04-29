'use client'
import { createToast } from '@sushiswap/notifications'
import {
  Button,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { type EvmAddress, EvmChainId, USDC, erc20Abi_transfer } from 'sushi/evm'
import { usePublicClient, useSimulateContract, useWriteContract } from 'wagmi'
import { useBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { InputWithKeyboard } from '../_common'
import { PerpsChecker } from '../perps-checker'

//@todo add more options
const usdc = USDC[EvmChainId.ARBITRUM]
const chainId = EvmChainId.ARBITRUM
const HYPERLIQUID_DEPOSIT_BRIDGE =
  '0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7' as EvmAddress
const MIN_DEPOSIT_AMOUNT = 5 //5.000000 usdc

//@dev simple deposit via transfer for the time being
export const DepositDialog = ({
  trigger,
  isOpen,
  onOpenChange,
}: {
  trigger?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const { mutateAsync: writeContractAsync, isPending } = useWriteContract()
  const client = usePublicClient()
  const address = useAccount('evm')
  const { data: bigIntBalance, isLoading: isBalanceLoading } = useBalance(usdc)

  const balance = useMemo(
    () => (bigIntBalance ? new Amount(usdc, bigIntBalance) : undefined),
    [bigIntBalance],
  )
  const _amount = useMemo(() => Amount.tryFromHuman(usdc, amount), [amount])

  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen)
      } else {
        setOpen(nextOpen)
      }
    },
    [isControlled, onOpenChange],
  )

  const args = useMemo(() => {
    return {
      address: usdc.address,
      abi: erc20Abi_transfer,
      functionName: 'transfer' as const,
      args: [HYPERLIQUID_DEPOSIT_BRIDGE, _amount?.amount || 0n] as const,
      chainId: chainId,
    }
  }, [_amount])

  const { data: sim } = useSimulateContract({
    abi: args.abi,
    chainId: args.chainId,
    functionName: args.functionName,
    args: args.args,
    address: args.address,
    query: {
      enabled: Boolean(_amount?.amount),
    },
  })

  const transferUsdc = useCallback(async () => {
    if (!sim?.result) return
    try {
      const hash = await writeContractAsync(sim.request)
      const promise = client.waitForTransactionReceipt({
        hash,
      })
      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'send',
        chainId: chainId,
        txHash: hash,
        promise,
        summary: {
          pending: `Depositing ${_amount?.toSignificant(6)} ${usdc.symbol}`,
          completed: `Deposited ${_amount?.toSignificant(6)} ${usdc.symbol}`,
          failed: `Something went wrong depositing ${_amount?.toSignificant(6)} ${
            usdc.symbol
          }`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setAmount('')
      setOpen(false)
    }
  }, [sim, writeContractAsync, client, address, _amount])

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="sm" variant="perps-default" className="w-full">
            Deposit
          </Button>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Deposit</PerpsDialogTitle>
          <PerpsDialogDescription>
            Deposit USDC from Arbitrum
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-4">
            <InputWithKeyboard
              amount={amount}
              setAmount={setAmount}
              balance={balance}
              currency={usdc}
              error={undefined}
              isLoading={isBalanceLoading}
              address={address}
            />

            <PerpsChecker.Legal size="default" variant="perps-tertiary">
              <Checker.Connect
                size="default"
                variant="perps-tertiary"
                namespace="evm"
              >
                <Checker.Network
                  size="default"
                  chainId={chainId}
                  variant="perps-tertiary"
                >
                  <Checker.Amounts
                    size="default"
                    chainId={chainId}
                    amount={_amount}
                    variant="perps-tertiary"
                  >
                    <Button
                      variant="perps-tertiary"
                      size="default"
                      disabled={
                        Number(amount) < MIN_DEPOSIT_AMOUNT || !sim?.result
                      }
                      className="w-full"
                      onClick={transferUsdc}
                      loading={isPending}
                    >
                      {amount && Number(amount) < MIN_DEPOSIT_AMOUNT
                        ? `Minimum Deposit ${MIN_DEPOSIT_AMOUNT} USDC`
                        : !sim?.result
                          ? 'Simulation failed'
                          : 'Deposit'}
                    </Button>
                  </Checker.Amounts>
                </Checker.Network>
              </Checker.Connect>
            </PerpsChecker.Legal>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
