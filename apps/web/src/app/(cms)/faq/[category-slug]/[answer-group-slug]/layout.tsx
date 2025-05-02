import { getFaqAnswerGroup } from '@sushiswap/graph-client/strapi'
import { Breadcrumb, Container, typographyVariants } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import type React from 'react'
import { AnswerGroupLayout } from './components/answer-group-layout'

export const revalidate = 900

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ 'answer-group-slug': string }>
}) {
  const params = await props.params

  const { children } = props

  let answerGroup

  try {
    answerGroup = await getFaqAnswerGroup({
      slug: params['answer-group-slug'],
    })
  } catch {
    return notFound()
  }

  return (
    <div className="animate-slide">
      <div className="dark:bg-[#19202F] w-full pl-[calc(100vw-100%)]">
        <Container maxWidth="4xl" className="px-5 md:px-8 space-y-6 pb-14">
          <Breadcrumb replace={{ '-': ' ' }} truncate={false} />
          <h1 className={typographyVariants({ variant: 'h1' })}>
            {answerGroup.name}
          </h1>
        </Container>
      </div>
      <div className="h-[0.5px] bg-accent w-full" />
      <AnswerGroupLayout params={params}>{children}</AnswerGroupLayout>
    </div>
  )
}
