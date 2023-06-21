import React, { FC } from 'react'
import { Button, ButtonProps } from '@sushiswap/ui/future/components/button'
import { ApprovalState } from '../../../hooks'
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import { ApproveBentoboxController } from '../../components'
import { Address } from 'wagmi'
import { Signature } from '@ethersproject/bytes'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import dynamic from 'next/dynamic'
import {Explainer} from "@sushiswap/ui/future/components/explainer";

export interface ApproveBentoboxProps extends ButtonProps {
  chainId: BentoBoxV1ChainId
  contract: Address
  enabled?: boolean
  onSignature?: (data: Signature) => void
}

export const Component: FC<ApproveBentoboxProps> = ({
  chainId,
  contract,
  children,
  enabled = true,
                                                      fullWidth = true,
                                                      size = 'xl',
  onSignature,
    ...props
}) => {
  return (
    <ApproveBentoboxController contract={contract} chainId={chainId} enabled={enabled} onSignature={onSignature}>
      {({ approvalState, onApprove, signature }) => {
        if (approvalState === ApprovalState.APPROVED || (approvalState === ApprovalState.PENDING && signature)) {
          return <>{children}</>
        }

        return (
          <Button
            loading={approvalState === ApprovalState.LOADING || (approvalState === ApprovalState.PENDING && !signature)}
            onClick={onApprove}
            fullWidth={fullWidth}
            size={size}
            {...props}
          >
            Approve Bentobox
            <Explainer>
              <div className="flex flex-col gap-3">
                <span className="text-gray-500 dark:text-slate-400">BentoBox Approval</span>
                We need your approval first to access your wallet using BentoBox; you will only have to approve this
                master contract once.
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
      }}
    </ApproveBentoboxController>
  )
}

export const ApproveBentobox = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
