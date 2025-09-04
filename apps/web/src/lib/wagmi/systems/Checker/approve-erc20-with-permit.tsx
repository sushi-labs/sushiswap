'use client'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import type { TTLStorageKey } from '@sushiswap/hooks'
import {
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkExternal,
  classNames,
} from '@sushiswap/ui'
import { Button, type ButtonProps } from '@sushiswap/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPrimitive,
} from '@sushiswap/ui'
import { type FC, useEffect, useState } from 'react'
import type { Amount } from 'sushi'
import { EvmChainId, type EvmCurrency } from 'sushi/evm'
import type { Address } from 'viem'
import { useAccount, useBytecode } from 'wagmi'
import {
  ApprovalState,
  useTokenApproval,
} from '../../hooks/approvals/hooks/useTokenApproval'
import {
  type PermitInfo,
  useTokenPermit,
} from '../../hooks/approvals/hooks/useTokenPermit'
import { ApproveERC20 } from './approve-erc20'
import { useApprovedActions } from './provider'
import { RevokeApproveERC20 } from './revoke-approve-erc20'

enum ApprovalType {
  Approve = 'approve',
  ApproveMax = 'approve-max',
  Permit = 'permit',
}

interface ApproveERC20WithPermitProps extends ButtonProps {
  id: string
  chainId: EvmChainId
  amount: Amount<EvmCurrency> | undefined
  contract: Address | undefined
  enabled?: boolean
  permitInfo: PermitInfo
  ttlStorageKey: TTLStorageKey
  tag: string
}

const PERMIT_DISABLED_CHAIN_IDS = [EvmChainId.HARMONY]

const isPermitSupportedChainId = (chainId: number) =>
  !PERMIT_DISABLED_CHAIN_IDS.includes(
    chainId as (typeof PERMIT_DISABLED_CHAIN_IDS)[number],
  )

const ApproveERC20WithPermit: FC<ApproveERC20WithPermitProps> = (props) => {
  return isPermitSupportedChainId(props.chainId) ? (
    <RevokeApproveERC20 {...props} id={`revoke-${props.id}`}>
      <_ApproveERC20WithPermit {...props} />
    </RevokeApproveERC20>
  ) : (
    <ApproveERC20 {...props} />
  )
}

const _ApproveERC20WithPermit: FC<ApproveERC20WithPermitProps> = ({
  id,
  amount,
  contract,
  children,
  className,
  fullWidth = true,
  size = 'xl',
  enabled = true,
  permitInfo,
  ttlStorageKey,
  tag,
  ...props
}) => {
  const [approvalType, setApprovalType] = useState(ApprovalType.Permit)

  const { address } = useAccount()

  const { data: bytecode } = useBytecode({
    address,
    query: {
      refetchInterval: Number.POSITIVE_INFINITY,
    },
  })

  useEffect(() => {
    if (bytecode) setApprovalType(ApprovalType.Approve)
  }, [bytecode])

  const { setSignature } = useApprovedActions(tag)

  const [approvalState, { write: onApprove }] = useTokenApproval({
    amount,
    spender: contract,
    enabled: enabled && approvalType === ApprovalType.Approve,
    approveMax: approvalType === ApprovalType.ApproveMax,
  })

  useEffect(() => {
    // reset signature when approved via tx
    if (approvalState === ApprovalState.APPROVED) setSignature(undefined)
  }, [approvalState, setSignature])

  const [permitState, { write: onPermit }] = useTokenPermit({
    amount,
    spender: contract,
    enabled: enabled && approvalType === ApprovalType.Permit,
    permitInfo,
    ttlStorageKey,
    tag,
  })

  const state =
    approvalType === ApprovalType.Permit ? permitState : approvalState

  if (state === ApprovalState.APPROVED || !enabled) {
    return <>{children}</>
  }

  const loading = [
    ApprovalState.UNKNOWN,
    ApprovalState.LOADING,
    ApprovalState.PENDING,
  ].includes(state)

  const disabled =
    state !== ApprovalState.NOT_APPROVED || (!onPermit && !onApprove)

  return (
    <Select
      value={approvalType}
      onValueChange={(value: ApprovalType) => setApprovalType(value)}
    >
      <HoverCard openDelay={0} closeDelay={0}>
        <Button
          disabled={disabled}
          className={classNames(className, 'group relative')}
          loading={loading}
          onClick={() =>
            approvalType === ApprovalType.Permit ? onPermit?.() : onApprove?.()
          }
          fullWidth={fullWidth}
          size={size}
          testId={id}
          {...props}
        >
          {approvalType === ApprovalType.Permit ? 'Permit' : 'Approve'}{' '}
          {amount?.currency.symbol}{' '}
          {approvalType === ApprovalType.ApproveMax ? 'Permanently' : ''}
          <HoverCardTrigger>
            <InformationCircleIcon width={16} height={16} />
          </HoverCardTrigger>
          <div
            className={classNames(
              fullWidth ? 'absolute' : '',
              'right-1 top-1 bottom-1',
            )}
          >
            <SelectPrimitive.Trigger asChild>
              <Button
                asChild
                size="xs"
                variant="ghost"
                name="Select"
                className="!h-full !w-full"
                id={'select-approval-type'}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </SelectPrimitive.Trigger>
          </div>
        </Button>
        <HoverCardContent className="!p-0 max-w-[320px]">
          <CardHeader>
            <CardTitle>Approve ERC20</CardTitle>
            <CardDescription>
              We need your approval to execute this transaction on your behalf.{' '}
              <LinkExternal
                target="_blank"
                className="text-blue hover:underline"
                href="https://www.sushi.com/academy/articles/what-is-token-approval"
                rel="noreferrer"
              >
                Learn more
              </LinkExternal>
            </CardDescription>
          </CardHeader>
        </HoverCardContent>
      </HoverCard>
      <SelectContent className="w-80">
        <SelectItem
          value={ApprovalType.Permit}
          testdata-id={'approval-type-permit-button'}
        >
          <div className="flex flex-col">
            <span className="font-semibold">
              Permit approval with signature
            </span>
            <span className="text-sm">
              Grant approval of {amount?.toSignificant(6)}{' '}
              {amount?.currency?.symbol} by signing a message
            </span>
          </div>
        </SelectItem>

        <SelectItem
          value={ApprovalType.Approve}
          testdata-id={'approval-type-approve-button'}
        >
          <div className="flex flex-col">
            <span className="font-semibold">Approve one-time only</span>
            <span className="text-sm">
              {`You'll give your approval to spend `}
              {amount?.toSignificant(6)} {amount?.currency?.symbol} on your
              behalf
            </span>
          </div>
        </SelectItem>
        <SelectItem
          value={ApprovalType.ApproveMax}
          testdata-id={'approval-type-approve-max-button'}
        >
          <div className="flex flex-col">
            <span className="font-semibold">Approve unlimited amount</span>
            <span className="text-sm">
              {`You won't need to approve again next time you want to spend`}{' '}
              {amount?.currency?.symbol}.
            </span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

export { ApproveERC20WithPermit, type ApproveERC20WithPermitProps }
