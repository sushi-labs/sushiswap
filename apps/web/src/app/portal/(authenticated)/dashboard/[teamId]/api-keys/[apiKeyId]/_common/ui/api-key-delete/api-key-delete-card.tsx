import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { CheckerRoleServer } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-server'
import { ApiKeyDeleteDialog } from './api-key-delete-dialog'

interface ApiKeyDeleteCard {
  teamId: string
  apiKeyId: string
}

export async function ApiKeyDeleteCard({ teamId, apiKeyId }: ApiKeyDeleteCard) {
  return (
    <Card className="w-full min-w-[470px]">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Delete API Key</CardTitle>
        <CardDescription>Permanently delete the key</CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <CheckerRoleServer
          teamId={teamId}
          requiredRole="admin"
          message="You must be the owner or admin of the team to delete api keys"
        >
          {(disabled) => (
            <ApiKeyDeleteDialog teamId={teamId} apiKeyId={apiKeyId}>
              <Button variant="destructive" fullWidth disabled={disabled}>
                Delete
              </Button>
            </ApiKeyDeleteDialog>
          )}
        </CheckerRoleServer>
      </CardContent>
    </Card>
  )
}
