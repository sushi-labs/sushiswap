import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Button, ButtonProps } from '@sushiswap/ui/components/button'
import { Explainer } from '@sushiswap/ui/components/explainer'
import React, { FC } from 'react'
import { Address } from 'wagmi'

import { ApprovalState, useBentoboxApproval } from '../../hooks'

interface ApproveBentoboxProps extends ButtonProps {
  chainId: BentoBoxV1ChainId
  id: string
  masterContract: Address
  enabled?: boolean
  tag: string
}

const ApproveBentobox: FC<ApproveBentoboxProps> = ({
  id,
  chainId,
  masterContract,
  children,
  enabled = true,
  fullWidth = true,
  tag,
  size = 'xl',
  ...props
}) => {
  const [state, execute] = useBentoboxApproval({ enabled, chainId, masterContract, tag })

  if (state === ApprovalState.APPROVED || !enabled) {
    return <>{children}</>
  }

  return (
    <Button
      loading={state === ApprovalState.LOADING || state === ApprovalState.PENDING || !execute}
      onClick={() => execute?.()}
      fullWidth={fullWidth}
      size={size}
      testId={id}
      {...props}
    >
      Approve Bentobox
      <Explainer>
        <div className="flex flex-col gap-3">
          <span className="text-gray-500 dark:text-slate-400">BentoBox Approval</span>
          We need your approval first to access your wallet using BentoBox; you will only have to approve this master
          contract once.
          <a
            target="_blank"
            className="flex items-center gap-1 text-blue dark:text-blue dark:font-semibold hover:text-blue-700"
            href="https://www.sushi.com/academy/articles/what-is-bentobox"
            rel="noreferrer"
          >
            Learn more <ChevronRightIcon width={12} height={12} />
          </a>
        </div>
      </Explainer>
    </Button>
  )
}

export { ApproveBentobox, type ApproveBentoboxProps }
