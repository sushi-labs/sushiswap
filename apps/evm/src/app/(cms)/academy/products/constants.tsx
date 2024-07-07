import { ArbitrumCircle } from '@sushiswap/ui/icons/network/circle/ArbitrumCircle'
import { AvalancheCircle } from '@sushiswap/ui/icons/network/circle/AvalancheCircle'
import { BinanceCircle } from '@sushiswap/ui/icons/network/circle/BinanceCircle'
import { EthereumCircle } from '@sushiswap/ui/icons/network/circle/EthereumCircle'
import { FantomCircle } from '@sushiswap/ui/icons/network/circle/FantomCircle'
import { OptimismCircle } from '@sushiswap/ui/icons/network/circle/OptimismCircle'
import { PolygonCircle } from '@sushiswap/ui/icons/network/circle/PolygonCircle'

import {
  AcademyIcon,
  ArrowUpIcon,
  BarsIcon,
  BlockchainIcon,
  BridgeIcon,
  CheckPaperIcon,
  CircleArrowsIcon,
  DashboardIcon,
  GasPumpIcon,
  HalfScreenIcon,
  LeftRightArrowIcon,
  LinkIcon,
  MobileUiIcon,
  MoneyBagIcon,
  MoneyHandIcon,
  MoneyPaperIcon,
  MoneyTreeIcon,
  MoneyWavesIcon,
  NftLinkIcon,
  PuzzlePieceIcon,
  ScreenCheckIcon,
  ShieldIcon,
  SlidersIcon,
  SmellyMoneyHandIcon,
  SmileyIcon,
  SushiIcon,
  TilesIcon,
  TwoCoinsIcon,
  WavesIcon,
} from '../../components/icons'

