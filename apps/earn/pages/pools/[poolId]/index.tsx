import React, { FC, useState } from 'react'
import { SWRConfig } from 'swr'
import { Layout, PoolsFiltersProvider, SelectPricesWidget } from '../../../components'
import Link from 'next/link'
import { ArrowLeftIcon, PencilIcon, PlusIcon } from '@heroicons/react/solid'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { ChainId } from '@sushiswap/chain'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import { useConcentratedLiquidityPool } from '@sushiswap/wagmi/future/hooks'
import { classNames } from '@sushiswap/ui'
import { Native, SUSHI } from '@sushiswap/currency'
import { ConcentratedLiquidityWidget } from '../../../components/ConcentratedLiquidityWidget'
import { useAccount } from 'wagmi'
import { ConcentratedLiquidityProvider } from '../../../components/ConcentratedLiquidityProvider'
import { Button } from '@sushiswap/ui/future/components/button'
import { RadioGroup } from '@headlessui/react'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { CogIcon } from '@heroicons/react/outline'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { PoolHeader } from '../../../components/future/PoolHeader'
import { ConcentratedPositionsTable } from '../../../components/PoolsSection/Tables/PositionsTable/ConcentratedPositionsTable'
import { ContentBlock } from '../../../components/AddPage/ContentBlock'

const PositionPage = () => {
  return (
    <SplashController>
      <ConcentratedLiquidityProvider>
        <Position />
      </ConcentratedLiquidityProvider>
    </SplashController>
  )
}

const queryParamsSchema = z.object({
  poolId: z
    .string()
    .refine((val) => val.includes(':'), {
      message: 'TokenId not in the right format',
    })
    .transform((val) => {
      const [chainId, poolId] = val.split(':')
      return [+chainId, poolId] as [ChainId, string]
    }),
})

enum SelectedTab {
  NewPosition,
  ManagePosition,
}

const Position: FC = () => {
  const { address } = useAccount()
  const { query } = useRouter()
  const [tab, setTab] = useState<SelectedTab>(SelectedTab.NewPosition)

  const {
    poolId: [chainId, poolId],
  } = queryParamsSchema.parse(query)
  //
  // const { data: tokenIds } = useConcentratedLiquidityPositions({
  //   account: address,
  //   // TODO all supported chainIds
  //   chainIds: [ChainId.ARBITRUM],
  //   select: (data) => {
  //     if (!data) return data
  //     const _data = [...data]
  //     return _data.filter((el) => el.chainId === chainId && el.address === poolId)
  //   },
  // })

  const token0 = Native.onChain(ChainId.ARBITRUM)
  const token1 = SUSHI[ChainId.ARBITRUM]
  const feeAmount = 3000

  const { data: pool, isLoading } = useConcentratedLiquidityPool({
    chainId,
    token0,
    token1,
    feeAmount,
  })

  return (
    <SWRConfig>
      <Layout>
        <div className="flex flex-col gap-2">
          <Link className="group flex gap-4 items-center" href="/" shallow={true}>
            <IconButton
              icon={ArrowLeftIcon}
              iconProps={{
                width: 24,
                height: 24,
                transparent: true,
              }}
            />
            <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
              Go back to pools list
            </span>
          </Link>
          <PoolHeader isLoading={isLoading} chainId={chainId} pool={pool} />
          <RadioGroup value={tab} onChange={setTab} className="flex flex-wrap gap-2 mt-3">
            <RadioGroup.Option
              value={SelectedTab.NewPosition}
              as={Button}
              startIcon={<PlusIcon width={18} height={18} />}
              variant="outlined"
              color={tab === SelectedTab.NewPosition ? 'blue' : 'default'}
            >
              New position
            </RadioGroup.Option>{' '}
            <RadioGroup.Option
              value={SelectedTab.ManagePosition}
              as={Button}
              startIcon={<PencilIcon width={18} height={18} />}
              variant="outlined"
              color={tab === SelectedTab.ManagePosition ? 'blue' : 'default'}
            >
              Manage Position
            </RadioGroup.Option>
            <div>
              <SettingsOverlay
                options={{
                  slippageTolerance: {
                    storageKey: 'removeLiquidity',
                    defaultValue: '0.5',
                    title: 'Remove Liquidity Slippage',
                  },
                }}
                modules={[SettingsModule.SlippageTolerance]}
              >
                {({ setOpen }) => (
                  <Button variant="outlined" color="default" onClick={() => setOpen(true)}>
                    <CogIcon width={24} height={24} />
                  </Button>
                )}
              </SettingsOverlay>
            </div>
          </RadioGroup>
        </div>
        <div className="w-full mt-10 bg-gray-900/5 dark:bg-slate-200/5 my-10 h-0.5" />
        <div className={tab === SelectedTab.NewPosition ? 'block' : 'hidden'}>
          <div className="grid md:grid-cols-[404px_auto] gap-10">
            <div className="flex">
              <SelectPricesWidget
                chainId={chainId}
                token0={token0}
                token1={token1}
                feeAmount={feeAmount}
                tokenId={undefined}
              />
            </div>
            <div className="flex flex-col gap-3">
              <ContentBlock
                title={
                  <>
                    How much <span className="text-gray-900 dark:text-white">liquidity</span> do you want to provide?
                  </>
                }
              >
                <ConcentratedLiquidityWidget
                  chainId={chainId}
                  account={address}
                  token0={token0}
                  token1={token1}
                  feeAmount={feeAmount}
                  tokensLoading={false}
                  existingPosition={undefined}
                  tokenId={undefined}
                />
              </ContentBlock>
            </div>
          </div>
        </div>
        <div className={classNames('', tab === SelectedTab.ManagePosition ? 'block' : 'hidden')}>
          <PoolsFiltersProvider>
            <ConcentratedPositionsTable variant="minimal" />
          </PoolsFiltersProvider>
        </div>
      </Layout>
    </SWRConfig>
  )
}

export default PositionPage
