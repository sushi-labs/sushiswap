import { getFaqAnswer } from '@sushiswap/graph-client/strapi'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'
import { getGhostBody } from 'src/app/(cms)/lib/ghost/ghost'

async function getCachedAnswer(slug: string) {
  'use cache'
  cacheLife({ revalidate: 3600 })

  const answer = await getFaqAnswer({ slug })
  const { html } = await getGhostBody(answer.ghostSlug)

  return html
}

export default async function AnswerPage(props: {
  params: Promise<{ 'answer-slug': string }>
}) {
  const params = await props.params
  let body

  try {
    body = await getCachedAnswer(params['answer-slug'])
  } catch {
    return notFound()
  }

  return (
    <div
      className="prose dark:!prose-invert"
      dangerouslySetInnerHTML={{
        __html: body || '',
      }}
    />
  )
}
