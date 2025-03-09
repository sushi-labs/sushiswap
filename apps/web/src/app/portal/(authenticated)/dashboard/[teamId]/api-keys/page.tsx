import { Button, typographyVariants } from '@sushiswap/ui'
import { CreateApiKeyDialog } from './_common/ui/create-api-key-dialog'
import { TeamApiKeyCard } from './_common/ui/team-api-key-card'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className={typographyVariants({ variant: 'h2' })}>API Keys</span>
        <CreateApiKeyDialog teamId={teamId}>
          <Button>New Key</Button>
        </CreateApiKeyDialog>
      </div>
      <TeamApiKeyCard teamId={teamId} />
    </div>
  )
}
