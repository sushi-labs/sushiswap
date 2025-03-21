'use client'

import { Button } from '@sushiswap/ui'
import type { GetIdpIntentConfig } from '../../lib/get-new-idp-intent'
import { oauthAction } from './oauth-action'
import { OAuthIcon, OAuthId, type OAuthProvider } from './oauth-config'

interface OAuthButton {
  provider: OAuthProvider
  text: string
  disabled?: boolean
  config: GetIdpIntentConfig
}

export function OAuthButton({
  provider,
  text,
  disabled = false,
  config,
}: OAuthButton) {
  const Icon = OAuthIcon[provider]

  return (
    <Button
      size="xl"
      variant="secondary"
      className="space-x-1 w-full"
      onClick={
        !disabled
          ? () => oauthAction({ idpId: OAuthId[provider], config })
          : undefined
      }
      disabled={disabled}
    >
      <Icon width={24} height={24} />
      <span>{text}</span>
    </Button>
  )
}
