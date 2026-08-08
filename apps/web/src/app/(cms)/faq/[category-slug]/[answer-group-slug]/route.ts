import { getFaqAnswerGroup } from '@sushiswap/graph-client/strapi'
import { cacheLife } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

async function getCachedFaqAnswerGroup(slug: string) {
  'use cache'
  cacheLife({ revalidate: 3600 })

  return getFaqAnswerGroup({ slug })
}

export async function GET(request: NextRequest) {
  const pathname = new URL(request.url).pathname
  const answerGroupId = pathname.split('/').slice(-1)[0]
  const answerGroup = await getCachedFaqAnswerGroup(answerGroupId)

  if (!answerGroup) {
    return redirect(pathname.split('/').slice(0, -1).join('/'))
  }

  const slug = answerGroup.defaultAnswer?.slug || answerGroup.answers?.[0].slug

  if (!slug) {
    return notFound()
  }

  redirect(`${pathname}/${slug}`)
}
