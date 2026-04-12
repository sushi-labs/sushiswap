import { InvitePage } from './_ui/invite-page'

export default async function PerpsInvitePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  return <InvitePage code={code} />
}
