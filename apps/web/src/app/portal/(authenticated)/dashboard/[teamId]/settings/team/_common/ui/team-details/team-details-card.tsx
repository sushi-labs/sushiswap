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

interface TeamDetailsCard {
  teamId: string
}

export function TeamDetailsCard({ teamId }: TeamDetailsCard) {
  return (
    <Card className="w-full min-w-[470px] h-min">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Team Details</CardTitle>
        <CardDescription>Useful when requesting support</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <List>
          <List.Control>
            <List.KeyValue flex title="ID">
              <span>{teamId}</span>
              <ClipboardController>
                {({ setCopied }) => (
                  <ClipboardDocumentIcon
                    width={20}
                    height={20}
                    className="ml-1 cursor-pointer"
                    onClick={() => setCopied(teamId)}
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
