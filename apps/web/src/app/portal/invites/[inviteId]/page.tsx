import { ResponseError } from '@sushiswap/styro-client'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  List,
} from '@sushiswap/ui'
import Link from 'next/link'
import { getSessionData } from '../../_common/lib/client-config'
import { parseStyroError } from '../../_common/lib/styro/parse-error'
import { getUnauthenticatedStyroClient } from '../../_common/lib/styro/styro-client'
import { AcceptInviteButton } from './_common/ui/accept-invite-button'

export default async function Page({
  params,
}: { params: Promise<{ inviteId: string }> }) {
  const inviteId = (await params).inviteId

  const session = await getSessionData()
  const anonymousClient = await getUnauthenticatedStyroClient()

  const inviteResponse = await anonymousClient
    .getInvitesInviteId({ inviteId })
    .catch(async (e) => {
      if (e instanceof ResponseError) {
        throw new Error(await parseStyroError(e))
      }
      throw e
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>You have been invited</CardTitle>
      </CardHeader>
      <CardContent>
        <List>
          <List.Control>
            <List.KeyValue title="Team Name">
              {inviteResponse.data.invite.team.name}
            </List.KeyValue>
            <List.KeyValue title="Your email">
              {session.isLoggedIn ? session.user.email.email : 'Not logged in'}
            </List.KeyValue>
          </List.Control>
        </List>
      </CardContent>
      <CardFooter>
        {session.isLoggedIn ? (
          <AcceptInviteButton inviteId={inviteId} />
        ) : (
          <Link href="/portal" prefetch className="w-full">
            <Button fullWidth>Sign In</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
