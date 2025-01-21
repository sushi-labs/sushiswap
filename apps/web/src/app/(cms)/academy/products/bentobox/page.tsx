import { LinkIcon } from '@heroicons/react/24/outline'
import { getAcademyArticles, getProducts } from '@sushiswap/graph-client/strapi'
import { Container, classNames } from '@sushiswap/ui'
import { DEFAULT_SIDE_PADDING } from 'src/app/(cms)/constants'
import { ProductArticles } from '../components/product-articles'
import { ProductBackground } from '../components/product-background'
import { ProductCards } from '../components/product-cards'
import { ProductFaq } from '../components/product-faq'
import { ProductHero } from '../components/product-hero'
import { ProductTechnicalDoc } from '../components/product-technical-doc'
import { buttonText, cards, color, slug } from './bentobox-data'

export default async function ProductPage() {
  const [products, { articles: latestArticles }] = await Promise.all([
    getProducts({ filters: { slug: { eq: slug } } }),
    getAcademyArticles({
      pagination: { limit: 3 },
    }),
  ])

  const product = products[0]
  if (!product) throw new Error('Product not found')
  const { name, longName, url, description, relevantArticleIds } = product

  const { articles: relevantArticles } = await getAcademyArticles({
    filters: { id: { in: relevantArticleIds as string[] } },
  })

  return (
    <Container
      maxWidth="6xl"
      className={classNames('mx-auto pb-24', DEFAULT_SIDE_PADDING)}
    >
      <ProductBackground color={color} isCentered />
      <ProductHero
        productName={longName}
        productDescription={description}
        productUrl={url}
        buttonText={buttonText}
        buttonIcon={LinkIcon}
      />
      <ProductCards
        name={name}
        description="BentoBox is a unique token vault that generates yield (interest) on your tokens, while also allowing you to utilize them in DeFi protocols like lending markets or liquidity pools."
        cards={cards}
        gradientBorderColor={color}
      />
      <ProductArticles
        title="Articles"
        subtitle="Read more about the latest releases"
        articles={latestArticles}
        productName={slug}
      />
      <ProductArticles
        title="Learn about BentoBox"
        subtitle="Check out our tutorials and explainers"
        articles={relevantArticles}
        productName={slug}
      />
      <ProductTechnicalDoc
        color={color}
        secondaryColor="#FFBCFE"
        url="https://docs.sushi.com/docs/Developers/Bentobox/Overview"
      />
      <ProductFaq faqSlug={slug} />
    </Container>
  )
}
