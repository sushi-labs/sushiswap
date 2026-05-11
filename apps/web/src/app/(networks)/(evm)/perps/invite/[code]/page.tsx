import { InvitePage } from './_ui/invite-page'

export default async function PerpsInvitePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  return (
    <main className="bg-perps-background min-h-[calc(100vh-56px)]">
      <InvitePage code={code} />
    </main>
  )
}
