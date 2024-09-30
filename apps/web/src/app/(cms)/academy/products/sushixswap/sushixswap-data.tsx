// import { ArbitrumCircle } from '@sushiswap/ui/icons/network/circle/ArbitrumCircle'
// import { AvalancheCircle } from '@sushiswap/ui/icons/network/circle/AvalancheCircle'
// import { BinanceCircle } from '@sushiswap/ui/icons/network/circle/BinanceCircle'
// import { EthereumCircle } from '@sushiswap/ui/icons/network/circle/EthereumCircle'
// import { FantomCircle } from '@sushiswap/ui/icons/network/circle/FantomCircle'
// import { OptimismCircle } from '@sushiswap/ui/icons/network/circle/OptimismCircle'
// import { PolygonCircle } from '@sushiswap/ui/icons/network/circle/PolygonCircle'

import {
  AcademyIcon,
  BlockchainIcon,
  BridgeIcon,
  CheckPaperIcon,
  DashboardIcon,
  MoneyPaperIcon,
  MoneyWavesIcon,
  ShieldIcon,
  SlidersIcon,
} from '../../../components/icons'

const color = '#FF9A5F'
const accentColor = '#C56D3A'
const cards = [
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyWavesIcon} />,
    title: 'Deepest Liquidity',
    subtitle: 'Automatically finds a path to trade on all major chains.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={BlockchainIcon} />,
    title: 'Fully Decentralized',
    subtitle: 'Built on Stargate.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyPaperIcon} />,
    title: 'No Additional Fees',
    subtitle: '0.3% standard DEX fee.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={CheckPaperIcon} />,
    title: 'Lowest Slippage',
    subtitle: 'No reliance on third parties.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={SlidersIcon} />,
    title: 'Non-Custodial',
    subtitle: 'Protocol-managed liquidity.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={DashboardIcon} />,
    title: 'Fast',
    subtitle:
      'Instantly initiates trades on both the source and destination chains.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={ShieldIcon} />,
    title: 'Safety Guard',
    subtitle: 'Failed transactions are saved into stablecoins.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={BridgeIcon} />,
    title: 'Bridge Aggregator',
    subtitle: 'Modular bridge API.',
  },
]
// const chains = [
//   {
//     Icon: EthereumCircle,
//     name: 'Ethereum',
//   },
//   { Icon: OptimismCircle, name: 'Optimism', url: '' },
//   {
//     Icon: ArbitrumCircle,
//     name: 'Arbitrum',
//   },
//   {
//     Icon: FantomCircle,
//     name: 'Fantom',
//   },
//   {
//     Icon: BinanceCircle,
//     name: 'Binance',
//   },
//   {
//     Icon: AvalancheCircle,
//     name: 'Avalanche',
//   },
//   {
//     Icon: PolygonCircle,
//     name: 'Polygon',
//   },
// ]
const faq = [
  {
    question: 'How does SushiXSwap provide best prices and minimal slippage?',
    answer: (
      <div className="space-y-4">
        <p>
          A challenge for crosschain bridges so far has been finding a path with
          sufficient liquidity on both sides of a swap. We solve this problem by
          plugging into our own Sushi liquidity pools, which are currently
          deployed on 15 chains. Being able to use this liquidity guarantees our
          users to always receive the best price for any pair across all the
          chains.
        </p>

        <p>
          Sushi’s swap routing finds the cheapest, fastest and most secure route
          for any user to get from point A to point B by plugging into Layer0’s
          Stargate bridge infrastructure. Stargate bridges chains securely
          without compromising on decentralization, which allows SushiXSwap to
          scale to any number of chains in the future.
        </p>
        <p>
          To further ensure we can always find the cheapest route and best price
          between any two tokens on all chains, we will continue to aggregate
          more bridges in the future. By building SushiXSwap in a modular,
          composable way, we will simplify the integration of your favorite
          bridge into our aggregator interface.
        </p>
      </div>
    ),
  },
]
const slug = 'sushixswap'

export { color, cards, faq, slug }
