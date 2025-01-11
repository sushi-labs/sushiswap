import { LinkIcon } from '@heroicons/react/24/outline'
import { getAcademyArticles, getProducts } from '@sushiswap/graph-client/strapi'
import { Container, classNames } from '@sushiswap/ui'
import Image from 'next/legacy/image'
import { DEFAULT_SIDE_PADDING } from 'src/app/(cms)/constants'
import { ProductArticles } from '../components/product-articles'
import { ProductBackground } from '../components/product-background'
import { ProductCards } from '../components/product-cards'
import { ProductFaq } from '../components/product-faq'
import { ProductHero } from '../components/product-hero'
import { ProductInfoImages } from '../components/product-info-images'
import { ProductTechnicalDoc } from '../components/product-technical-doc'
import { buttonText, cards, color, productStats, slug } from './furo-data'
import furoImg from './furo-img.png'

export default async function Page() {
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
    <>
      {/* <ProductSeo product={product} /> */}
      <Container
        maxWidth="6xl"
        className={classNames('mx-auto pt-10', DEFAULT_SIDE_PADDING)}
      >
        <ProductBackground color={color} />
        <ProductHero
          productName={longName}
          productDescription={description}
          productUrl={url}
          buttonText={buttonText}
          buttonIcon={LinkIcon}
          image={<Image src={furoImg} unoptimized alt="furo-img" />}
          productStats={productStats}
        />
      </Container>

      <Container
        maxWidth="6xl"
        className={classNames('mx-auto pb-24', DEFAULT_SIDE_PADDING)}
      >
        <ProductInfoImages
          color="#64C7FE"
          secondaryColor="#B084E9"
          infoSections={[
            {
              title: 'Payments & Salaries',
              description:
                'Automate your DAO salaries securely with Furo. Furo lets you set up payment and salary streams for all your contributors.',
            },
            {
              title: 'Token Vesting',
              description:
                'Traditionally, DAOs have to recreate and redeploy their own vesting contracts. With Furo we aim to free projects and DAOs from this heavy lifting.',
            },
            {
              title: 'Multichain',
              description:
                'Furo is multichain, like all Sushi products, catering to users across all EVM compatible chains like Ethereum, Arbitrum, Polygon and Avalanche.',
            },
          ]}
        />

        <ProductCards
          name={name}
          description="Furo allows projects to rid themselves of the cumbersome payroll related admin process, allowing you to work on your product and what truly matters."
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
          title={`Learn about ${name}`}
          subtitle="Check out our tutorials and explainers"
          articles={relevantArticles}
          productName={slug}
        />
        <ProductTechnicalDoc
          color={color}
          secondaryColor="#FEC464"
          url="https://docs.sushi.com/docs/Developers/Furo/Overview"
        />
        <ProductFaq faqSlug={slug} />
      </Container>
    </>
  )
}
