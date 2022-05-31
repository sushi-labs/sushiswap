import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import LoadingCircle from 'app/animation/loading-circle.json'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import useAuctionToken from 'app/features/miso/context/hooks/useAuctionToken'
import useTokenTemplateMap from 'app/features/miso/context/hooks/useTokenTemplateMap'
import { TokenCreationFormInput } from 'app/features/miso/TokenCreationForm/index'
import TokenCreationSubmittedModalContent from 'app/features/miso/TokenCreationForm/TokenCreationSubmittedModalContent'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useEffect, useState } from 'react'

interface TokenCreationModalProps {
  open: boolean
  onDismiss(): void
  data: TokenCreationFormInput
}

const TokenCreationModal: FC<TokenCreationModalProps> = ({ open, onDismiss: _onDismiss, data }) => {
  const { i18n } = useLingui()
  const [txHash, setTxHash] = useState<string>()
  const [pending, setPending] = useState<boolean>(false)
  const { init, subscribe, unsubscribe } = useAuctionToken()
  const [tokenAddress, setTokenAddress] = useState<string>()
  const [error, setError] = useState<string>()

  const { map: tokenTemplateMap, templateIdToLabel } = useTokenTemplateMap()

  const reset = useCallback(() => {
    if (!pending) {
      setTokenAddress(undefined)
      setTxHash(undefined)
      setError(undefined)
    }
  }, [pending])

  const onDismiss = useCallback(() => {
    reset()
    _onDismiss()
  }, [_onDismiss, reset])

  const execute = useCallback(
    async (data: TokenCreationFormInput) => {
      setPending(true)

      try {
        const tx = await init(data.tokenName, data.tokenSymbol, data.tokenSupply, data.tokenTypeAddress)

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
    [init]
  )

  // Subscribe to creation event to get created token ID
  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    subscribe('TokenCreated', (owner, tokenAddress, tokenTemplate, { transactionHash }) => {
      if (transactionHash?.toLowerCase() === txHash?.toLowerCase()) {
        setTokenAddress(tokenAddress)
      }
    })

    return () => {
      unsubscribe('TokenCreated', () => console.log('unsubscribed'))
    }
  }, [subscribe, txHash, unsubscribe])

  return (
    <HeadlessUIModal.Controlled isOpen={open} onDismiss={onDismiss} afterLeave={() => setTxHash(undefined)}>
      {!txHash ? (
        <HeadlessUIModal.Body>
          <HeadlessUIModal.Header
            header={i18n._(t`Create Token`)}
            subheader={i18n._(t`Please review your entered details thoroughly.`)}
          />
          <HeadlessUIModal.Content>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col divide-y divide-dark-700">
                <div className="flex justify-between gap-2 py-3">
                  <Typography variant="sm" className="text-secondary">
                    {i18n._(t`Type`)}
                  </Typography>
                  <Typography weight={700} variant="sm" className="text-high-emphesis">
                    {/*@ts-ignore TYPE NEEDS FIXING*/}
                    {templateIdToLabel(tokenTemplateMap?.[data.tokenTypeAddress])}
                  </Typography>
                </div>
                <div className="flex justify-between gap-2 py-3">
                  <Typography variant="sm" className="text-secondary">
                    {i18n._(t`Name`)}
                  </Typography>
                  <Typography weight={700} variant="sm" className="text-high-emphesis">
                    {data.tokenName}
                  </Typography>
                </div>
                <div className="flex justify-between gap-2 py-3">
                  <Typography variant="sm" className="text-secondary">
                    {i18n._(t`Symbol`)}
                  </Typography>
                  <Typography weight={700} variant="sm" className="text-high-emphesis">
                    {data.tokenSymbol}
                  </Typography>
                </div>
                <div className="flex justify-between gap-2 py-3">
                  <Typography variant="sm" className="text-secondary">
                    {i18n._(t`Total Supply`)}
                  </Typography>
                  <Typography weight={700} variant="sm" className="text-high-emphesis">
                    {data.tokenSupply}
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
              {i18n._(t`Create Token`)}
            </HeadlessUIModal.Action>
          </HeadlessUIModal.Actions>
          <HeadlessUIModal.Error>{error}</HeadlessUIModal.Error>
        </HeadlessUIModal.Body>
      ) : (
        <TokenCreationSubmittedModalContent txHash={txHash} tokenAddress={tokenAddress} onDismiss={onDismiss} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default TokenCreationModal
