'use client'

import { Button } from '@sushiswap/ui'
import { useTopLoader } from 'nextjs-toploader'
import { useCallback } from 'react'
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

  const loader = useTopLoader()

  const onClick = useCallback(() => {
    if (disabled) return

    loader?.start()
    oauthAction({ idpId: OAuthId[provider], config })
  }, [disabled, loader, config, provider])

  return (
    <Button
      size="xl"
      variant="secondary"
      className="space-x-1 w-full"
      onClick={onClick}
      onKeyUp={onClick}
      disabled={disabled}
    >
      <Icon width={24} height={24} />
      <span>{text}</span>
    </Button>
  )
}
