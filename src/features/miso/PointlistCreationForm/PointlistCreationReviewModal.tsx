import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Fraction, JSBI, NATIVE } from '@sushiswap/core-sdk'
import LoadingCircle from 'app/animation/loading-circle.json'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { useAuctionPointListFunctions } from 'app/features/miso/context/hooks/useAuctionPointList'
import { PointListFormInputs } from 'app/features/miso/PointlistCreationForm/index'
import { shortenString } from 'app/functions'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { toWei } from 'web3-utils'

import PointlistCreationSubmittedModalContent from './PointlistCreationSubmittedModalContent'

interface PointlistCreationModalProps {
  open: boolean
  onDismiss(): void
  data: PointListFormInputs
}

const PointlistCreationModal: FC<PointlistCreationModalProps> = ({ open, onDismiss: _onDismiss, data }) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { init, unsubscribe, subscribe } = useAuctionPointListFunctions()

  const [listAddress, setListAddress] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [pending, setPending] = useState(false)
  // @ts-ignore TYPE NEEDS FIXING
  const token = useToken(data.paymentTokenAddress) ?? NATIVE[chainId || 1]
  const [error, setError] = useState<string>()

  const reset = useCallback(() => {
    if (!pending) {
      setListAddress(undefined)
      setTxHash(undefined)
      setError(undefined)
    }
  }, [pending])

  const onDismiss = useCallback(() => {
    reset()
    _onDismiss()
  }, [_onDismiss, reset])

  const execute = useCallback(
    async (data: PointListFormInputs) => {
      if (!token) return

      setPending(true)

      const [accounts, amounts] = data.wlAddresses.reduce<[string[], string[]]>(
        (acc, cur) => {
          acc[0].push(cur.account)
          acc[1].push(
            new Fraction(
              toWei(cur.amount),
              JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18 - token.decimals))
            ).quotient.toString()
          )
          return acc
        },
        [[], []]
      )

      try {
        const tx = await init(accounts, amounts)

        if (tx?.hash) {
          setTxHash(tx.hash)
          await tx.wait()
        }
      } catch (e) {
        // @ts-ignore TYPE NEEDS FIXING
        setError(e.error?.message)
      } finally {
        setPending(false)
      }
    },
    [init, token]
  )

  // Subscribe to creation event to get created pointlist ID
  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    subscribe('PointListDeployed', (operator, address, pointList, owner, { transactionHash }) => {
      if (transactionHash?.toLowerCase() === txHash?.toLowerCase()) {
        setListAddress(address)
      }
    })

    return () => {
      unsubscribe('PointListDeployed', () => console.log('unsubscribed'))
    }
  }, [subscribe, txHash, unsubscribe])

  return (
    <HeadlessUIModal.Controlled isOpen={open} onDismiss={onDismiss} afterLeave={() => setTxHash(undefined)}>
      {!txHash ? (
        <HeadlessUIModal.Body>
          <HeadlessUIModal.Header
            onClose={onDismiss}
            header={i18n._(t`Create Permission List`)}
            subheader={i18n._(t`Please review your entered details thoroughly.`)}
          />
          <HeadlessUIModal.Content>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col divide-y divide-dark-700">
                <div className="flex justify-between gap-2 py-3">
                  <Typography variant="sm" className="text-secondary">
                    {i18n._(t`Auction Payment Token`)}
                  </Typography>
                  <Typography weight={700} variant="sm" className="text-high-emphesis">
                    {shortenString(data.paymentTokenAddress, 12)}
                  </Typography>
                </div>
                <div className="flex justify-between gap-2 py-3">
                  <Typography variant="sm" className="text-secondary">
                    {i18n._(t`Point List`)}
                  </Typography>
                  <Typography weight={700} variant="sm" className="text-high-emphesis">
                    {i18n._(t`${data.wlAddresses.length} Addresses`)}
                  </Typography>
                </div>
              </div>
            </div>
          </HeadlessUIModal.Content>
          <HeadlessUIModal.Actions>
            <HeadlessUIModal.Action onClick={onDismiss}>{i18n._(t`Cancel`)}</HeadlessUIModal.Action>
            <HeadlessUIModal.Action
              main={true}
              {...(pending && {
                startIcon: (
                  <div className="w-4 h-4 mr-1">
                    <Lottie animationData={LoadingCircle} autoplay loop />
                  </div>
                ),
              })}
              disabled={pending}
              onClick={() => execute(data)}
            >
              {i18n._(t`Create Permission List`)}
            </HeadlessUIModal.Action>
          </HeadlessUIModal.Actions>
          <HeadlessUIModal.Error>{error}</HeadlessUIModal.Error>
        </HeadlessUIModal.Body>
      ) : (
        <PointlistCreationSubmittedModalContent txHash={txHash} listAddress={listAddress} onDismiss={onDismiss} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default PointlistCreationModal
