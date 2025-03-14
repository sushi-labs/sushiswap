import type { IconComponent } from '@sushiswap/ui'
import { GithubIcon } from '@sushiswap/ui/icons/GithubIcon'
import { GoogleIcon } from '@sushiswap/ui/icons/GoogleIcon'

export enum OAuthProvider {
  Github = 0,
  Google = 1,
}

export const OAuthId: Record<OAuthProvider, string> = {
  [OAuthProvider.Github]: '299270310144770125',
  [OAuthProvider.Google]: '299271776439894093',
}

export const OAuthIcon: Record<OAuthProvider, IconComponent> = {
  [OAuthProvider.Github]: GithubIcon,
  [OAuthProvider.Google]: GoogleIcon,
}
