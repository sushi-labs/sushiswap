import { Button } from '@sushiswap/ui'
import { GoogleIcon } from '@sushiswap/ui/icons/GoogleIcon'
import { getNewIdpIntent } from '../lib/get-new-idp-intent'

export const dynamic = false

export async function GoogleButton({
  text,
  type,
  disabled = false,
}: { text: string; type: 'login' | 'connect'; disabled?: boolean }) {
  const idpIntent = await getNewIdpIntent({ idpId: '299271776439894093', type })

  const Comp = (
    <Button
      size="xl"
      variant="secondary"
      className="space-x-1 w-full"
      disabled={disabled}
    >
      <GoogleIcon width={24} height={24} />
      <span>{text}</span>
    </Button>
  )

  if (disabled) return Comp

  return (
    <a
      href={idpIntent.authUrl}
      className="w-full"
      target="_blank"
      rel="noreferrer"
    >
      {Comp}
    </a>
  )
}
