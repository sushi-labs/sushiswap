import { Button, type IconComponent } from '@sushiswap/ui'
import { GithubIcon } from '@sushiswap/ui/icons/GithubIcon'
import { GoogleIcon } from '@sushiswap/ui/icons/GoogleIcon'
import {
  type GetIdpIntentConfig,
  getNewIdpIntent,
} from '../../lib/get-new-idp-intent'

export enum OAuthProvider {
  Github = 0,
  Google = 1,
}

export const OAuthId: Record<OAuthProvider, string> = {
  [OAuthProvider.Github]: '299270310144770125',
  [OAuthProvider.Google]: '299271776439894093',
}

const OAuthIcon: Record<OAuthProvider, IconComponent> = {
  [OAuthProvider.Github]: GithubIcon,
  [OAuthProvider.Google]: GoogleIcon,
}

interface OAuthButton {
  provider: OAuthProvider
  text: string
  disabled?: boolean
  config: GetIdpIntentConfig
}

export const dynamic = false

export async function OAuthButton({
  provider,
  text,
  disabled = false,
  config,
}: OAuthButton) {
  const idpIntent = await getNewIdpIntent({
    idpId: OAuthId[provider],
    config,
  })

  const Icon = OAuthIcon[provider]
  const Comp = (
    <Button
      size="xl"
      variant="secondary"
      className="space-x-1 w-full"
      disabled={disabled}
    >
      <Icon width={24} height={24} />
      <span>{text}</span>
    </Button>
  )

  if (disabled) return Comp

  return (
    <a href={idpIntent.authUrl} className="w-full">
      {Comp}
    </a>
  )
}
