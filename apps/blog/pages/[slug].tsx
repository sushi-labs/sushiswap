import { Container } from '@sushiswap/ui'
import { FC } from 'react'

import { ArticleAuthors, ArticleHeader, MediaBlock, RichTextBlock, Seo } from '../components'
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
  const articlesRes = await fetchAPI('/articles', {
    filters: {
      slug: params.slug,
    },
    populate: 'deep',
  })
  const categoriesRes = await fetchAPI('/categories')

  return {
    props: { article: articlesRes.data[0], categories: categoriesRes },
    revalidate: 1,
  }
}

interface ArticlePage {
  article: ArticleType
  categories: {
    data: Category[]
    meta: Meta
  }
}

const Article: FC<ArticlePage> = ({ article, categories }) => {
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
      <Container maxWidth="3xl" className="mx-auto px-4 my-16">
        <main>
          <article className="relative pt-10">
            <ArticleHeader article={article} />
            <ArticleAuthors article={article} />
            <div className="mt-12"></div>
            {article.attributes.blocks.map((block) => {
              if (block.__component === 'shared.rich-text') {
                return <RichTextBlock block={block} />
              }

              if (block.__component === 'shared.media') {
                return <MediaBlock block={block} />
              }
            })}
          </article>
        </main>
      </Container>
    </>
  )
}

export default Article
