import { Button } from '@sushiswap/ui'
import { GithubIcon } from '@sushiswap/ui/icons/GithubIcon'
import { getNewIdpIntent } from '../lib/get-new-idp-intent'

export const dynamic = false

export async function GithubButton({
  text,
  type,
  disabled = false,
}: { text: string; type: 'login' | 'connect'; disabled?: boolean }) {
  const idpIntent = await getNewIdpIntent({ idpId: '299270310144770125', type })

  const Comp = (
    <Button
      size="xl"
      variant="secondary"
      className="space-x-1 w-full"
      disabled={disabled}
    >
      <GithubIcon width={24} height={24} />
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
