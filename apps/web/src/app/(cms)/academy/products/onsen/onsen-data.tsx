import {
  AcademyIcon,
  CircleArrowsIcon,
  LinkIcon,
  MoneyBagIcon,
  MoneyWavesIcon,
  ShieldIcon,
  SmileyIcon,
} from '../../../components/icons'

const color = '#75B5F0'
const accentColor = '#187BD8'
const buttonText = 'Enter Farms'

const productStats = [
  { value: '$500+ mln', name: 'Total Value Locked' },
  { value: '500+', name: 'Projects Onboarded' },
  { value: '500+', name: 'Token Pairs' },
]

const cards = [
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyBagIcon} />,
    title: 'Earn some of the highest yields in DeFi',
    subtitle: 'Earn some of the highest yields on new, exciting projects.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyWavesIcon} />,
    title: 'Deep Liquidity',
    subtitle:
      'Provides incentives to pool tokens into BentoBox, providing deeper liquidity for trades on Trident AMMs and Kashi lending markets.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={LinkIcon} />,
    title: 'Multichain Deployment',
    subtitle:
      'Deployed across 20+ chains, never miss another opportunity to farm on a new chain again.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={CircleArrowsIcon} />,
    title: 'Attract Liquidity & Attention',
    subtitle:
      'Get incentives from Sushi to match with your own, attracting liquidity and attention to your project.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={SmileyIcon} />,
    title: 'Earn Yield & Boost Efficiency',
    subtitle:
      'Earn yield on treasury tokens, ease the burden of impermanent loss and decrease the price impact/slippage of individual trades, improving cost efficiency.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={ShieldIcon} />,
    title: 'Security Audited',
    subtitle: 'Safe, fully audited for security and peace of mind.',
  },
]

const faq = [
  {
    question: 'What is triple yield? (BentoBox + Kashi + Onsen)',
    answer: (
      <div className="space-y-4">
        <p>
          Triple yield means accumulating three forms of yield on your funds.
          This is made possible when you lend out your funds via Kashi.
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
            Stake the KMP tokens you receive in Kashi farms to earn extra $SUSHI
            rewards.
          </li>
        </ol>
        <p>With Trident it will be possible to do the same with your SLPs</p>
        <ol className="pl-4 list-decimal">
          <li>Add liquidity on Trident and earn fees from all swaps.</li>
          <li>
            Idle assets automatically earn a small yield from BentoBox
            strategies.
          </li>
          <li>
            Stake the SLP tokens you receive in Sushiswap farms to earn extra
            $SUSHI rewards.
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
          A 2x reward farm allows a user to earn $SUSHI & an addition token as a
          reward when their SLP tokens are staked in it. These are extra rewards
          added on top of the trading fees earned from providing liquidity.
        </p>
        <p>
          These farm contracts are named Masterchefv2 (or Minichefv2 on L2 &
          sidechains).
        </p>
        <p>
          This allows other projects that are listed on Sushiswap to incentivize
          their token holders to provide liquidity for that specific token.
        </p>
      </div>
    ),
  },
  {
    question:
      'What is the difference between MasterChef, MasterChefv2 and MiniChef?',

    answer: (
      <div className="space-y-4">
        <p>There are three different types of implementations for Masterchef</p>
        <ul className="pl-4 list-disc">
          <li>
            MasterChefv1: The main contract on the Ethereum network that rewards
            $SUSHI to users for staking their LP and/or KMP tokens.
          </li>
          <li>
            MasterChefv2: Secondary contract on the Ethereum network. It is
            built on top of MasterChefv1 and gives 2 different type of tokens as
            a reward. e.g Users will receive SUSHI & another token as their
            staking reward.
          </li>
          <li>
            MiniChef: This contract is mainly deployed on various EVM compatible
            chains (AVAX, FTM, CELO etc.). It is similar to MasterChefv2, in
            which it also gives 2 different type of tokens as a reward.
          </li>
        </ul>
      </div>
    ),
  },
]

const slug = 'onsen'

export { color, buttonText, productStats, cards, faq, slug }
