import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  List,
} from '@sushiswap/ui'
import { getDeleteAccountChecklist } from './delete-account-checks'
import { DeleteAccountModal } from './delete-account-modal'

export async function DeleteAccountCard() {
  const checklist = await getDeleteAccountChecklist()

  return (
    <Card className="h-min">
      <CardHeader className="rounded-t-xl">
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent className="rounded-b-xl">
        <div className="space-y-6 flex flex-col">
          <List>
            <List.Control>
              <List.KeyValue
                flex
                title="Not a member of a team"
                className="whitespace-nowrap"
              >
                <Checkbox
                  checked={checklist.checks?.teamMembership}
                  className="cursor-default"
                />
              </List.KeyValue>
            </List.Control>
          </List>
          <DeleteAccountModal>
            <Button
              variant="destructive"
              fullWidth
              disabled={!checklist.canDelete}
            >
              Delete
            </Button>
          </DeleteAccountModal>
        </div>
      </CardContent>
    </Card>
  )
}
