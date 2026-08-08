import { getFaqAnswer } from '@sushiswap/graph-client/strapi'
import { notFound } from 'next/navigation'
import { getGhostBody } from 'src/app/(cms)/lib/ghost/ghost'

export default async function AnswerPage(props: {
  params: Promise<{ 'answer-slug': string }>
}) {
  const params = await props.params
  let answer
  let body

  try {
    answer = await getFaqAnswer({ slug: params['answer-slug'] })

    const { html } = await getGhostBody(answer.ghostSlug)
    body = html
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
