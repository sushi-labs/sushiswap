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
import { useCallback, useMemo, useState } from 'react'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Amount } from 'sushi'
import { type EvmAddress, EvmChainId, USDC, erc20Abi_transfer } from 'sushi/evm'
import {
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'

const usdc = USDC[EvmChainId.ARBITRUM]
const chainId = EvmChainId.ARBITRUM
const HYPERLIQUID_DEPOSIT_BRIDGE =
  '0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7' as EvmAddress
const MIN_DEPOSIT_AMOUNT = 5 //5.000000 usdc

//@dev simple deposit via transfer for the time being
export const Deposit = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')
  const _amount = Amount.tryFromHuman(usdc, amount)
  const { writeContractAsync, isPending } = useWriteContract()
  const client = usePublicClient()
  const { address } = useAccount()

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Deposit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="!text-left">
          <DialogTitle>Deposit</DialogTitle>
          <DialogDescription>Deposit USDC from Arbitrum</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Web3Input.Currency
            className="w-full border rounded-lg border-accent px-4 py-2 bg-slate-700"
            value={amount}
            onChange={(val) => setAmount(val)}
            currency={usdc}
            chainId={chainId}
            type="INPUT"
          />

          <Checker.Connect>
            <Checker.Network chainId={chainId}>
              <Checker.Amounts chainId={chainId} amount={_amount}>
                <Button
                  size="xl"
                  disabled={Number(amount) < MIN_DEPOSIT_AMOUNT || !sim?.result}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
