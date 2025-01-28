'use client'

import { ClipboardDocumentIcon } from '@heroicons/react/24/solid'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ClipboardController,
  List,
} from '@sushiswap/ui'
import { useSession } from 'src/app/portal/_common/ui/auth-provider/auth-provider'

export function UserCard() {
  const session = useSession()

  if (!session.isLoggedIn) {
    return null
  }

  return (
    <Card className="w-full min-w-[470px]">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>User Details</CardTitle>
        <CardDescription>Useful when requesting support</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <List>
          <List.Control>
            <List.KeyValue flex title="ID">
              <span>{session.user.id}</span>
              <ClipboardController>
                {({ setCopied }) => (
                  <ClipboardDocumentIcon
                    width={20}
                    height={20}
                    className="ml-1 cursor-pointer"
                    onClick={() => setCopied(session.user.id)}
                  />
                )}
              </ClipboardController>
            </List.KeyValue>
          </List.Control>
        </List>
      </CardContent>
    </Card>
  )
}
