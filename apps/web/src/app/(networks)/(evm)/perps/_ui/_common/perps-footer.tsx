import { LinkExternal } from '@sushiswap/ui'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import { TelegramIcon } from '@sushiswap/ui/icons/TelegramIcon'
import { XIcon } from '@sushiswap/ui/icons/XIcon'
import { HlApiStatus } from './hl-api-status'

export const PerpsFooter = () => {
  return (
    <div className="w-full fixed bottom-0 h-7 z-20 bg-perps-background hidden lg:block">
      <div className="flex items-center justify-between h-full border-t border-[#0D1217] px-2 bg-[#EDF0F30D] backdrop-blur-2xl">
        <HlApiStatus />
        <div className="flex items-center h-full mr-[65px] text-xs">
          <_Item href={'https://docs.sushi.com/what-is-sushi'}>
            <div>Docs</div>
          </_Item>
          <_Item href={'/legal/terms-of-service'}>
            <div>Terms of Service</div>
          </_Item>
          <_Item href={'/legal/privacy-policy'}>
            <div>Privacy Policy</div>
          </_Item>
          <_Item href={'https://sushi.com/telegram'}>
            <TelegramIcon width={14} height={14} />
            <div>Telegram</div>
          </_Item>
          <_Item href={'https://sushi.com/twitter'}>
            <XIcon width={14} height={14} />
            <div>X (Twitter)</div>
          </_Item>
          <_Item href={'https://sushi.com/github'}>
            <DiscordIcon width={14} height={14} />
            <div>Discord</div>
          </_Item>
        </div>
      </div>
    </div>
  )
}

const _Item = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => {
  return (
    <LinkExternal href={href}>
      <div className="flex items-center gap-1 border-r border-[#EDF0F30D] px-4 text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground">
        {children}
      </div>
    </LinkExternal>
  )
}
