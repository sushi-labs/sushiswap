import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import {
  getLoggedInSessionData,
  getSessionData,
} from 'src/app/portal/_common/lib/client-config'
import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'
import {
  OAuthButton,
  OAuthId,
  OAuthProvider,
} from 'src/app/portal/_common/ui/oauth/oauth-button'

interface IdentityProvidersCard {
  teamId: string
}

export async function IdentityProvidersCard({ teamId }: IdentityProvidersCard) {
  const session = await getLoggedInSessionData()

  const idpLinks = await getUserServiceClient()
    .listIDPLinks({
      $typeName: 'zitadel.user.v2.ListIDPLinksRequest',
      userId: session.user.id,
    })
    .then((res) => res.result)

  const redirectPath = `/portal/dashboard/${teamId}/settings`

  const googleConnected = idpLinks.some(
    (link) => link.idpId === OAuthId[OAuthProvider.Google],
  )
  const githubConnected = idpLinks.some(
    (link) => link.idpId === OAuthId[OAuthProvider.Github],
  )

  return (
    <Card className="w-full min-w-[470px]">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Identity Providers</CardTitle>
        <CardDescription>Connect supported identity providers</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <div className="space-y-3 flex flex-col">
          <OAuthButton
            provider={OAuthProvider.Google}
            text={googleConnected ? 'Already Connected' : 'Connect Google'}
            config={{
              type: 'connect',
              redirect: redirectPath,
            }}
            disabled={googleConnected}
          />
          <OAuthButton
            provider={OAuthProvider.Github}
            text={githubConnected ? 'Already Connected' : 'Connect Github'}
            config={{
              type: 'connect',
              redirect: redirectPath,
            }}
            disabled={githubConnected}
          />
        </div>
      </CardContent>
    </Card>
  )
}
