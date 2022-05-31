import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import useBentoMasterApproveCallback, { BentoApprovalState, BentoPermit } from 'app/hooks/useBentoMasterApproveCallback'
import { StandardSignatureData, useTridentLiquidityTokenPermit } from 'app/hooks/useERC20Permit'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import React, { FC, memo, ReactNode, useCallback, useEffect, useState } from 'react'

interface TokenApproveButtonProps {
  id: string
  inputAmount?: CurrencyAmount<Currency>
  onStateChange: React.Dispatch<React.SetStateAction<any>>
  tokenApproveOn?: string
  onSLPPermit?(x: StandardSignatureData): void
}

const TokenApproveButton: FC<TokenApproveButtonProps> = memo(
  ({ inputAmount, onStateChange, tokenApproveOn, id, onSLPPermit }) => {
    const { i18n } = useLingui()
    const [approveState, approveCallback] = useApproveCallback(inputAmount?.wrapped, tokenApproveOn)
    const { gatherPermitSignature, signatureData } = useTridentLiquidityTokenPermit(
      ['Uniswap V2', 'Sushi LP Token'].includes(inputAmount?.currency.name ?? '') ? inputAmount?.wrapped : undefined,
      tokenApproveOn
    )

    // Try to approve using permit, use normal approve otherwise
    const handleApprove = useCallback(async () => {
      if (gatherPermitSignature) {
        try {
          await gatherPermitSignature()
        } catch (e) {
          await approveCallback()
        }
      } else {
        await approveCallback()
      }
    }, [approveCallback, gatherPermitSignature])

    useEffect(() => {
      if (signatureData && inputAmount && approveState === ApprovalState.NOT_APPROVED) {
        // Can safely cast because signatureData is always StandardSignatureData if PermitType === PermitType.amount
        if (onSLPPermit) {
          onSLPPermit(signatureData as StandardSignatureData)
        } else {
          throw new Error('onSLPPermit callback not defined')
        }
      }
    }, [approveState, inputAmount, onSLPPermit, onStateChange, signatureData])

    useEffect(() => {
      if (!inputAmount?.currency.wrapped.address) return

      // @ts-ignore TYPE NEEDS FIXING
      onStateChange((prevState) => ({
        ...prevState,
        [inputAmount.currency.wrapped.address]: signatureData ? ApprovalState.APPROVED : approveState,
      }))

      return () =>
        // @ts-ignore TYPE NEEDS FIXING
        onStateChange((prevState) => {
          const state = { ...prevState }
          if (state[inputAmount!!.currency.wrapped.address]) {
            delete state[inputAmount!!.currency.wrapped.address]
          }

          return state
        })
    }, [approveState, inputAmount, inputAmount?.currency.wrapped.address, onStateChange, signatureData])

    if (!signatureData && [ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approveState)) {
      return (
        <Button fullWidth id={id} loading={approveState === ApprovalState.PENDING} color="blue" onClick={handleApprove}>
          {i18n._(t`Approve ${inputAmount?.currency.symbol}`)}
        </Button>
      )
    }

    return <></>
  }
)

interface TridentApproveGateCommonProps {
  spendFromWallet?: boolean
  inputAmounts: (CurrencyAmount<Currency> | undefined)[]
  children: ({ approved, loading }: { approved: boolean; loading: boolean; permit?: BentoPermit }) => ReactNode
  tokenApproveOn?: string
  masterContractAddress?: string
  onSLPPermit?(x: StandardSignatureData): void
}

type TridentApproveGatePropsNoPermit = TridentApproveGateCommonProps & {
  withPermit?: false
  permit?: never
  onPermit?: never
  onPermitError?: never
  fallback?: never
}

type TridentApproveGatePropsWithPermit = TridentApproveGateCommonProps & {
  withPermit: true
  permit: Signature | undefined
  onPermit(x?: Signature): void
  onPermitError?(): void
}

type TridentApproveGateType = TridentApproveGatePropsNoPermit | TridentApproveGatePropsWithPermit

const TridentApproveGate = ({
  spendFromWallet = true,
  inputAmounts,
  tokenApproveOn,
  children,
  withPermit = false,
  masterContractAddress,
  permit: permitProp,
  onPermit,
  onSLPPermit,
  onPermitError,
}: TridentApproveGateType) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const toggleWalletModal = useWalletModalToggle()
  const [status, setStatus] = useState<Record<string, ApprovalState>>({})
  const [permitError, setPermitError] = useState(false)

  const { approve, approvalState, getPermit, permit } = useBentoMasterApproveCallback(
    withPermit ? masterContractAddress : undefined,
    {}
  )

  const loading =
    Object.values(status).some((el) => el === ApprovalState.UNKNOWN) ||
    (withPermit ? approvalState === BentoApprovalState.UNKNOWN : false)

  const approved =
    (Object.values(status).every((el) => el === ApprovalState.APPROVED) || !spendFromWallet) &&
    (withPermit ? approvalState === BentoApprovalState.APPROVED : true)

  // If we have a permitError, use the approveCallback as a fallback
  const onClick = useCallback(async () => {
    if (withPermit && !permitError) {
      const permit = await getPermit()

      if (permit?.signature && onPermit) {
        onPermit(permit.signature)
      } else if (onPermitError) {
        setPermitError(true)
        onPermitError()
      }
    } else {
      await approve()
    }
  }, [approve, getPermit, onPermit, onPermitError, permitError, withPermit])

  return (
    <div className="flex flex-col gap-3">
      {/*hide bentobox approval if not every inputAmount is greater than than zero*/}
      {inputAmounts.every((el) => el?.greaterThan(ZERO)) &&
        [BentoApprovalState.NOT_APPROVED, BentoApprovalState.PENDING].includes(approvalState) && (
          <Button id="btn-approve" loading={approvalState === BentoApprovalState.PENDING} onClick={onClick}>
            {i18n._(t`Approve BentoBox`)}
          </Button>
        )}

      {tokenApproveOn &&
        inputAmounts.reduce<ReactNode[]>((acc, amount, index) => {
          if (!amount?.currency.isNative && amount?.greaterThan(ZERO)) {
            acc.push(
              <TokenApproveButton
                id={`btn-approve`}
                inputAmount={amount}
                key={index}
                onStateChange={setStatus}
                tokenApproveOn={tokenApproveOn}
                onSLPPermit={onSLPPermit}
              />
            )
          }
          return acc
        }, [])}

      {!account ? (
        <Button color="gradient" onClick={toggleWalletModal}>
          {i18n._(t`Connect Wallet`)}
        </Button>
      ) : (
        children({ approved: approved || !!permitProp, loading, permit })
      )}
    </div>
  )
}

export default TridentApproveGate
