import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { classNames, isWrappedReturnNativeSymbol } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import { FC } from 'react'

const ClassicLinkButtons: FC = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { poolWithState, poolBalance } = usePoolContext()

  // Skeleton loader
  if (!poolWithState?.pool) return <></>

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      {poolBalance?.greaterThan(0) ? (
        <>
          <Button id={`btn-remove-liquidity`} variant="outlined" color="pink">
            <Link
              href={{
                pathname: `/trident/remove`,
                query: {
                  tokens: [poolWithState?.pool.token0.address, poolWithState?.pool.token1.address],
                  fee: poolWithState?.pool.fee,
                  twap: poolWithState?.pool.twap,
                },
              }}
              passHref={true}
            >
              {i18n._(t`Remove Liquidity`)}
            </Link>
          </Button>
          <Button id={`btn-add-stake-liquidity`} variant="outlined" color="blue">
            <Link
              href={{
                pathname: `/trident/add`,
                query: {
                  tokens: [
                    // It makes more sense to add liquidity with ETH instead of WETH
                    isWrappedReturnNativeSymbol(chainId, poolWithState?.pool.token0.address),
                    isWrappedReturnNativeSymbol(chainId, poolWithState?.pool.token1.address),
                  ],
                  fee: poolWithState?.pool.fee,
                  twap: poolWithState?.pool.twap,
                },
              }}
              passHref={true}
            >
              {i18n._(t`Add Liquidity`)}
            </Link>
          </Button>
        </>
      ) : (
        <Button id={`btn-deposit`} color="blue">
          <Link
            href={{
              pathname: `/trident/add`,
              query: {
                tokens: [
                  // It makes more sense to add liquidity with ETH instead of WETH
                  isWrappedReturnNativeSymbol(chainId, poolWithState?.pool.token0.address),
                  isWrappedReturnNativeSymbol(chainId, poolWithState?.pool.token1.address),
                ],
                fee: poolWithState?.pool.fee,
                twap: poolWithState?.pool.twap,
              },
            }}
            passHref={true}
          >
            {i18n._(t`Deposit`)}
          </Link>
        </Button>
      )}

      <Button color="gradient" className={classNames(poolBalance?.greaterThan(0) && 'col-span-2')}>
        <Link
          href={{
            pathname: `/swap`,
            query: {
              // It makes more sense to swap with ETH instead of WETH
              tokens: [
                isWrappedReturnNativeSymbol(chainId, poolWithState?.pool.token0.address),
                isWrappedReturnNativeSymbol(chainId, poolWithState?.pool.token1.address),
              ],
            },
          }}
          passHref={true}
        >
          {i18n._(t`Trade`)}
        </Link>
      </Button>
    </div>
  )
}

export default ClassicLinkButtons
