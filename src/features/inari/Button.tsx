import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from '@sushiswap/core-sdk'
import Button, { ButtonProps } from 'app/components/Button'
import Dots from 'app/components/Dots'
import ProgressSteps from 'app/components/ProgressSteps'
import { ApprovalState } from 'app/hooks/useApproveCallback'
import { BentoApprovalState } from 'app/hooks/useBentoMasterApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
import { useDerivedInariState, useSelectedInariStrategy } from 'app/state/inari/hooks'
import React, { FC, useCallback, useState } from 'react'

interface InariButtonProps extends ButtonProps {}

const InariButton: FC<InariButtonProps> = ({ children, ...rest }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { inputValue } = useDerivedInariState()
  const { balances, execute, bentoApproveCallback, approveCallback } = useSelectedInariStrategy()
  const [pending, setPending] = useState(false)

  const onExecute = useCallback(async () => {
    setPending(true)
    const tx = await execute(inputValue)
    setPending(false)
    await tx?.wait()
  }, [execute, inputValue])

  // Get permit to send with execute
  const handleGetPermit = useCallback(async () => {
    // @ts-ignore TYPE NEEDS FIXING
    await bentoApproveCallback.getPermit()
  }, [bentoApproveCallback])

  // Add token approve to approve flow
  // Note that this is not required when unstaking from BentoBox strategies, hence approveCallback can be null
  const steps = []
  if (approveCallback) steps.push(approveCallback[0] === ApprovalState.APPROVED)
  if (bentoApproveCallback) steps.push(bentoApproveCallback.approvalState === BentoApprovalState.APPROVED)

  const approveFlow = (
    <div className="flex flex-col">
      <ProgressSteps steps={steps} />
    </div>
  )

  if (!account)
    return (
      <Button {...rest} disabled>
        {i18n._(t`Connect Wallet`)}
      </Button>
    )

  if (!inputValue || inputValue.equalTo(ZERO))
    return (
      <Button {...rest} disabled>
        {i18n._(t`Enter an amount`)}
      </Button>
    )

  if (inputValue && balances && balances.inputTokenBalance && balances.inputTokenBalance.lessThan(inputValue))
    return (
      <Button {...rest} disabled>
        {i18n._(t`Insufficient Balance`)}
      </Button>
    )

  if (approveCallback && approveCallback[0] === ApprovalState.PENDING)
    return (
      <>
        <Button {...rest} disabled>
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          <Dots>{i18n._(t`Approving Inari to spend ${approveCallback[2].currency.symbol}`)}</Dots>
        </Button>
        {approveFlow}
      </>
    )

  if (approveCallback && approveCallback[0] === ApprovalState.NOT_APPROVED)
    return (
      <>
        <Button {...rest} color="pink" onClick={approveCallback[1]}>
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          {i18n._(t`Approve Inari to spend ${approveCallback[2].currency.symbol}`)}
        </Button>
        {approveFlow}
      </>
    )

  if (bentoApproveCallback && bentoApproveCallback.approvalState === BentoApprovalState.PENDING)
    return (
      <>
        <Button {...rest} disabled>
          <Dots>{i18n._(t`Approving Inari Master Contract`)}</Dots>
        </Button>
        {approveFlow}
      </>
    )

  if (bentoApproveCallback && bentoApproveCallback.approvalState === BentoApprovalState.NOT_APPROVED)
    return (
      <>
        <Button {...rest} color="pink" onClick={handleGetPermit}>
          {i18n._(t`Approve Inari Master Contract`)}
        </Button>
        {approveFlow}
      </>
    )

  return (
    <Button {...rest} disabled={pending} color={pending ? 'gray' : 'gradient'} onClick={onExecute}>
      {children}
    </Button>
  )
}

export default InariButton
