import type { ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Amount } from 'sushi'
import { type EvmChainId, EvmToken } from 'sushi/evm'
import { KvmChainId } from 'sushi/kvm'
import type { Address } from 'viem'
import { useKinesisWrappedToken } from '~kadena/_common/lib/hooks/kinesis-swap/use-kinesis-wrapped-token'
import type { KinesisToken } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'

interface ApproveProps extends ButtonProps {
  amount: Amount<KinesisToken> | undefined
  contract: Address | undefined
  enabled?: boolean
}

export const Approve: FC<ApproveProps> = (props) => {
  if (props.amount?.currency.chainId === KvmChainId.KADENA) {
    return <>{props.children}</>
  }
  return (
    <_ApproveERC20
      fullWidth
      size="xl"
      id="kinesis-swap-approve"
      amount={props.amount}
      contract={props.contract}
      enabled={props.enabled}
    >
      {props.children}
    </_ApproveERC20>
  )
}

const _ApproveERC20: FC<ApproveProps> = (props) => {
  const { data: wrappedToken, isLoading } = useKinesisWrappedToken({
    token: props.amount?.currency as EvmToken | undefined,
    enabled: Boolean(props.amount),
  })

  const tokenAmount = useMemo(() => {
    if (wrappedToken && props.amount) {
      return new Amount(
        new EvmToken({
          chainId: props.amount.currency.chainId as EvmChainId,
          address: wrappedToken as `0x${string}`,
          decimals: props.amount.currency.decimals,
          symbol: props.amount.currency.symbol,
          name: props.amount.currency.name,
        }),
        props.amount.amount,
      )
    }
  }, [wrappedToken, props.amount])

  return (
    <Checker.Network
      fullWidth
      size="xl"
      chainId={props?.amount?.currency?.chainId as EvmChainId | undefined}
    >
      <Checker.ApproveERC20
        fullWidth
        size="xl"
        id="kinesis-swap-approve"
        amount={tokenAmount}
        contract={props.amount?.currency.address as `0x${string}` | undefined}
        enabled={Boolean(
          props.enabled && !isLoading && wrappedToken && tokenAmount,
        )}
      >
        {props.children}
      </Checker.ApproveERC20>
    </Checker.Network>
  )
}
