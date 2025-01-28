import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { GithubButton } from 'src/app/portal/(unauthenticated)/_common/ui/github-button'
import { GoogleButton } from 'src/app/portal/(unauthenticated)/_common/ui/google-button'

export function IdentityProvidersCard() {
  return (
    <Card className="w-full min-w-[470px]">
      <CardHeader className="bg-secondary rounded-t-xl">
        <CardTitle>Identity Providers</CardTitle>
        <CardDescription>Connect supported identity providers</CardDescription>
      </CardHeader>
      <CardContent className="bg-secondary rounded-b-xl">
        <div className="space-y-3 flex flex-col">
          <GoogleButton text="Connect Google" type="connect" disabled />
          <GithubButton text="Connect Github" type="connect" disabled />
        </div>
      </CardContent>
    </Card>
  )
}
