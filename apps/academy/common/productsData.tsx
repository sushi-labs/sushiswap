import {
  ArbitrumCircle,
  AvalancheCircle,
  BinanceCircle,
  EthereumCircle,
  FantomCircle,
  OptimismCircle,
  PolygonCircle,
  Typography,
} from '@sushiswap/ui'

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
  LightBulbIcon,
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
  ThreeLinkIcon,
  TilesIcon,
  TwoCoinsIcon,
  WavesIcon,
} from './icons'

export const PRODUCTS_DATA = {
  bentobox: {
    color: '#FF5EAF',
    accentColor: '#A048DA',
    buttonText: 'Enter Farms',
    cards: [
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.bentobox.accentColor} Icon={TilesIcon} />,
        title: 'Utilize funds in multiple DeFi apps',
        subtitle:
          'BentoBox’s innovation is its ability to track users’ deposits via an artificial balance, which is used to account for their idle funds while they’re simultaneously applied to strategies.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.bentobox.accentColor} Icon={MoneyTreeIcon} />,
        title: 'Earn some of the highest yield in DeFi',
        subtitle:
          'As the foundation for multiple DeFi apps, BentoBox can attract more capital than simple vaults, leading to higher yield than most vaults',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.bentobox.accentColor} Icon={MoneyHandIcon} />,
        title: 'Flash Loans',
        subtitle:
          'Funds in BentoBox can be used for flash loans, adding more passive value to users’ underutilized capital.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.bentobox.accentColor} Icon={PuzzlePieceIcon} />,
        title: 'Plug ’n play interest pools for your DeFi app',
        subtitle: 'Build your own DeFi apps on top of BentoBox to instantly utilize over 500m+ TVL.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.bentobox.accentColor} Icon={MoneyBagIcon} />,
        title: 'Capital Efficiency',
        subtitle:
          'Profit from efficiencies of a growing protocol by saving on gas fees on each dApp deployed on BentoBox.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.bentobox.accentColor} Icon={ScreenCheckIcon} />,
        title: 'Smooth UX',
        subtitle: 'Approvals are inherited by the system, making individual transactions within BentoBox cheaper.',
      },
    ],
    faq: [
      {
        question: 'Lorem ipsum',
        answer: (
          <>
            <Typography>
              Trident is a production framework for building and deploying AMMs, but it is not an AMM itself. While AMMs
              can be created using the Trident code, there isn’t a specific AMM at the center of Trident. Instead, there
              is a framework for creating any AMM anyone would ever need.
            </Typography>
            <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
            <ul className="list-disc list-inside">
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Classic pool{' '}
                </Typography>
                <Typography as="span">
                  = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of another.
                  They’re best for pairing tokens that are unpredictable.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Concentrated pool{' '}
                </Typography>
                <Typography as="span">
                  = these pools also use two tokens. The difference is that the liquidity in each pool is determined by
                  the ranges set by the pool creator.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Stable pools{' '}
                </Typography>
                <Typography as="span">
                  = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and USDT,
                  or other pegged tokens like ETH and stETH, or renBTC and WBTC.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Index pools{' '}
                </Typography>
                <Typography as="span">
                  = these pools are usually used to create baskets of assets or decentralized index funds; hence the
                  name. These pools can be made of any percentage of tokens equalling 100.
                </Typography>
              </li>
            </ul>
          </>
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
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.trident.accentColor} Icon={CircleArrowsIcon} />,
        title: 'All-In-One Decentralized Exchange',
        subtitle: 'The Trident Framework can support any pool type, no matter how novel or complex.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.trident.accentColor} Icon={BarsIcon} />,
        title: 'More than a single AMM',
        subtitle: "Trident is not one specific AMM itself, it's a host (framework) to all.",
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.trident.accentColor} Icon={MoneyBagIcon} />,
        title: 'Capital Efficient',
        subtitle: 'Built on and powered by the BentoBox, passively earning yield on your tokens.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.trident.accentColor} Icon={SmellyMoneyHandIcon} />,
        title: 'Save money on every swap',
        subtitle: 'Managed by Tines, our smart ordering router, calculating and saving you money on every swap.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.trident.accentColor} Icon={HalfScreenIcon} />,
        title: 'Extensible Versioning',
        subtitle:
          'Always compatible with previous versions, allowing developers to continue building new AMMs on Trident, without reinventing the wheel.',
      },
    ],
    faq: [
      {
        question: 'What is Trident and what Pool types does it support?',
        answer: (
          <>
            <Typography>
              Trident is a production framework for building and deploying AMMs, but it is not an AMM itself. While AMMs
              can be created using the Trident code, there isn’t a specific AMM at the center of Trident. Instead, there
              is a framework for creating any AMM anyone would ever need.
            </Typography>
            <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
            <ul className="list-disc list-inside">
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Classic pool{' '}
                </Typography>
                <Typography as="span">
                  = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of another.
                  They’re best for pairing tokens that are unpredictable.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Concentrated pool{' '}
                </Typography>
                <Typography as="span">
                  = these pools also use two tokens. The difference is that the liquidity in each pool is determined by
                  the ranges set by the pool creator.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Stable pools{' '}
                </Typography>
                <Typography as="span">
                  = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and USDT,
                  or other pegged tokens like ETH and stETH, or renBTC and WBTC.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Index pools{' '}
                </Typography>
                <Typography as="span">
                  = these pools are usually used to create baskets of assets or decentralized index funds; hence the
                  name. These pools can be made of any percentage of tokens equalling 100.
                </Typography>
              </li>
            </ul>
          </>
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
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.onsen.accentColor} Icon={MoneyBagIcon} />,
        title: 'Earn some of the highest yields in DeFi',
        subtitle: 'Earn some of the highest yields on new, exciting projects.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.onsen.accentColor} Icon={MoneyWavesIcon} />,
        title: 'Deep Liquidity',
        subtitle:
          'Provides incentives to pool tokens into BentoBox, providing deeper liquidity for trades on Trident AMMs and Kashi lending markets.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.onsen.accentColor} Icon={LinkIcon} />,
        title: 'Multichain Deployment',
        subtitle: 'Deployed across 20+ chains, never miss another opportunity to farm on a new chain again.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.onsen.accentColor} Icon={CircleArrowsIcon} />,
        title: 'Attract Liquidity & Attention',
        subtitle:
          'Get incentives from Sushi to match with your own, attracting liquidity and attention to your project.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.onsen.accentColor} Icon={SmileyIcon} />,
        title: 'Earn Yield & Boost Efficiency',
        subtitle:
          'Earn yield on treasury tokens, ease the burden of impermanent loss and decrease the price impact/slippage of individual trades, improving cost efficiency.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.onsen.accentColor} Icon={ShieldIcon} />,
        title: 'Security Audited',
        subtitle: 'Safe, fully audited for security and peace of mind.',
      },
    ],
    faq: [
      {
        question: 'What is Trident and what Pool types does it support?',
        answer: (
          <>
            <Typography>
              Trident is a production framework for building and deploying AMMs, but it is not an AMM itself. While AMMs
              can be created using the Trident code, there isn’t a specific AMM at the center of Trident. Instead, there
              is a framework for creating any AMM anyone would ever need.
            </Typography>
            <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
            <ul className="list-disc list-inside">
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Classic pool{' '}
                </Typography>
                <Typography as="span">
                  = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of another.
                  They’re best for pairing tokens that are unpredictable.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Concentrated pool{' '}
                </Typography>
                <Typography as="span">
                  = these pools also use two tokens. The difference is that the liquidity in each pool is determined by
                  the ranges set by the pool creator.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Stable pools{' '}
                </Typography>
                <Typography as="span">
                  = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and USDT,
                  or other pegged tokens like ETH and stETH, or renBTC and WBTC.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Index pools{' '}
                </Typography>
                <Typography as="span">
                  = these pools are usually used to create baskets of assets or decentralized index funds; hence the
                  name. These pools can be made of any percentage of tokens equalling 100.
                </Typography>
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  sushixswap: {
    color: '#FF9A5F',
    accentColor: '#C56D3A',
    cards: [
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.sushixswap.accentColor} Icon={MoneyWavesIcon} />,
        title: 'Deepest Liquidity',
        subtitle: 'Automatically finds a path to trade on all major chains.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.sushixswap.accentColor} Icon={BlockchainIcon} />,
        title: 'Fully Decentralized',
        subtitle: 'Built on Stargate.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.sushixswap.accentColor} Icon={MoneyPaperIcon} />,
        title: 'No Additional Fees',
        subtitle: '0.3% standard DEX fee.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.sushixswap.accentColor} Icon={CheckPaperIcon} />,
        title: 'Lowest Slippage',
        subtitle: 'No reliance on third parties.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.sushixswap.accentColor} Icon={SlidersIcon} />,
        title: 'Non-Custodial',
        subtitle: 'Protocol-managed liquidity.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.sushixswap.accentColor} Icon={DashboardIcon} />,
        title: 'Fast',
        subtitle: 'Instantly initiates trades on both the source and destination chains.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.sushixswap.accentColor} Icon={ShieldIcon} />,
        title: 'Safety Guard',
        subtitle: 'Failed transactions are saved into stablecoins.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.sushixswap.accentColor} Icon={BridgeIcon} />,
        title: 'Bridge Aggregator',
        subtitle: 'Modular bridge API.',
      },
    ],
    // TODO: links to be reviewed by team
    chains: [
      { Icon: EthereumCircle, name: 'Ethereum', url: 'https://app.sushi.com/miso' },
      { Icon: OptimismCircle, name: 'Optimism', url: '' },
      { Icon: ArbitrumCircle, name: 'Arbitrum', url: 'https://arbitrum.sushi.com/miso' },
      { Icon: FantomCircle, name: 'Fantom', url: 'https://fantom.sushi.com/miso' },
      { Icon: BinanceCircle, name: 'Binance', url: 'https://bsc.sushi.com/miso' },
      { Icon: AvalancheCircle, name: 'Avalanche', url: 'https://avalanche.sushi.com/miso' },
      { Icon: PolygonCircle, name: 'Polygon', url: 'https://polygon.sushi.com/miso' },
    ],
    faq: [
      {
        question: 'Lorem Ipsum',
        answer: (
          <>
            <Typography>
              Trident is a production framework for building and deploying AMMs, but it is not an AMM itself. While AMMs
              can be created using the Trident code, there isn’t a specific AMM at the center of Trident. Instead, there
              is a framework for creating any AMM anyone would ever need.
            </Typography>
            <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
            <ul className="list-disc list-inside">
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Classic pool{' '}
                </Typography>
                <Typography as="span">
                  = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of another.
                  They’re best for pairing tokens that are unpredictable.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Concentrated pool{' '}
                </Typography>
                <Typography as="span">
                  = these pools also use two tokens. The difference is that the liquidity in each pool is determined by
                  the ranges set by the pool creator.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Stable pools{' '}
                </Typography>
                <Typography as="span">
                  = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and USDT,
                  or other pegged tokens like ETH and stETH, or renBTC and WBTC.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Index pools{' '}
                </Typography>
                <Typography as="span">
                  = these pools are usually used to create baskets of assets or decentralized index funds; hence the
                  name. These pools can be made of any percentage of tokens equalling 100.
                </Typography>
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  kashi: {
    color: '#FF5EAF',
    accentColor: '#D84D7F',
    cards: [
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.kashi.accentColor} Icon={TwoCoinsIcon} />,
        title: 'Isolated Lending Pairs',
        subtitle:
          'Anyone can create a pair, it’s up to users which pairs they find safe enough; risk is isolated to just that pair.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.kashi.accentColor} Icon={WavesIcon} />,
        title: 'Flexible',
        subtitle: 'Flexible oracles, both on-chain and off-chain.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.kashi.accentColor} Icon={MoneyHandIcon} />,
        title: 'Liquid Utilization Range',
        subtitle: 'Liquid interest rates based on a specific target utilization range.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.kashi.accentColor} Icon={GasPumpIcon} />,
        title: 'Lowest Gas Fees',
        subtitle: 'Flexible/composable contracts optimized for low gas consumption.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.kashi.accentColor} Icon={ArrowUpIcon} />,
        title: 'Flash Loans',
        subtitle:
          'Built on the BentoBox, so supplied assets can be used for flash loans and strategies, providing extra revenue for liquidity providers.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.kashi.accentColor} Icon={ScreenCheckIcon} />,
        title: 'LP Benefits',
        subtitle: 'Benefits of liquidations go to the liquidity providers, not the liquidators.',
      },
    ],
    faq: [
      {
        question: 'What is Trident and what Pool types does it support?',
        answer: (
          <>
            <Typography>
              Trident is a production framework for building and deploying AMMs, but it is not an AMM itself. While AMMs
              can be created using the Trident code, there isn’t a specific AMM at the center of Trident. Instead, there
              is a framework for creating any AMM anyone would ever need.
            </Typography>
            <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
            <ul className="list-disc list-inside">
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Classic pool{' '}
                </Typography>
                <Typography as="span">
                  = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of another.
                  They’re best for pairing tokens that are unpredictable.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Concentrated pool{' '}
                </Typography>
                <Typography as="span">
                  = these pools also use two tokens. The difference is that the liquidity in each pool is determined by
                  the ranges set by the pool creator.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Stable pools{' '}
                </Typography>
                <Typography as="span">
                  = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and USDT,
                  or other pegged tokens like ETH and stETH, or renBTC and WBTC.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Index pools{' '}
                </Typography>
                <Typography as="span">
                  = these pools are usually used to create baskets of assets or decentralized index funds; hence the
                  name. These pools can be made of any percentage of tokens equalling 100.
                </Typography>
              </li>
            </ul>
          </>
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
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.furo.accentColor} Icon={PuzzlePieceIcon} />,
        title: 'Plug ‘n Play',
        subtitle: 'Furo saves you time from having to do  contract deployments yourself.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.furo.accentColor} Icon={MobileUiIcon} />,
        title: 'Intuitive UI',
        subtitle: 'See the vesting schedules and progress in an easy-to-use dashboard.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.furo.accentColor} Icon={LeftRightArrowIcon} />,
        title: 'Integration Possibilities',
        subtitle: 'Furo minimizes admin by integrating directly into your existing DAO or DeFi tooling.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.furo.accentColor} Icon={NftLinkIcon} />,
        title: 'NFT Composability',
        subtitle:
          'NFT tokenization on Furo allows our users to utilize their future payments in lending and borrowing money market protocols.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.furo.accentColor} Icon={MoneyBagIcon} />,
        title: 'Passive Income',
        subtitle:
          'All Furo subproducts are built upon BentoBox; all capital stored in Furo will be automatically earning yield.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.furo.accentColor} Icon={SushiIcon} />,
        title: 'Sushi Ecosystem',
        subtitle: 'Furo is fully open source and integrated into the Sushi ecosystem and our suite of products.',
      },
    ],
    faq: [
      {
        question: 'What is Trident and what Pool types does it support?',
        answer: (
          <>
            <Typography>
              Trident is a production framework for building and deploying AMMs, but it is not an AMM itself. While AMMs
              can be created using the Trident code, there isn’t a specific AMM at the center of Trident. Instead, there
              is a framework for creating any AMM anyone would ever need.
            </Typography>
            <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
            <ul className="list-disc list-inside">
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Classic pool{' '}
                </Typography>
                <Typography as="span">
                  = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of another.
                  They’re best for pairing tokens that are unpredictable.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Concentrated pool{' '}
                </Typography>
                <Typography as="span">
                  = these pools also use two tokens. The difference is that the liquidity in each pool is determined by
                  the ranges set by the pool creator.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Stable pools{' '}
                </Typography>
                <Typography as="span">
                  = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and USDT,
                  or other pegged tokens like ETH and stETH, or renBTC and WBTC.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Index pools{' '}
                </Typography>
                <Typography as="span">
                  = these pools are usually used to create baskets of assets or decentralized index funds; hence the
                  name. These pools can be made of any percentage of tokens equalling 100.
                </Typography>
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  miso: {
    color: '#87BC06',
    accentColor: '#7F9F30',
    buttonText: 'Launch Miso',
    productStats: [
      { value: '100+', name: 'Projects Launched' },
      { value: '$400+ mln', name: 'Funds Raised' },
    ],
    usps: [
      'From token generation to launch on Sushi, MISO is optimized for every aspect of a trustless UX.',
      'MISO aims to capture the spirit of crypto, a platform where any project can launch and anyone can buy, no strings attached.',
    ],
    cards: [
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.miso.accentColor} Icon={ThreeLinkIcon} />,
        title: 'Wide Exposure',
        subtitle: 'Introduce your tokens to the largest possible crypto native audiences.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.miso.accentColor} Icon={LightBulbIcon} />,
        title: 'Simple and Intuitive',
        subtitle: 'Anyone can launch a token on MISO, no technical knowledge required.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.miso.accentColor} Icon={BarsIcon} />,
        title: 'Rich in Data',
        subtitle: 'The highest level of transparency and data availability to help you make informed decisions.',
      },
      {
        Icon: () => <AcademyIcon color={PRODUCTS_DATA.miso.accentColor} Icon={DashboardIcon} />,
        title: 'Fast to Launch',
        subtitle: 'Quick launches with no interruption.',
      },
    ],
    faq: [
      {
        question: 'What is Trident and what Pool types does it support?',
        answer: (
          <>
            <Typography>
              Trident is a production framework for building and deploying AMMs, but it is not an AMM itself. While AMMs
              can be created using the Trident code, there isn’t a specific AMM at the center of Trident. Instead, there
              is a framework for creating any AMM anyone would ever need.
            </Typography>
            <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
            <ul className="list-disc list-inside">
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Classic pool{' '}
                </Typography>
                <Typography as="span">
                  = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of another.
                  They’re best for pairing tokens that are unpredictable.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Concentrated pool{' '}
                </Typography>
                <Typography as="span">
                  = these pools also use two tokens. The difference is that the liquidity in each pool is determined by
                  the ranges set by the pool creator.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Stable pools{' '}
                </Typography>
                <Typography as="span">
                  = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and USDT,
                  or other pegged tokens like ETH and stETH, or renBTC and WBTC.
                </Typography>
              </li>
              <li>
                <Typography weight={700} className="text-white" as="span">
                  Index pools{' '}
                </Typography>
                <Typography as="span">
                  = these pools are usually used to create baskets of assets or decentralized index funds; hence the
                  name. These pools can be made of any percentage of tokens equalling 100.
                </Typography>
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
}
