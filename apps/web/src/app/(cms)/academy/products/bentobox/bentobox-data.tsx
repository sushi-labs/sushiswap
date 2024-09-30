import {
  AcademyIcon,
  MoneyBagIcon,
  MoneyHandIcon,
  MoneyTreeIcon,
  PuzzlePieceIcon,
  ScreenCheckIcon,
  TilesIcon,
} from '../../../components/icons'

const color = '#FF5EAF'
const accentColor = '#A048DA'
const buttonText = 'Enter Farms'

const cards = [
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={TilesIcon} />,
    title: 'Utilize funds in multiple DeFi apps',
    subtitle:
      'BentoBox’s innovation is its ability to track users’ deposits via an artificial balance, which is used to account for their idle funds while they’re simultaneously applied to strategies.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyTreeIcon} />,
    title: 'Earn some of the highest yield in DeFi',
    subtitle:
      'As the foundation for multiple DeFi apps, BentoBox can attract more capital than simple vaults, leading to higher yield than most vaults',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyHandIcon} />,
    title: 'Flash Loans',
    subtitle:
      'Funds in BentoBox can be used for flash loans, adding more passive value to users’ underutilized capital.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={PuzzlePieceIcon} />,
    title: 'Plug ’n play interest pools for your DeFi app',
    subtitle:
      'Build your own DeFi apps on top of BentoBox to instantly utilize over 500m+ TVL.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyBagIcon} />,
    title: 'Capital Efficiency',
    subtitle:
      'Profit from efficiencies of a growing protocol by saving on gas fees on each dApp deployed on BentoBox.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={ScreenCheckIcon} />,
    title: 'Smooth UX',
    subtitle:
      'Approvals are inherited by the system, making individual transactions within BentoBox cheaper.',
  },
]

const faq = [
  {
    question: 'What is a Flash Loan?',
    answer: (
      <div className="space-y-4">
        <p>
          Flash loans are loans that can be taken by anyone without having to
          put out any collateral. It is possible to make such a transaction
          because everything is repaid in the same block.
        </p>
        <p>
          The entire process is executed by a smart contract. If the smart
          contract detects that the loan will not be fully repaid in the same
          block, the transaction will be rejected.
        </p>
        <p>
          Platforms that allow the usage of flash loans usually charge a fee -
          for BentoBox it is 0.05%.
        </p>
        <p>
          Flash loans are particularly useful for arbitrage and liquidations. It
          is very capital efficient as bots and users do not need to have high
          amount of idle funds in their wallets to execute the trade.
        </p>
      </div>
    ),
  },
]

const slug = 'bentobox'

export { color, buttonText, cards, faq, slug }
