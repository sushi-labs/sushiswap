import { Container } from '@sushiswap/ui'
import { FC } from 'react'

import {
  ArticleAuthors,
  ArticleFooter,
  ArticleHeader,
  ArticleLinks,
  Breadcrumb,
  MediaBlock,
  RichTextBlock,
  Seo,
} from '../components'
import { fetchAPI } from '../lib/api'
import { Article, Article as ArticleType, Category, Meta } from '../types'

export async function getStaticPaths() {
  const articlesRes = await fetchAPI('/articles', { fields: ['slug'] })

  return {
    paths: articlesRes.data.map((article: Article) => ({
      params: {
        slug: article.attributes.slug,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const [articlesRes, latestArticlesRes] = await Promise.all([
    fetchAPI('/articles', {
      filters: {
        slug: params.slug,
      },
      populate: 'deep',
    }),
    fetchAPI('/articles', {
      sort: ['publishedAt'],
      pagination: {
        limit: 3,
      },
    }),
  ])

  const filteredLatest = latestArticlesRes.data.filter(
    (el: Article) => el.attributes.title !== articlesRes.data[0].attributes.title
  )

  if (filteredLatest.length > 2) filteredLatest.pop()

  return {
    props: { article: articlesRes.data[0], latestArticles: filteredLatest },
    revalidate: 1,
  }
}

interface ArticlePage {
  article: ArticleType
  latestArticles: ArticleType[]
  categories: {
    data: Category[]
    meta: Meta
  }
}

const Article: FC<ArticlePage> = ({ article, latestArticles }) => {
  const seo = {
    id: article.id,
    metaTitle: article.attributes.title,
    metaDescription: article.attributes.description,
    shareImage: article.attributes.cover,
    article: true,
  }

  return (
    <>
      <Seo seo={seo} />
      <Breadcrumb />
      <Container maxWidth="2xl" className="mx-auto px-4 my-16">
        <main>
          <article className="relative pt-10">
            <ArticleHeader article={article} />
            <ArticleAuthors article={article} />
            <div className="mt-12 prose dark:prose-invert prose-slate">
              {article.attributes.blocks.map((block, i) => {
                if (block.__component === 'shared.rich-text') {
                  return <RichTextBlock block={block} key={i} />
                }

                if (block.__component === 'shared.media') {
                  return <MediaBlock block={block} key={i} />
                }

                if (block.__component === 'shared.divider') {
                  return <hr className="border border-slate-200/5 my-12" />
                }
              })}
            </div>
            <ArticleLinks article={article} />
            <ArticleFooter articles={latestArticles} />
          </article>
        </main>
      </Container>
    </>
  )
}

export default Article
