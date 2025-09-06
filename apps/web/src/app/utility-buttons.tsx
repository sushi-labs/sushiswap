import {
  ArrowTopRightOnSquareIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid'
import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@sushiswap/ui'
import { BrowserCookieIcon } from '@sushiswap/ui/icons/BrowserCookieIcon'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import { GithubIcon } from '@sushiswap/ui/icons/GithubIcon'
import { TwitterIcon } from '@sushiswap/ui/icons/TwitterIcon'
import { CookieDialogContainer } from './_common/cookies/cookie-dialog-container'

export const UtilityButtons = () => {
  return (
    <div className="fixed bottom-2 right-8 flex gap-1 z-50">
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
          <div className="px-5 py-4">Support</div>
          <Separator />
          <div className="px-5 py-4 flex flex-col gap-3">
            <a
              href="/academy"
              target="_blank"
              rel="noreferrer"
              className="text-sm flex items-center gap-2"
            >
              Sushi Academy
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
            <Separator />
            <a
              href="/faq"
              target="_blank"
              rel="noreferrer"
              className="text-sm flex items-center gap-2"
            >
              FAQ
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
            <Separator />
            <span>Socials</span>
            <div className="flex gap-5">
              <GithubIcon width={18} height={18} />
              <DiscordIcon width={18} height={18} />
              <TwitterIcon width={18} height={18} />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
