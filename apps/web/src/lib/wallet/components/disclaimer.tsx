import { LinkExternal } from '@sushiswap/ui'

export const Disclaimer = () => {
  return (
    <div className="text-sm">
      By connecting your wallet, you agree to Sushi Labs&apos;{' '}
      <LinkExternal href="/legal/terms-of-service">
        Terms of Service
      </LinkExternal>{' '}
      and{' '}
      <LinkExternal href="/legal/privacy-policy">Privacy Policy</LinkExternal>
    </div>
  )
}
