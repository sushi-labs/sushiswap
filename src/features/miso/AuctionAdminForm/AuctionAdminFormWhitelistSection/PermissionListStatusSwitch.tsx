import { Switch } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import { Auction } from 'app/features/miso/context/Auction'
import useAuctionEdit from 'app/features/miso/context/hooks/useAuctionEdit'
import { classNames } from 'app/functions'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useState } from 'react'

interface PermissionListStatusSwitchProps {
  auction: Auction
}

const PermissionListStatusSwitch: FC<PermissionListStatusSwitchProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const { updatePermissionListStatus } = useAuctionEdit(
    auction.auctionInfo.addr,
    auction?.launcherInfo?.address,
    auction.template
  )
  const [pending, setPending] = useState<boolean>(false)

  const handlePermissionListStatus = useCallback(
    async (status: boolean) => {
      try {
        setPending(true)
        const tx = await updatePermissionListStatus(status)

        if (tx?.hash) {
          await tx.wait()
        }
      } catch (e) {
        // @ts-ignore TYPE NEEDS FIXING
        console.error('Changing permission status failed: ', e.message)
      } finally {
        setPending(false)
      }
    },
    [updatePermissionListStatus]
  )

  return (
    <div className="flex flex-col">
      <Switch.Group>
        <div className="mt-2 flex items-center h-[42px]">
          <Switch
            disabled={pending}
            checked={auction.auctionInfo.usePointList}
            onChange={() => handlePermissionListStatus(!auction.auctionInfo.usePointList)}
            className={classNames(
              pending ? 'opacity-50 saturate-[0.1]' : 'opacity-100',
              auction.auctionInfo.usePointList
                ? 'bg-purple border-purple border-opacity-80'
                : 'bg-dark-700 border-dark-700',
              'filter bg-opacity-60 border  relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none'
            )}
          >
            <span
              className={classNames(
                auction.auctionInfo.usePointList ? 'translate-x-[23px]' : 'translate-x-[1px]',
                pending ? 'bg-dark-900' : 'bg-white',
                'inline-block w-7 h-7 transform rounded-full transition-transform text-blue'
              )}
            >
              {pending && (
                <div className="w-7 h-7">
                  <Lottie animationData={loadingCircle} autoplay loop />
                </div>
              )}
            </span>
          </Switch>
        </div>
      </Switch.Group>
      <p className="mt-2 text-sm text-gray-500">
        {auction.auctionInfo.usePointList ? i18n._(t`Status: enabled`) : i18n._(t`Status: disabled`)}
      </p>
    </div>
  )
}

export default PermissionListStatusSwitch
