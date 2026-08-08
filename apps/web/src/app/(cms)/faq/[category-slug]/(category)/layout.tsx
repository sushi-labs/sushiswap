import { getFaqCategory } from '@sushiswap/graph-client/strapi'
import { Breadcrumb, Container, typographyVariants } from '@sushiswap/ui'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'
import type React from 'react'
import { CategoryLayout } from './components/category-layout'

async function getCachedFaqCategory(slug: string) {
  'use cache'
  cacheLife({ revalidate: 900 })

  return getFaqCategory({ slug })
}

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ 'category-slug': string }>
}) {
  const params = await props.params

  const { children } = props

  let category

  try {
    category = await getCachedFaqCategory(params['category-slug'])
  } catch {
    return notFound()
  }

  return (
    <div className="h-full flex flex-col animate-slide">
      <div className="dark:bg-[#19202F] bg-[#414a6c05]">
        <Container maxWidth="4xl" className="px-5 md:px-8 pb-14 space-y-6">
          <Breadcrumb replace={{ '-': ' ' }} truncate={false} />
          <h1 className={typographyVariants({ variant: 'h1' })}>
            {category.name}
          </h1>
        </Container>
      </div>
      <div className="h-[0.5px] bg-accent w-full" />
      <CategoryLayout>{children}</CategoryLayout>
    </div>
  )
}
