import { LinkExternal } from '@sushiswap/ui'

export const Disclaimer = () => {
  return (
    <div className="text-center text-sm leading-5 text-muted-foreground [&_a]:!text-pink [&_a]:font-medium">
      By connecting your wallet, you agree to Sushi Labs&apos;{' '}
      <LinkExternal href="/legal/terms-of-service">
        Terms of Service
      </LinkExternal>{' '}
      and{' '}
      <LinkExternal href="/legal/privacy-policy">Privacy Policy</LinkExternal>
    </div>
  )
}
