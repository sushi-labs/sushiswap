import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from '@sushiswap/core-sdk'
import LoadingCircle from 'app/animation/loading-circle.json'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import useAuction from 'app/features/miso/context/hooks/useAuction'
import { useAuctionLiquidityLauncher } from 'app/features/miso/context/hooks/useAuctionLiquidityLauncher'
import { LiquidityLauncherFormInputFormatted } from 'app/features/miso/LiquidityLauncherCreationForm/index'
import { getExplorerLink, shortenString } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useEffect, useState } from 'react'

import LiquidityLauncherCreationSubmittedModalContent from './LiquidityLauncherCreationSubmittedModalContent'

interface LiquidityLauncherCreationModalProps {
  open: boolean
  onDismiss(): void
  data?: LiquidityLauncherFormInputFormatted
}

const LiquidityLauncherCreationModal: FC<LiquidityLauncherCreationModalProps> = ({
  open,
  onDismiss: _onDismiss,
  data,
}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { init, unsubscribe, subscribe } = useAuctionLiquidityLauncher()
  const { auction } = useAuction(data?.auctionAddress)

  const [liqLauncherAddress, setLiqLauncherAddress] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()

  const reset = useCallback(() => {
    if (!pending) {
      setLiqLauncherAddress(undefined)
      setTxHash(undefined)
      setError(undefined)
    }
  }, [pending])

  const onDismiss = useCallback(() => {
    reset()
    _onDismiss()
  }, [_onDismiss, reset])

  const execute = useCallback(
    async (data: LiquidityLauncherFormInputFormatted) => {
      setPending(true)

      try {
        const tx = await init(data)

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

  // Subscribe to creation event to get created pointlist ID
  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    subscribe('LauncherCreated', (owner, address, launcherTemplate, { transactionHash }) => {
      if (transactionHash?.toLowerCase() === txHash?.toLowerCase()) {
        setLiqLauncherAddress(address)
      }
    })

    return () => {
      unsubscribe('LauncherCreated', () => console.log('unsubscribed'))
    }
  }, [subscribe, txHash, unsubscribe])

  if (!data || !chainId) return <></>

  return (
    <HeadlessUIModal.Controlled isOpen={open} onDismiss={onDismiss} afterLeave={() => setTxHash(undefined)}>
      {!txHash ? (
        <HeadlessUIModal.Body>
          <HeadlessUIModal.Header
            onClose={onDismiss}
            header={i18n._(t`Create Liquidity Launcher`)}
            subheader={i18n._(t`Please review your entered details thoroughly.`)}
          />
          <HeadlessUIModal.Content>
            <div className="grid grid-cols-2 items-center">
              <Typography variant="sm" className="text-secondary py-2 border-b border-dark-700">
                {i18n._(t`Auction Address`)}
              </Typography>
              <Typography weight={700} variant="sm" className="text-purple py-2 border-b border-dark-700">
                <a target="_blank" rel="noreferrer" href={getExplorerLink(chainId, data.auctionAddress, 'address')}>
                  {shortenString(data.auctionAddress, 12)}
                </a>
              </Typography>
              <Typography variant="sm" className="text-secondary py-2 border-b border-dark-700">
                {i18n._(t`Lock period`)}
              </Typography>
              <Typography weight={700} variant="sm" className="text-high-emphesis py-2 border-b border-dark-700">
                {i18n._(t`${data.liqLockTime} days`)}
              </Typography>
              {auction && (
                <>
                  <Typography
                    variant="sm"
                    className="text-secondary py-2 border-b border-dark-700 h-full flex items-center"
                  >
                    {i18n._(t`Liquidity`)}
                  </Typography>
                  <Typography weight={700} variant="sm" className="text-high-emphesis py-2 border-b border-dark-700">
                    {auction.totalTokens?.multiply(new Percent(data.liqPercentage, '100')).toSignificant(6)}{' '}
                    {auction.auctionToken.symbol} + {new Percent(data.liqPercentage, '100').toSignificant(6)}% of
                    auction proceeds in {auction.paymentToken.symbol}
                  </Typography>
                </>
              )}
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
              {i18n._(t`Create Liquidity Launcher`)}
            </HeadlessUIModal.Action>
          </HeadlessUIModal.Actions>
          <HeadlessUIModal.Error>{error}</HeadlessUIModal.Error>
        </HeadlessUIModal.Body>
      ) : (
        <LiquidityLauncherCreationSubmittedModalContent
          txHash={txHash}
          liqLauncherAddress={liqLauncherAddress}
          onDismiss={onDismiss}
        />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default LiquidityLauncherCreationModal
