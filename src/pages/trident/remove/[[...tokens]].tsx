import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PoolState } from '@sushiswap/trident-sdk'
import Alert from 'app/components/Alert'
import Button from 'app/components/Button'
import SettingsTab from 'app/components/Settings'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import PoolContext, { usePoolContext } from 'app/features/trident/PoolContext'
import ClassicSingleAside from 'app/features/trident/remove/ClassicSingleAside'
import ClassicSingleMode from 'app/features/trident/remove/ClassicSingleMode'
import ClassicStandardAside from 'app/features/trident/remove/ClassicStandardAside'
import ClassicStandardMode from 'app/features/trident/remove/ClassicStandardMode'
import FixedRatioHeader from 'app/features/trident/remove/FixedRatioHeader'
import { selectTridentRemove } from 'app/features/trident/remove/removeSlice'
import RemoveTransactionReviewSingleModal from 'app/features/trident/remove/RemoveTransactionReviewSingleModal'
import RemoveTransactionReviewStandardModal from 'app/features/trident/remove/RemoveTransactionReviewStandardModal'
import { isWrappedReturnNativeSymbol } from 'app/functions'
import NetworkGuard from 'app/guards/Network'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppSelector } from 'app/state/hooks'
import Link from 'next/link'
import React from 'react'

const RemoveClassic = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const { poolWithState } = usePoolContext()
  const { fixedRatio } = useAppSelector(selectTridentRemove)

  return (
    <>
      <TridentHeader pattern="bg-chevron">
        <div className="relative flex flex-col w-full gap-5 mt-px lg:justify-between lg:w-7/12">
          <div className="flex justify-between">
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="!pl-2 !py-1 rounded-full"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link
                href={
                  poolWithState?.state === PoolState.EXISTS
                    ? {
                        pathname: `/trident/pool`,
                        query: {
                          tokens: [
                            isWrappedReturnNativeSymbol(chainId, poolWithState.pool.token0.address),
                            isWrappedReturnNativeSymbol(chainId, poolWithState.pool.token1.address),
                          ],
                          fee: poolWithState.pool.fee,
                          twap: poolWithState.pool.twap,
                        },
                      }
                    : '/trident/pools'
                }
              >
                {poolWithState?.state === PoolState.EXISTS
                  ? `${poolWithState.pool.token0.symbol}-${poolWithState.pool.token1.symbol}`
                  : i18n._(t`Back`)}
              </Link>
            </Button>
            <SettingsTab trident />
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="h2" weight={700} className="text-high-emphesis">
              {i18n._(t`Remove Liquidity`)}
            </Typography>
            <Typography variant="sm">
              {i18n._(t`Receive both pool tokens in equal amounts or receive one of the two pool tokens.`)}
            </Typography>
            {poolWithState && [PoolState.NOT_EXISTS, PoolState.INVALID].includes(poolWithState.state) && (
              <Alert
                className="px-0 pb-0 bg-transparent"
                dismissable={false}
                type="error"
                showIcon
                message={i18n._(t`A Pool could not be found for provided currencies`)}
              />
            )}
          </div>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-full gap-5 lg:w-7/12">
            <FixedRatioHeader />
            <>
              {fixedRatio ? (
                <>
                  <ClassicStandardMode />
                  <RemoveTransactionReviewStandardModal />
                </>
              ) : (
                <>
                  <ClassicSingleMode />
                  <RemoveTransactionReviewSingleModal />
                </>
              )}
            </>
          </div>

          <div className="flex flex-col hidden lg:block lg:w-4/12 -mt-36">
            {fixedRatio ? <ClassicStandardAside /> : <ClassicSingleAside />}
          </div>
        </div>
      </TridentBody>
    </>
  )
}

RemoveClassic.Guard = NetworkGuard(Feature.TRIDENT)
RemoveClassic.Provider = PoolContext
RemoveClassic.Layout = TridentLayout

export default RemoveClassic
