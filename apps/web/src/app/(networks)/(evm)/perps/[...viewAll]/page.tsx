import { notFound } from 'next/navigation'
import { getViewAllRoute } from './view-all-hrefs'
import { ViewAllPage } from './view-all-page'

export default async function PerpsViewAllPage({
  params,
}: {
  params: Promise<{ viewAll: string[] }>
}) {
  const route = getViewAllRoute((await params).viewAll)

  if (!route) {
    return notFound()
  }

  return <ViewAllPage address={route.address} href={route.href} />
}
