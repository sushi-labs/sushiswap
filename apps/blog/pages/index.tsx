import { Container } from '@sushiswap/ui'
import { InferGetServerSidePropsType } from 'next'
import { FC } from 'react'

import { ArticleList, Categories, Hero } from '../components'
import Seo from '../components/Seo'
import { fetchAPI } from '../lib/api'

export async function getStaticProps() {
  const [articlesRes, categoriesRes] = await Promise.all([
    fetchAPI('/articles', { populate: ['cover', 'category'] }),
    fetchAPI('/categories', { populate: '*' }),
  ])

  return {
    props: {
      articles: articlesRes.data,
      categories: categoriesRes.data,
    },
    revalidate: 1,
  }
}

const Home: FC<InferGetServerSidePropsType<typeof getStaticProps>> = ({ articles, categories }) => {
  return (
    <>
      <Seo />
      <div className="flex flex-col divide-y divide-slate-800">
        <Hero article={articles[0]} />
        <section className="py-10 pb-60">
          <Container maxWidth="5xl" className="mx-auto px-4 space-y-10">
            <div className="flex gap-2">
              <Categories categories={categories} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <ArticleList articles={articles.slice(1)} />
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default Home
