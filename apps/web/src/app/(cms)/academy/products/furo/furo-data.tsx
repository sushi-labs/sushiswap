import {
  AcademyIcon,
  LeftRightArrowIcon,
  MobileUiIcon,
  MoneyBagIcon,
  NftLinkIcon,
  PuzzlePieceIcon,
  SushiIcon,
} from '../../../components/icons'

const color = '#EB72FF'
const accentColor = '#B341C6'
const buttonText = 'Launch Furo'

const productStats = [
  { value: '$100+ mln', name: 'Total Value Locked' },
  { value: '500+', name: 'Streams/Vests Live' },
  { value: '11', name: 'Chain Deployments' },
]

const cards = [
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={PuzzlePieceIcon} />,
    title: 'Plug ‘n Play',
    subtitle:
      'Furo saves you time from having to do  contract deployments yourself.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MobileUiIcon} />,
    title: 'Intuitive UI',
    subtitle:
      'See the vesting schedules and progress in an easy-to-use dashboard.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={LeftRightArrowIcon} />,
    title: 'Integration Possibilities',
    subtitle:
      'Furo minimizes admin by integrating directly into your existing DAO or DeFi tooling.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={NftLinkIcon} />,
    title: 'NFT Composability',
    subtitle:
      'NFT tokenization on Furo allows our users to utilize their future payments in lending and borrowing money market protocols.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyBagIcon} />,
    title: 'Passive Income',
    subtitle:
      'All Furo subproducts are built upon BentoBox; all capital stored in Furo will be automatically earning yield.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={SushiIcon} />,
    title: 'Sushi Ecosystem',
    subtitle:
      'Furo is fully open source and integrated into the Sushi ecosystem and our suite of products.',
  },
]

const faq = [
  {
    question: 'What is Furo?',
    answer: (
      <div className="space-y-4">
        <p>
          Furo is a payment streaming platform that anyone can use to make
          automated payments to other wallets - whether they be for individuals,
          DAOs, or any other type of entity. While it my seem very similar to
          apps like Sablier or Llamapay, there are additional features which
          make Furo particularly appealing. One of these strengths would be the
          utilization of the BentoBox architecture.
        </p>
        <p>
          Other apps require funds to be locked in contract. With Furo, tokens
          sit inside of the BentoBox giving potential for them to also
          simultaneously be utilized by strategies to accrue yield. This
          provides a pleasant way to have your value grow before you even
          receive it! Streams and vesting that are sent via Furo are also
          represented by an NFT minted to the receiving wallet. The owner can
          even send that NFT to another wallet to transfer ownership of the
          stream.
        </p>
      </div>
    ),
  },
]

const slug = 'furo'

export { color, buttonText, productStats, cards, faq, slug }
