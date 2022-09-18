import { LinkIcon } from '@heroicons/react/24/outline'
import { Button, Container, Typography } from '@sushiswap/ui'
import { ProductCard } from 'common/components/ProductCard'
import { StatisticsReportIcon } from 'common/icons'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { defaultSidePadding } from 'pages'

enum Product {
  BentoBox = 'bentobox',
}

const productsInfo = {
  [Product.BentoBox]: {
    title: 'BentoBox',
    subtitle: 'The interest-bearing DeFi base layer',
    description:
      'BentoBox is unique token vault that generates yield (interest) on your tokens, while also allowing you to utilize them in DeFi protocols like lending markets ir liquidity pools.',
    cards: [
      {
        img: StatisticsReportIcon,
        title: 'Utilize funds in multiple DeFi apps',
        subtitle:
          'Bento’s innovation is its ability to track the user’s deposits via artificial balance, which is used to account for their idle funds...',
      },
      {
        img: StatisticsReportIcon,
        title: 'Earn some of the highest yield in DeFi',
        subtitle: 'Being the foundation for multiple DeFi apps, Bentobox can attract more capital than simple vaults.',
      },
      {
        img: StatisticsReportIcon,
        title: 'Flashloans',
        subtitle:
          'The funds in Bento can also be used in flash loans, which can add more passive value to the user’s underutilized capital.',
      },
      {
        img: StatisticsReportIcon,
        title: 'Plug’n’play interest pools for your DeFi app',
        subtitle: 'Build your own DeFi apps on top of Bento, to instantly utilize the 500m+ TVL',
      },
      {
        img: StatisticsReportIcon,
        title: 'Capital efficiency',
        subtitle:
          'Profit from efficiencies of a growing protocol, by saving on gas fees on each dApp deployed on Bento.',
      },
      {
        img: StatisticsReportIcon,
        title: 'Smooth UX',
        subtitle: 'Approvals are inherited by the system, making individual transactions within Bento cheaper.',
      },
    ],
  },
}

const ProductPage = () => {
  const router = useRouter()
  const { product } = router.query as { product: Product }
  const productInfo = productsInfo[product]
  if (!productInfo) return <ErrorPage statusCode={404} title="Product could not be found" />
  const { title, subtitle, description, cards } = productInfo
  return (
    <Container maxWidth="6xl" className={defaultSidePadding}>
      <div className="flex flex-col items-center mt-10">
        <Typography variant="hero" weight={700}>
          {title}
        </Typography>
        <Typography variant="h3" weight={500} className="text-gray-500">
          {subtitle}
        </Typography>
        <Button
          color="pink"
          size="lg"
          className="mt-16 rounded-full"
          startIcon={<LinkIcon width={20} height={20} stroke="black" />}
        >
          <Typography weight={700} className="text-black">
            Linking to farm
          </Typography>
        </Button>
      </div>

      <div className="flex flex-col items-center mt-40">
        <Typography variant="h1" weight={700}>
          What is {title}?
        </Typography>
        <Typography className="mt-6 text-center text-gray-500" variant="lg">
          {description}
        </Typography>
      </div>

      <div className="mt-[90px] grid grid-cols-3 gap-x-6 gap-y-8">
        {cards.map((card, i) => (
          <ProductCard
            key={i}
            title={card.title}
            subtitle={card.subtitle}
            img={<card.img />}
            gradientBorderColor={!i && '#FF5EAF'}
          />
        ))}
      </div>
    </Container>
  )
}

export default ProductPage
