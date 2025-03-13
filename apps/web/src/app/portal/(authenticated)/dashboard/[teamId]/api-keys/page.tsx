import { Button, typographyVariants } from '@sushiswap/ui'
import { CheckerRoleServer } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-server'
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
        <CheckerRoleServer
          teamId={teamId}
          message="Only admins and owners can create a new API key"
          requiredRole="admin"
        >
          {(disabled) => (
            <CreateApiKeyDialog teamId={teamId}>
              <Button disabled={disabled}>New Key</Button>
            </CreateApiKeyDialog>
          )}
        </CheckerRoleServer>
      </div>
      <TeamApiKeyCard teamId={teamId} />
    </div>
  )
}
