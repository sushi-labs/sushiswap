import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useIsMounted, useSlippageTolerance } from '@sushiswap/hooks'
import { AppearOnMount, Container, Link, Typography } from '@sushiswap/ui'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition/AddSectionMyPosition'
import { Layout } from 'components/Layout'
import { RemoveSectionWidget } from 'components/RemoveSection/RemoveSectionWidget'
import WalletSelector from 'components/WalletSelector'
import { FC, useState } from 'react'
import { usePoolState } from '../../Pool/PoolProvider'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'

interface Props {
  buttonError: string
}

const Remove: FC<{}> = ({}) => {
  return <_Remove buttonError={''} />
}

const _Remove = ({ buttonError }: Props) => {
  // const router = useRouter()
  const { connected } = useWallet()
  const isMounted = useIsMounted()
  const { notPairFound } = usePoolState()
  const [percentage, setPercentage] = useState<string>('')
  const [slippageTolerance] = useSlippageTolerance('removeLiquidity')
  return (
    <>
      <Layout>
        <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
          <div className="hidden md:block" />
          <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
            <RemoveSectionWidget percentage={percentage} setPercentage={setPercentage}>
              {connected ? (
                <button
                  className={`btn w-full flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold ${
                    notPairFound || buttonError || Number(percentage) <= 0
                      ? 'pointer-events-none relative opacity-[0.4] overflow-hidden'
                      : ''
                  }`}
                  disabled={buttonError ? true : false}
                >
                  {notPairFound ? (
                    notPairFound
                  ) : buttonError ? (
                    ''
                  ) : Number(percentage) > 0 ? (
                    <>Remove Liquidity</>
                  ) : (
                    <>Enter Amount</>
                  )}
                </button>
              ) : (
                <WalletSelector hideChevron color="blue" size="xl" fullWidth={true} />
              )}
            </RemoveSectionWidget>
            <Container className="flex justify-center">
              <Link.External
                href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
                className="flex justify-center px-6 py-4 decoration-slate-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
              >
                <Typography
                  variant="xs"
                  weight={500}
                  className="flex items-center gap-1 text-gray-600 dark:text-slate-500"
                >
                  Learn more about liquidity and yield farming
                  {/* <Link.External width={16} height={16} className="text-gray-600 dark:text-slate-500" /> */}
                  <ArrowTopRightOnSquareIcon height={20} width={20} />
                </Typography>
              </Link.External>
            </Container>
          </div>
          <div className="order-1 sm:order-3">
            <AppearOnMount>
              <AddSectionMyPosition />
            </AppearOnMount>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Remove
