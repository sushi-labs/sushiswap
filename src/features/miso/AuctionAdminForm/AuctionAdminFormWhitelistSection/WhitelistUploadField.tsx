import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { Fraction, JSBI } from '@sushiswap/core-sdk'
import loadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import { Auction } from 'app/features/miso/context/Auction'
import useAuctionEdit from 'app/features/miso/context/hooks/useAuctionEdit'
import { WhitelistEntry } from 'app/features/miso/context/types'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useState } from 'react'
import { toWei } from 'web3-utils'

import WhitelistUpload from '../../WhitelistUpload'

interface WhitelistUploadFieldProps {
  auction: Auction
}

const WhitelistUploadField: FC<WhitelistUploadFieldProps> = ({ auction }) => {
  const [pending, setPending] = useState<boolean>(false)
  const [wlAddresses, setWlAddresses] = useState<WhitelistEntry[]>([])

  const { updatePointList } = useAuctionEdit(
    auction.auctionInfo.addr,
    auction.launcherInfo?.address,
    auction.template,
    auction.launcherInfo?.liquidityTemplate,
    auction.pointListAddress
  )

  const handleUpdatePointList = useCallback(async () => {
    try {
      setPending(true)

      const [accounts, amounts] = wlAddresses.reduce<[string[], string[]]>(
        (acc, cur) => {
          acc[0].push(cur.account)
          acc[1].push(
            new Fraction(
              toWei(cur.amount),
              JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18 - auction.paymentToken.decimals))
            ).quotient.toString()
          )
          return acc
        },
        [[], []]
      )

      const tx = await updatePointList(accounts, amounts)

      if (tx?.hash) {
        await tx.wait()
      }
    } catch (e) {
      // @ts-ignore TYPE NEEDS FIXING
      console.error('Updating point list failed: ', e.message)
    } finally {
      setPending(false)
    }
  }, [auction.paymentToken.decimals, updatePointList, wlAddresses])

  return (
    <>
      <WhitelistUpload
        value={wlAddresses}
        disabled={!!(auction?.auctionInfo.usePointList && !auction.pointListAddress)}
        onChange={setWlAddresses}
      />
      <div className="flex justify-end col-span-6">
        <div>
          <Button
            disabled={pending || wlAddresses.length === 0}
            {...(pending && {
              startIcon: (
                <div className="w-5 h-5 mr-1">
                  <Lottie animationData={loadingCircle} autoplay loop />
                </div>
              ),
            })}
            color="blue"
            onClick={handleUpdatePointList}
          >
            {i18n._(t`Update Point List`)}
          </Button>
        </div>
      </div>
    </>
  )
}

export default WhitelistUploadField
