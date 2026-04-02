'use client'
import { createToast } from '@sushiswap/notifications'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { type EvmAddress, EvmChainId, USDC, erc20Abi_transfer } from 'sushi/evm'
import { usePublicClient, useSimulateContract, useWriteContract } from 'wagmi'
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
  const _amount = Amount.tryFromHuman(usdc, amount)
  const { mutateAsync: writeContractAsync, isPending } = useWriteContract()
  const client = usePublicClient()
  const address = useAccount('evm')

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
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="sm" variant="perps-default" className="w-full">
            Deposit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent variant="perps-default">
        <DialogHeader className="!text-left">
          <DialogTitle>Deposit</DialogTitle>
          <DialogDescription>Deposit USDC from Arbitrum</DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <Web3Input.Currency
              className="w-full border-2 rounded-lg border-[#7D95A9] px-4 py-2 bg-[#1B293EC7] text-[#78869B]"
              value={amount}
              onChange={(val) => setAmount(val)}
              currency={usdc}
              chainId={chainId}
              type="INPUT"
            />

            <PerpsChecker.Legal size="default" variant="perps-default">
              <Checker.Connect
                size="default"
                variant="perps-default"
                namespace="evm"
              >
                <Checker.Network
                  size="default"
                  chainId={chainId}
                  variant="perps-default"
                >
                  <Checker.Amounts
                    size="default"
                    chainId={chainId}
                    amount={_amount}
                    variant="perps-default"
                  >
                    <Button
                      variant="perps-default"
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
