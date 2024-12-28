import { Container, Separator } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import React from 'react'
import { getGhostBody } from 'src/app/(cms)/lib/ghost/ghost'
import { legalPages } from '../_config'

export const revalidate = 86400

export const dynamicParams = false

export async function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug: slug }))
}

type Props = {
  params: Promise<{ slug: keyof typeof legalPages }>
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const page = legalPages[params.slug]

  return {
    title: page.title,
  }
}

export default async function Page(props: Props) {
  const params = await props.params
  const page = legalPages[params.slug]

  const {
    title,
    html: body,
    updated_at,
  } = await unstable_cache(
    (slug: string) => getGhostBody(slug),
    [params.slug],
    { revalidate: 86400 },
  )(params.slug)

  if (!title) {
    throw new Error(`${page.title}: title missing`)
  }

  if (!updated_at) {
    throw new Error(`${page.title}: updated_at missing`)
  }

  const lastModified = new Date(updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Container className="px-6 mt-20 pb-40 space-y-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="text-sm text-neutral-800 dark:text-neutral-400">
          Last modified: {lastModified}
        </p>
      </div>
      <Separator />
      <div
        className="prose dark:prose-invert prose-slate text-justify"
        dangerouslySetInnerHTML={{
          __html: body,
        }}
      />
    </Container>
  )
}
