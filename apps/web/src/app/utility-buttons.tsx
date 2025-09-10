import {
  ArrowTopRightOnSquareIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid'
import {
  IconButton,
  LinkExternal,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@sushiswap/ui'
import { BrowserCookieIcon } from '@sushiswap/ui/icons/BrowserCookieIcon'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import { GithubIcon } from '@sushiswap/ui/icons/GithubIcon'
import { XIcon } from '@sushiswap/ui/icons/XIcon'
import Link from 'next/link'
import { Fragment } from 'react'
import { CookieDialogContainer } from './_common/cookies/cookie-dialog-container'
import { SUPPORT_NAVIGATION_LINKS } from './_common/header-elements'

export const UtilityButtons = () => {
  return (
    <div className="hidden md:flex gap-1 fixed bottom-2 right-8 z-50">
      <CookieDialogContainer>
        <IconButton
          size="sm"
          variant="ghost"
          icon={BrowserCookieIcon}
          name={'cookies'}
          className="text-muted-foreground"
        />
      </CookieDialogContainer>
      <Popover>
        <PopoverTrigger>
          <IconButton
            size="sm"
            variant="ghost"
            icon={QuestionMarkCircleIcon}
            name={'help'}
            className="text-muted-foreground"
          />
        </PopoverTrigger>
        <PopoverContent className="!p-0">
          <div className="px-5 py-4 cursor-default">Support</div>
          <Separator />
          <div className="px-5 py-4 flex flex-col gap-3">
            {SUPPORT_NAVIGATION_LINKS.map((component) => (
              <Fragment key={component.title}>
                <Link
                  href={component.href}
                  target="_blank"
                  className={
                    'cursor-pointer flex items-center gap-2 text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground'
                  }
                >
                  <span className="text-sm">{component.title}</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </Link>
                <Separator />
              </Fragment>
            ))}
            <span>Socials</span>
            <div className="flex gap-5 items-center">
              <LinkExternal href={'https://sushi.com/github'}>
                <GithubIcon
                  width={18}
                  height={18}
                  className="text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground"
                />
              </LinkExternal>
              <LinkExternal href={'https://sushi.com/discord'}>
                <DiscordIcon
                  width={18}
                  height={18}
                  className="text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground"
                />
              </LinkExternal>
              <LinkExternal href={'https://sushi.com/twitter'}>
                <XIcon
                  width={18}
                  height={18}
                  className="text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground"
                />
              </LinkExternal>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