export const PRODUCTS_DATA = {
  bentobox: {
    color: '#FF5EAF',
    accentColor: '#A048DA',
    buttonText: 'Enter Farms',
    cards: [
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.bentobox.accentColor}
            Icon={TilesIcon}
          />
        ),
        title: 'Utilize funds in multiple DeFi apps',
        subtitle:
          'BentoBox’s innovation is its ability to track users’ deposits via an artificial balance, which is used to account for their idle funds while they’re simultaneously applied to strategies.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.bentobox.accentColor}
            Icon={MoneyTreeIcon}
          />
        ),
        title: 'Earn some of the highest yield in DeFi',
        subtitle:
          'As the foundation for multiple DeFi apps, BentoBox can attract more capital than simple vaults, leading to higher yield than most vaults',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.bentobox.accentColor}
            Icon={MoneyHandIcon}
          />
        ),
        title: 'Flash Loans',
        subtitle:
          'Funds in BentoBox can be used for flash loans, adding more passive value to users’ underutilized capital.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.bentobox.accentColor}
            Icon={PuzzlePieceIcon}
          />
        ),
        title: 'Plug ’n play interest pools for your DeFi app',
        subtitle:
          'Build your own DeFi apps on top of BentoBox to instantly utilize over 500m+ TVL.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.bentobox.accentColor}
            Icon={MoneyBagIcon}
          />
        ),
        title: 'Capital Efficiency',
        subtitle:
          'Profit from efficiencies of a growing protocol by saving on gas fees on each dApp deployed on BentoBox.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.bentobox.accentColor}
            Icon={ScreenCheckIcon}
          />
        ),
        title: 'Smooth UX',
        subtitle:
          'Approvals are inherited by the system, making individual transactions within BentoBox cheaper.',
      },
    ],
    faq: [
      {
        question: 'What is a Flash Loan?',
        answer: (
          <div className="space-y-4">
            <p>
              Flash loans are loans that can be taken by anyone without having
              to put out any collateral. It is possible to make such a
              transaction because everything is repaid in the same block.
            </p>
            <p>
              The entire process is executed by a smart contract. If the smart
              contract detects that the loan will not be fully repaid in the
              same block, the transaction will be rejected.
            </p>
            <p>
              Platforms that allow the usage of flash loans usually charge a fee
              - for BentoBox it is 0.05%.
            </p>
            <p>
              Flash loans are particularly useful for arbitrage and
              liquidations. It is very capital efficient as bots and users do
              not need to have high amount of idle funds in their wallets to
              execute the trade.
            </p>
          </div>
        ),
      },
    ],
  },
  trident: {
    color: '#93E5CE',
    accentColor: '#22AD9D',
    productStats: [
      { name: 'Volume Generated', value: '100+ mln' },
      { name: 'Pools Added', value: '100+' },
      { name: 'Chain Deployments', value: '4+' },
    ],
    cards: [
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.trident.accentColor}
            Icon={CircleArrowsIcon}
          />
        ),
        title: 'All-In-One Decentralized Exchange',
        subtitle:
          'The Trident Framework can support any pool type, no matter how novel or complex.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.trident.accentColor}
            Icon={BarsIcon}
          />
        ),
        title: 'More than a single AMM',
        subtitle:
          "Trident is not one specific AMM itself, it's a host (framework) to all.",
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.trident.accentColor}
            Icon={MoneyBagIcon}
          />
        ),
        title: 'Capital Efficient',
        subtitle:
          'Built on and powered by the BentoBox, passively earning yield on your tokens.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.trident.accentColor}
            Icon={SmellyMoneyHandIcon}
          />
        ),
        title: 'Save money on every swap',
        subtitle:
          'Managed by Tines, our smart ordering router, calculating and saving you money on every swap.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.trident.accentColor}
            Icon={HalfScreenIcon}
          />
        ),
        title: 'Extensible Versioning',
        subtitle:
          'Always compatible with previous versions, allowing developers to continue building new AMMs on Trident, without reinventing the wheel.',
      },
    ],
    faq: [
      {
        question:
          'What is the difference between Trident’s Classic and Legacy pools?',
        answer: (
          <p>
            Classic pools made through the Trident framework have new additional
            capabilities that legacy pools do not. Legacy pools use the old AMM
            framework and stick to a 0.3% base fee structure. Trident classic
            pools have adjustable fees (anywhere from 0.01% to 1%) and can use
            TWAP pricing oracles.
          </p>
        ),
      },
      {
        question: 'What is a Constant Product Pool?',
        answer: (
          <p>
            Constant Product Pools (AMMs) are pools that DeFi users are most
            familiar with, where trading happens between two assets over the
            x*y=k constant product formula. ‘Constant Product’ pools are
            composed 50% of one token and 50% of another. They’re best for
            pairing tokens that are unpredictable.
          </p>
        ),
      },
      {
        question: 'What is a Stable Swap Pool?',
        answer: (
          <p>
            Stable Pools are liquidity pools set particularly for pairs of
            pegged assets. This applies not just to stable coins, but also other
            assets such a wBitcoin to renBTC or wETH to stETH. Unlike regular
            constant product pools where you would see a somewhat large margin
            of slippage, these stable pools allow users to trade straight across
            these assets with minimal price impact.
          </p>
        ),
      },
    ],
  },
  onsen: {
    color: '#75B5F0',
    accentColor: '#187BD8',
    buttonText: 'Enter Farms',
    productStats: [
      { value: '$500+ mln', name: 'Total Value Locked' },
      { value: '500+', name: 'Projects Onboarded' },
      { value: '500+', name: 'Token Pairs' },
    ],
    cards: [
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.onsen.accentColor}
            Icon={MoneyBagIcon}
          />
        ),
        title: 'Earn some of the highest yields in DeFi',
        subtitle: 'Earn some of the highest yields on new, exciting projects.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.onsen.accentColor}
            Icon={MoneyWavesIcon}
          />
        ),
        title: 'Deep Liquidity',
        subtitle:
          'Provides incentives to pool tokens into BentoBox, providing deeper liquidity for trades on Trident AMMs and Kashi lending markets.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.onsen.accentColor}
            Icon={LinkIcon}
          />
        ),
        title: 'Multichain Deployment',
        subtitle:
          'Deployed across 20+ chains, never miss another opportunity to farm on a new chain again.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.onsen.accentColor}
            Icon={CircleArrowsIcon}
          />
        ),
        title: 'Attract Liquidity & Attention',
        subtitle:
          'Get incentives from Sushi to match with your own, attracting liquidity and attention to your project.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.onsen.accentColor}
            Icon={SmileyIcon}
          />
        ),
        title: 'Earn Yield & Boost Efficiency',
        subtitle:
          'Earn yield on treasury tokens, ease the burden of impermanent loss and decrease the price impact/slippage of individual trades, improving cost efficiency.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.onsen.accentColor}
            Icon={ShieldIcon}
          />
        ),
        title: 'Security Audited',
        subtitle: 'Safe, fully audited for security and peace of mind.',
      },
    ],
    faq: [
      {
        question: 'What is triple yield? (BentoBox + Kashi + Onsen)',
        answer: (
          <div className="space-y-4">
            <p>
              Triple yield means accumulating three forms of yield on your
              funds. This is made possible when you lend out your funds via
              Kashi.
            </p>
            <p>How?</p>
            <ol className="pl-4 list-decimal">
              <li>
                Lend out your funds via Kashi and earn interest from borrowers.
              </li>
              <li>
                Idle assets automatically earn a small yield from BentoBox
                strategies.
              </li>
              <li>
                Stake the KMP tokens you receive in Kashi farms to earn extra
                $SUSHI rewards.
              </li>
            </ol>
            <p>
              With Trident it will be possible to do the same with your SLPs
            </p>
            <ol className="pl-4 list-decimal">
              <li>Add liquidity on Trident and earn fees from all swaps.</li>
              <li>
                Idle assets automatically earn a small yield from BentoBox
                strategies.
              </li>
              <li>
                Stake the SLP tokens you receive in Sushiswap farms to earn
                extra $SUSHI rewards.
              </li>
            </ol>
          </div>
        ),
      },
      {
        question: 'What is a 2x reward Farm?',
        answer: (
          <div className="space-y-4">
            <p>
              A 2x reward farm allows a user to earn $SUSHI & an addition token
              as a reward when their SLP tokens are staked in it. These are
              extra rewards added on top of the trading fees earned from
              providing liquidity.
            </p>
            <p>
              These farm contracts are named Masterchefv2 (or Minichefv2 on L2 &
              sidechains).
            </p>
            <p>
              This allows other projects that are listed on Sushiswap to
              incentivize their token holders to provide liquidity for that
              specific token.
            </p>
          </div>
        ),
      },
      {
        question:
          'What is the difference between MasterChef, MasterChefv2 and MiniChef?',

        answer: (
          <div className="space-y-4">
            <p>
              There are three different types of implementations for Masterchef
            </p>
            <ul className="pl-4 list-disc">
              <li>
                MasterChefv1: The main contract on the Ethereum network that
                rewards $SUSHI to users for staking their LP and/or KMP tokens.
              </li>
              <li>
                MasterChefv2: Secondary contract on the Ethereum network. It is
                built on top of MasterChefv1 and gives 2 different type of
                tokens as a reward. e.g Users will receive SUSHI & another token
                as their staking reward.
              </li>
              <li>
                MiniChef: This contract is mainly deployed on various EVM
                compatible chains (AVAX, FTM, CELO etc.). It is similar to
                MasterChefv2, in which it also gives 2 different type of tokens
                as a reward.
              </li>
            </ul>
          </div>
        ),
      },
    ],
  },
  sushixswap: {
    color: '#FF9A5F',
    accentColor: '#C56D3A',
    cards: [
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.sushixswap.accentColor}
            Icon={MoneyWavesIcon}
          />
        ),
        title: 'Deepest Liquidity',
        subtitle: 'Automatically finds a path to trade on all major chains.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.sushixswap.accentColor}
            Icon={BlockchainIcon}
          />
        ),
        title: 'Fully Decentralized',
        subtitle: 'Built on Stargate.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.sushixswap.accentColor}
            Icon={MoneyPaperIcon}
          />
        ),
        title: 'No Additional Fees',
        subtitle: '0.3% standard DEX fee.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.sushixswap.accentColor}
            Icon={CheckPaperIcon}
          />
        ),
        title: 'Lowest Slippage',
        subtitle: 'No reliance on third parties.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.sushixswap.accentColor}
            Icon={SlidersIcon}
          />
        ),
        title: 'Non-Custodial',
        subtitle: 'Protocol-managed liquidity.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.sushixswap.accentColor}
            Icon={DashboardIcon}
          />
        ),
        title: 'Fast',
        subtitle:
          'Instantly initiates trades on both the source and destination chains.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.sushixswap.accentColor}
            Icon={ShieldIcon}
          />
        ),
        title: 'Safety Guard',
        subtitle: 'Failed transactions are saved into stablecoins.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.sushixswap.accentColor}
            Icon={BridgeIcon}
          />
        ),
        title: 'Bridge Aggregator',
        subtitle: 'Modular bridge API.',
      },
    ],
    chains: [
      {
        Icon: EthereumCircle,
        name: 'Ethereum',
      },
      { Icon: OptimismCircle, name: 'Optimism', url: '' },
      {
        Icon: ArbitrumCircle,
        name: 'Arbitrum',
      },
      {
        Icon: FantomCircle,
        name: 'Fantom',
      },
      {
        Icon: BinanceCircle,
        name: 'Binance',
      },
      {
        Icon: AvalancheCircle,
        name: 'Avalanche',
      },
      {
        Icon: PolygonCircle,
        name: 'Polygon',
      },
    ],
    faq: [
      {
        question:
          'How does SushiXSwap provide best prices and minimal slippage?',
        answer: (
          <div className="space-y-4">
            <p>
              A challenge for crosschain bridges so far has been finding a path
              with sufficient liquidity on both sides of a swap. We solve this
              problem by plugging into our own Sushi liquidity pools, which are
              currently deployed on 15 chains. Being able to use this liquidity
              guarantees our users to always receive the best price for any pair
              across all the chains.
            </p>

            <p>
              Sushi’s swap routing finds the cheapest, fastest and most secure
              route for any user to get from point A to point B by plugging into
              Layer0’s Stargate bridge infrastructure. Stargate bridges chains
              securely without compromising on decentralization, which allows
              SushiXSwap to scale to any number of chains in the future.
            </p>
            <p>
              To further ensure we can always find the cheapest route and best
              price between any two tokens on all chains, we will continue to
              aggregate more bridges in the future. By building SushiXSwap in a
              modular, composable way, we will simplify the integration of your
              favorite bridge into our aggregator interface.
            </p>
          </div>
        ),
      },
    ],
  },
  kashi: {
    color: '#FF5EAF',
    accentColor: '#D84D7F',
    cards: [
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.kashi.accentColor}
            Icon={TwoCoinsIcon}
          />
        ),
        title: 'Isolated Lending Pairs',
        subtitle:
          'Anyone can create a pair, it’s up to users which pairs they find safe enough; risk is isolated to just that pair.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.kashi.accentColor}
            Icon={WavesIcon}
          />
        ),
        title: 'Flexible',
        subtitle: 'Flexible oracles, both on-chain and off-chain.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.kashi.accentColor}
            Icon={MoneyHandIcon}
          />
        ),
        title: 'Liquid Utilization Range',
        subtitle:
          'Liquid interest rates based on a specific target utilization range.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.kashi.accentColor}
            Icon={GasPumpIcon}
          />
        ),
        title: 'Lowest Gas Fees',
        subtitle:
          'Flexible/composable contracts optimized for low gas consumption.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.kashi.accentColor}
            Icon={ArrowUpIcon}
          />
        ),
        title: 'Flash Loans',
        subtitle:
          'Built on the BentoBox, so supplied assets can be used for flash loans and strategies, providing extra revenue for liquidity providers.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.kashi.accentColor}
            Icon={ScreenCheckIcon}
          />
        ),
        title: 'LP Benefits',
        subtitle:
          'Benefits of liquidations go to the liquidity providers, not the liquidators.',
      },
    ],
    faq: [
      {
        question: 'What is the difference between the Onsen and Kashi farm?',
        answer: (
          <div className="space-y-4">
            <p>
              On Sushi, you can stake two different type of liquidity tokens:
            </p>
            <ul className="pl-4 list-disc">
              <li>
                SLP tokens: Tokens you receive as an IOU when adding liquidity
                on Sushi.
              </li>
              <li>
                KMP tokens: Tokens you receive as an IOU when lending on Kashi.
              </li>
            </ul>
            <p>
              The Onsen Menu for staking SLP tokens can be found under the
              ‘Farm’ tab at the top of the Sushi web page. These farms allow you
              to receive daily rewards in $SUSHI or other tokens as an incentive
              for providing liquidity.
            </p>
          </div>
        ),
      },
      {
        question: 'What is triple yield? (BentoBox + Kashi + Onsen)',
        answer: (
          <div className="space-y-4">
            <p>
              Triple yield means accumulating three forms of yield on your
              funds. This is made possible when you lend out your funds via
              Kashi.
            </p>
            <p>How?</p>
            <ol className="pl-4 list-decimal">
              <li>
                Lend out your funds via Kashi and earn interest from borrowers.
              </li>
              <li>
                Idle assets automatically earn a small yield from BentoBox
                strategies.
              </li>
              <li>
                Stake the KMP tokens you receive in Kashi farms to earn extra
                $SUSHI rewards.
              </li>
            </ol>
            <p>
              With Trident it will be possible to do the same with your SLPs
            </p>
            <ol className="pl-4 list-decimal">
              <li>Add liquidity on Trident and earn fees from all swaps.</li>
              <li>
                Idle assets automatically earn a small yield from BentoBox
                strategies.
              </li>
              <li>
                Stake the SLP tokens you receive in Sushiswap farms to earn
                extra $SUSHI rewards.
              </li>
            </ol>
          </div>
        ),
      },
      {
        question:
          'How is Kashi different from other lending platforms like Aave & Compound?',
        answer: (
          <div className="space-y-4">
            <p>
              Both Aave & Compound use a pool-based system which tags their
              funds to various tokens on their platforms. This means that the
              solvency of any token will affect the entire platform.
            </p>
            <p>
              {"Kashi's"} isolated lending architecture mitigates the risks to a
              specific pair only, thus enabling any token to be listed as an
              asset/collateral. It uses an elastic interest rate to incentivize
              liquidity into a certain range and oracles to provide price feeds
              for all tokens.
            </p>
          </div>
        ),
      },
    ],
  },
  furo: {
    color: '#EB72FF',
    accentColor: '#B341C6',
    buttonText: 'Launch Furo',
    productStats: [
      { value: '$100+ mln', name: 'Total Value Locked' },
      { value: '500+', name: 'Streams/Vests Live' },
      { value: '11', name: 'Chain Deployments' },
    ],
    cards: [
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.furo.accentColor}
            Icon={PuzzlePieceIcon}
          />
        ),
        title: 'Plug ‘n Play',
        subtitle:
          'Furo saves you time from having to do  contract deployments yourself.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.furo.accentColor}
            Icon={MobileUiIcon}
          />
        ),
        title: 'Intuitive UI',
        subtitle:
          'See the vesting schedules and progress in an easy-to-use dashboard.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.furo.accentColor}
            Icon={LeftRightArrowIcon}
          />
        ),
        title: 'Integration Possibilities',
        subtitle:
          'Furo minimizes admin by integrating directly into your existing DAO or DeFi tooling.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.furo.accentColor}
            Icon={NftLinkIcon}
          />
        ),
        title: 'NFT Composability',
        subtitle:
          'NFT tokenization on Furo allows our users to utilize their future payments in lending and borrowing money market protocols.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.furo.accentColor}
            Icon={MoneyBagIcon}
          />
        ),
        title: 'Passive Income',
        subtitle:
          'All Furo subproducts are built upon BentoBox; all capital stored in Furo will be automatically earning yield.',
      },
      {
        Icon: () => (
          <AcademyIcon
            color={PRODUCTS_DATA.furo.accentColor}
            Icon={SushiIcon}
          />
        ),
        title: 'Sushi Ecosystem',
        subtitle:
          'Furo is fully open source and integrated into the Sushi ecosystem and our suite of products.',
      },
    ],
    faq: [
      {
        question: 'What is Furo?',
        answer: (
          <div className="space-y-4">
            <p>
              Furo is a payment streaming platform that anyone can use to make
              automated payments to other wallets - whether they be for
              individuals, DAOs, or any other type of entity. While it my seem
              very similar to apps like Sablier or Llamapay, there are
              additional features which make Furo particularly appealing. One of
              these strengths would be the utilization of the BentoBox
              architecture.
            </p>
            <p>
              Other apps require funds to be locked in contract. With Furo,
              tokens sit inside of the BentoBox giving potential for them to
              also simultaneously be utilized by strategies to accrue yield.
              This provides a pleasant way to have your value grow before you
              even receive it! Streams and vesting that are sent via Furo are
              also represented by an NFT minted to the receiving wallet. The
              owner can even send that NFT to another wallet to transfer
              ownership of the stream.
            </p>
          </div>
        ),
      },
      {
        question: 'On what chains is Furo available?',
        answer: (
          <div className="space-y-4">
            <p>
              Currently Furo is available on most networks/chains that Sushi is
              deployed on:
            </p>
            <ul className="list-disc list-inside">
              <li>Ethereum</li>
              <li>Polygon</li>
              <li>Gnosis</li>
              <li>Arbitrum</li>
              <li>Optimism</li>
              <li>Goerli Test Network</li>
              <li>Avalanche</li>
              <li>BSC</li>
              <li>Fantom</li>
              <li>Harmony</li>
              <li>Moonbeam</li>
              <li>Moonriver</li>
            </ul>
          </div>
        ),
      },
    ],
  },
}
