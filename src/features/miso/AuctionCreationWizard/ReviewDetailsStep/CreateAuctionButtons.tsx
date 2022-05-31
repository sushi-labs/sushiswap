import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CHAIN_KEY, NATIVE, Percent } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import LoadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import AuctionCreationSubmittedModalContent from 'app/features/miso/AuctionCreationForm/AuctionCreationSubmittedModalContent'
import { formatCreationFormData } from 'app/features/miso/AuctionCreationWizard/utils'
import useAuctionCreate from 'app/features/miso/context/hooks/useAuctionCreate'
import { useStore } from 'app/features/miso/context/store'
import { useAuctionedToken } from 'app/features/miso/context/store/createTokenDetailsSlice'
import { AuctionCreationWizardInput, TokenSetup } from 'app/features/miso/context/types'
import { ApprovalState, useApproveCallback, useContract } from 'app/hooks'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import { useRouter } from 'next/router'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

const CreateAuctionButtons: FC<{ onBack(): void }> = ({ onBack }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const state = useStore((state) => state)
  const auctionToken = useAuctionedToken()
  const paymentToken =
    useToken(state.paymentCurrencyAddress !== AddressZero ? state.paymentCurrencyAddress : undefined) ??
    NATIVE[chainId || 1]
  const router = useRouter()
  const [txHash, setTxHash] = useState<string>()
  const [pending, setPending] = useState<boolean>(false)
  const [auctionAddress, setAuctionAddress] = useState<string>()
  const [error, setError] = useState<string>()
  const { initWizard, subscribe, unsubscribe } = useAuctionCreate()
  const recipeContract = useContract(
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.AuctionCreation.address : undefined,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.AuctionCreation.abi : undefined
  )

  const data =
    paymentToken && auctionToken
      ? formatCreationFormData(state as AuctionCreationWizardInput, paymentToken, auctionToken)
      : undefined
  const approveAmount = useMemo(
    () => (data ? data.tokenAmount.add(data.tokenAmount.multiply(new Percent(data.liqPercentage, 10000))) : undefined),
    [data]
  )

  const [approvalState, approve] = useApproveCallback(
    state.tokenSetupType === TokenSetup.PROVIDE ? approveAmount : undefined,
    recipeContract?.address
  )

  const execute = useCallback(
    async (data) => {
      if (!data) return

      setPending(true)

      try {
        const tx = await initWizard(data)

        if (tx?.hash) {
          setTxHash(tx.hash)
          await tx.wait()
        }
      } catch (e) {
        // @ts-ignore TYPE NEEDS FIXING
        setError(e?.message)
      } finally {
        setPending(false)
      }
    },
    [initWizard]
  )

  // Subscribe to creation event to get created token ID
  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    subscribe('MarketCreated', (owner, address, marketTemplate, { transactionHash }) => {
      if (transactionHash?.toLowerCase() === txHash?.toLowerCase()) {
        setAuctionAddress(address)
        router.push(`/miso/${address}`)
      }
    })

    return () => {
      unsubscribe('MarketCreated', () => console.log('unsubscribed'))
    }
  }, [router, subscribe, txHash, unsubscribe])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {approvalState !== ApprovalState.APPROVED && data?.tokenSetupType === TokenSetup.PROVIDE && (
          <Button
            size="sm"
            color="blue"
            type="button"
            disabled={approvalState === ApprovalState.PENDING || pending}
            {...((approvalState === ApprovalState.PENDING || pending) && {
              startIcon: (
                <div className="w-4 h-4 mr-1">
                  <Lottie animationData={LoadingCircle} autoplay loop />
                </div>
              ),
            })}
            onClick={approve}
          >
            {i18n._(t`Approve`)}
          </Button>
        )}
        <Button
          size="sm"
          color="blue"
          type="button"
          disabled={
            (data?.tokenSetupType === TokenSetup.PROVIDE && approvalState !== ApprovalState.APPROVED) || pending
          }
          {...(pending && {
            startIcon: (
              <div className="w-4 h-4 mr-1">
                <Lottie animationData={LoadingCircle} autoplay loop />
              </div>
            ),
          })}
          onClick={() => execute(data)}
        >
          {i18n._(t`Create auction`)}
        </Button>
        <Button size="sm" color="blue" variant="empty" type="button" onClick={onBack}>
          {i18n._(t`Back`)}
        </Button>
      </div>
      <HeadlessUIModal.Controlled isOpen={!!txHash} onDismiss={() => setTxHash(undefined)}>
        <AuctionCreationSubmittedModalContent
          txHash={txHash}
          auctionAddress={auctionAddress}
          onDismiss={() => setTxHash(undefined)}
        />
      </HeadlessUIModal.Controlled>
      {error && (
        <Typography variant="sm" weight={700} className="text-red">
          {error}
        </Typography>
      )}
    </div>
  )
}

export default CreateAuctionButtons
