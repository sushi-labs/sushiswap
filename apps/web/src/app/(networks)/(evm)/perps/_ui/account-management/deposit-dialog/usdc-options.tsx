import { createToast } from '@sushiswap/notifications'
import { Button } from '@sushiswap/ui'
import { useCallback, useMemo, useState } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmChainId, USDC, erc20Abi_transfer } from 'sushi/evm'
import { parseAbi } from 'viem'
import { usePublicClient, useWriteContract } from 'wagmi'
import { useSimulateContract } from 'wagmi'
import { useBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { InputWithKeyboard } from '../../_common'
import { PerpsChecker } from '../../perps-checker'
import {
  HYPEREVM_USDC,
  USDC_ARB_DEPOSIT_BRIDGE,
  USDC_HYPEREVM_DEPOSIT_BRIDGE,
} from './deposit-dialog'

const hyperEvmDepositAbi = parseAbi([
  'function deposit(uint256 amount, uint32 destinationDex)',
])

export const getMinDepositAmount = (chainId: EvmChainId) => {
  switch (chainId) {
    case EvmChainId.ARBITRUM:
      return 5 //5.000000 usdc
    case EvmChainId.HYPEREVM:
      return 0
    default:
      throw new Error('Unsupported chainId')
  }
}

export const getUSDCArgs = ({
  chainId,
  amount,
}: { chainId: EvmChainId; amount: bigint }) => {
  switch (chainId) {
    case EvmChainId.HYPEREVM:
      return {
        address: USDC_HYPEREVM_DEPOSIT_BRIDGE,
        abi: hyperEvmDepositAbi,
        functionName: 'deposit' as const,
        args: [amount, 0] as const,
        chainId,
      }
    case EvmChainId.ARBITRUM:
      return {
        address: USDC[EvmChainId.ARBITRUM].address,
        abi: erc20Abi_transfer,
        functionName: 'transfer' as const,
        args: [USDC_ARB_DEPOSIT_BRIDGE, amount] as const,
        chainId,
      }
    default:
      return undefined
  }
}

const getAsset = (chainId: EvmChainId) => {
  switch (chainId) {
    case EvmChainId.ARBITRUM:
      return USDC[EvmChainId.ARBITRUM]
    case EvmChainId.HYPEREVM:
      return HYPEREVM_USDC
    default:
      throw new Error('Unsupported chainId')
  }
}
const getDepositBridge = (chainId: EvmChainId) => {
  switch (chainId) {
    case EvmChainId.ARBITRUM:
      return USDC_ARB_DEPOSIT_BRIDGE
    case EvmChainId.HYPEREVM:
      return USDC_HYPEREVM_DEPOSIT_BRIDGE
    default:
      throw new Error('Unsupported chainId')
  }
}

export const USDCOptions = ({
  depositChainId,
  setOpen,
}: {
  depositChainId: EvmChainId.ARBITRUM | EvmChainId.HYPEREVM
  setOpen: (open: boolean) => void
}) => {
  const usdc = useMemo(() => getAsset(depositChainId), [depositChainId])
  const [amount, setAmount] = useState<string>('')
  const { mutateAsync: writeContractAsync, isPending } = useWriteContract()
  const client = usePublicClient()
  const address = useAccount('evm')
  const { data: bigIntBalance, isLoading: isBalanceLoading } = useBalance(usdc)

  const balance = useMemo(
    () => (bigIntBalance ? new Amount(usdc, bigIntBalance) : undefined),
    [bigIntBalance, usdc],
  )
  const _amount = useMemo(
    () => Amount.tryFromHuman(usdc, amount),
    [amount, usdc],
  )
  const minDepositAmount = useMemo(
    () => getMinDepositAmount(usdc.chainId),
    [usdc.chainId],
  )

  const args = useMemo(() => {
    return getUSDCArgs({
      chainId: usdc.chainId,
      amount: _amount?.amount || 0n,
    })
  }, [_amount, usdc])

  const { data: sim } = useSimulateContract({
    abi: args?.abi,
    chainId: args?.chainId,
    functionName: args?.functionName,
    args: args?.args,
    address: args?.address,
    query: {
      enabled: Boolean(_amount?.amount),
    },
  })
  const transferUsdc = useCallback(async () => {
    if (!sim?.request) return
    try {
      const hash = await writeContractAsync(sim.request)
      const promise = client.waitForTransactionReceipt({
        hash,
      })
      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'send',
        chainId: usdc.chainId,
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
        variant: 'perps',
      })
    } catch (error) {
      console.log(error)
    } finally {
      setAmount('')
      setOpen(false)
    }
  }, [sim, writeContractAsync, client, address, _amount, setOpen, usdc])

  return (
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
            chainId={usdc.chainId}
            variant="perps-tertiary"
          >
            <Checker.Amounts
              size="default"
              chainId={usdc.chainId}
              amount={_amount}
              variant="perps-tertiary"
            >
              <Checker.ApproveERC20
                size="default"
                amount={_amount}
                variant="perps-tertiary"
                contract={getDepositBridge(depositChainId)}
                id={`${usdc.chainId}-approve-deposit-${usdc.address}`}
                enabled={usdc.chainId === EvmChainId.HYPEREVM}
              >
                <Checker.Success
                  tag={`${usdc.chainId}-approve-deposit-${usdc.address}`}
                >
                  <Button
                    variant="perps-tertiary"
                    size="default"
                    disabled={
                      Number(amount) < minDepositAmount || !sim?.request
                    }
                    className="w-full"
                    onClick={transferUsdc}
                    loading={isPending}
                  >
                    {amount && Number(amount) < minDepositAmount
                      ? `Minimum Deposit ${minDepositAmount} USDC`
                      : !sim?.request
                        ? 'Simulation failed'
                        : 'Deposit'}
                  </Button>
                </Checker.Success>
              </Checker.ApproveERC20>
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connect>
      </PerpsChecker.Legal>
    </div>
  )
}
