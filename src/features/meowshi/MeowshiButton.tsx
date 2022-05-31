import { parseUnits } from '@ethersproject/units'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, SUSHI } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import { XSUSHI } from 'app/config/tokens'
import { tryParseAmount } from 'app/functions/parse'
import { ApprovalState } from 'app/hooks/useApproveCallback'
import useMeowshi from 'app/hooks/useMeowshi'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'app/modals/TransactionConfirmationModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalance } from 'app/state/wallet/hooks'
import React, { FC, useMemo, useState } from 'react'

import { Field, MeowshiState } from '../../pages/tools/meowshi'

interface MeowshiButtonProps {
  meowshiState: MeowshiState
}

// @ts-ignore TYPE NEEDS FIXING
const MeowshiButton: FC<MeowshiButtonProps> = ({ meowshiState }) => {
  const { currencies, meow: doMeow, fields } = meowshiState
  const { i18n } = useLingui()
  const [modalState, setModalState] = useState({
    attemptingTxn: false,
    txHash: '',
    open: false,
  })
  const { account, chainId } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  const sushiBalance = useTokenBalance(account, SUSHI[ChainId.ETHEREUM])
  // @ts-ignore TYPE NEEDS FIXING
  const xSushiBalance = useTokenBalance(account, XSUSHI)
  const { approvalState, approve, meow, unmeow, meowSushi, unmeowSushi } = useMeowshi(
    currencies[Field.INPUT] === SUSHI[ChainId.ETHEREUM]
  )
  // @ts-ignore TYPE NEEDS FIXING
  const balance = useTokenBalance(account, currencies[Field.INPUT])
  // @ts-ignore TYPE NEEDS FIXING
  const parsedInputAmount = tryParseAmount(fields[Field.INPUT], currencies[Field.INPUT])
  // @ts-ignore TYPE NEEDS FIXING
  const parsedOutputAmount = tryParseAmount(fields[Field.OUTPUT], currencies[Field.OUTPUT])

  const closeModal = () => {
    setModalState((prevState) => ({
      ...prevState,
      open: false,
    }))
  }

  const handleSubmit = async () => {
    setModalState({
      attemptingTxn: true,
      open: true,
      txHash: '',
    })

    // @ts-ignore TYPE NEEDS FIXING
    let tx
    if (doMeow) {
      if (currencies[Field.INPUT]?.symbol === 'SUSHI') {
        tx = await meowSushi({
          // @ts-ignore TYPE NEEDS FIXING
          value: parseUnits(fields[Field.INPUT], sushiBalance.currency.decimals),
          // @ts-ignore TYPE NEEDS FIXING
          decimals: sushiBalance.currency.decimals,
        })
      }
      if (currencies[Field.INPUT]?.symbol === 'xSUSHI') {
        tx = await meow({
          // @ts-ignore TYPE NEEDS FIXING
          value: parseUnits(fields[Field.INPUT], sushiBalance.currency.decimals),
          // @ts-ignore TYPE NEEDS FIXING
          decimals: xSushiBalance.currency.decimals,
        })
      }
    } else {
      if (currencies[Field.OUTPUT]?.symbol === 'SUSHI') {
        tx = await unmeowSushi({
          // @ts-ignore TYPE NEEDS FIXING
          value: parseUnits(fields[Field.INPUT], sushiBalance.currency.decimals),
          // @ts-ignore TYPE NEEDS FIXING
          decimals: xSushiBalance.currency.decimals,
        })
      }
      if (currencies[Field.OUTPUT]?.symbol === 'xSUSHI') {
        tx = await unmeow({
          // @ts-ignore TYPE NEEDS FIXING
          value: parseUnits(fields[Field.INPUT], sushiBalance.currency.decimals),
          // @ts-ignore TYPE NEEDS FIXING
          decimals: xSushiBalance.currency.decimals,
        })
      }
    }

    if (tx?.hash) {
      setModalState((prevState) => ({
        ...prevState,
        attemptingTxn: false,
        // @ts-ignore TYPE NEEDS FIXING
        txHash: tx.hash,
      }))
    } else {
      closeModal()
    }
  }

  const buttonDisabledText = useMemo(() => {
    if (!balance) return i18n._(t`Loading Balance`)
    if (parsedInputAmount?.greaterThan(balance)) return i18n._(t`Insufficient Balance`)
    if (!parsedInputAmount?.greaterThan(0)) return i18n._(t`Please enter an amount`)
    return null
  }, [balance, i18n, parsedInputAmount])

  if (!account)
    return (
      <Button onClick={approve} color="gradient" disabled={true}>
        {i18n._(t`Connect to wallet`)}
      </Button>
    )

  if (chainId !== ChainId.ETHEREUM)
    return (
      <Button onClick={approve} color="gradient" disabled={true}>
        {i18n._(t`Network not supported yet`)}
      </Button>
    )

  if (approvalState === ApprovalState.PENDING)
    return (
      <Button color="gradient" disabled={true}>
        <Dots>{i18n._(t`Approving`)}</Dots>
      </Button>
    )

  if (approvalState === ApprovalState.NOT_APPROVED)
    return (
      <Button onClick={approve} color="gradient" disabled={!!buttonDisabledText}>
        {buttonDisabledText || i18n._(t`Approve`)}
      </Button>
    )

  if (approvalState === ApprovalState.APPROVED)
    return (
      <>
        <TransactionConfirmationModal
          isOpen={modalState.open}
          onDismiss={closeModal}
          attemptingTxn={modalState.attemptingTxn}
          hash={modalState.txHash}
          content={
            <ConfirmationModalContent
              title={i18n._(t`Confirm convert`)}
              onDismiss={closeModal}
              topContent={<span />}
              bottomContent={<span />}
            />
          }
          pendingText={i18n._(
            t`Converting ${parsedInputAmount?.toSignificant(6, { groupSeparator: ',' })} ${
              meowshiState.currencies[Field.INPUT]?.symbol
            } for ${parsedOutputAmount?.toSignificant(6, { groupSeparator: ',' })} ${
              meowshiState.currencies[Field.OUTPUT]?.symbol
            }`
          )}
        />
        <Button onClick={handleSubmit} disabled={!!buttonDisabledText} color="gradient">
          {buttonDisabledText || i18n._(t`Convert`)}
        </Button>
      </>
    )
}

export default MeowshiButton
