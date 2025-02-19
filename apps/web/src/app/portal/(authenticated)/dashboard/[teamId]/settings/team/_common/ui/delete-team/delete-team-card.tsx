import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { DeleteTeamModal } from './delete-team-modal'
// import { DeleteAccountModal } from './delete-account-modal'

interface DeleteTeamCard {
  teamId: string
}

export async function DeleteTeamCard({ teamId }: DeleteTeamCard) {
  // Permission-based
  const canDelete = true

  return (
    <Card className="w-full min-w-[470px]">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Delete Team</CardTitle>
        <CardDescription>Permanently delete the team</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <DeleteTeamModal teamId={teamId}>
          <Button variant="destructive" fullWidth disabled={!canDelete}>
            Delete
          </Button>
        </DeleteTeamModal>
      </CardContent>
    </Card>
  )
}
