import { InformationCircleIcon } from '@heroicons/react/24/solid'
import {
  Button,
  type ButtonProps,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { EvmChainId } from 'sushi/chain'
import { type Amount, LDO, type Token, type Type, USDT } from 'sushi/currency'
import type { Address } from 'sushi/types'
import { useAccount } from 'wagmi'
import { useTokenAllowance } from '../../hooks/approvals/hooks/useTokenAllowance'
import { useTokenRevokeApproval } from '../../hooks/approvals/hooks/useTokenRevokeApproval'

interface RevokeApproveERC20Props extends ButtonProps {
  id: string
  amount: Amount<Type> | undefined
  contract: Address | undefined
  enabled?: boolean
}

// Tokens that require resetting allowance to zero before setting a new amount
const RESET_APPROVAL_TOKENS = {
  [EvmChainId.ETHEREUM]: [USDT[EvmChainId.ETHEREUM], LDO[EvmChainId.ETHEREUM]],
}

const isResetApprovalToken = (token: Token) => {
  const tokensForChain =
    RESET_APPROVAL_TOKENS[token.chainId as keyof typeof RESET_APPROVAL_TOKENS]
  if (!tokensForChain) return false

  return tokensForChain.some((_token) => _token.equals(token))
}

const RevokeApproveERC20: FC<RevokeApproveERC20Props> = ({
  id,
  amount,
  contract,
  children,
  className,
  fullWidth = true,
  size = 'xl',
  enabled = true,
  ...props
}) => {
  const allowanceEnabled =
    enabled &&
    amount?.currency?.chainId &&
    isResetApprovalToken(amount.currency.wrapped)

  const { address } = useAccount()

  const { data: allowance, isLoading: isAllowanceLoading } = useTokenAllowance({
    token: amount?.currency?.wrapped,
    owner: address,
    spender: contract,
    chainId: amount?.currency.chainId,
    enabled: Boolean(amount?.currency?.isToken && allowanceEnabled),
  })

  const revokeEnabled =
    allowance &&
    amount &&
    allowance.quotient < amount.quotient &&
    allowance.quotient !== 0n

  const {
    write,
    isSuccess: isRevokeSuccess,
    isPending: isRevokePending,
  } = useTokenRevokeApproval({
    account: address,
    spender: contract,
    token: amount?.currency?.wrapped,
    enabled: revokeEnabled,
  })

  if (
    !allowanceEnabled ||
    (!isAllowanceLoading && !revokeEnabled) ||
    isRevokeSuccess
  )
    return <>{children}</>

  const loading = isAllowanceLoading || isRevokePending

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <Button
        disabled={!write}
        className={classNames(className, 'group relative')}
        loading={loading}
        onClick={() => write?.()}
        fullWidth={fullWidth}
        size={size}
        testId={id}
        {...props}
      >
        Revoke {amount?.currency.symbol} approval
        <HoverCardTrigger>
          <InformationCircleIcon width={16} height={16} />
        </HoverCardTrigger>
      </Button>
      <HoverCardContent className="!p-0 max-w-[320px]">
        <CardHeader>
          <CardTitle>Revoke ERC20 approval</CardTitle>
          <CardDescription>
            Revoke your allowance (set it to 0) before updating your approval
            limit—some tokens (like USDT) require this.
          </CardDescription>
        </CardHeader>
      </HoverCardContent>
    </HoverCard>
  )
}

export { RevokeApproveERC20 }
export type { RevokeApproveERC20Props }
