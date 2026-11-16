import { type VariantProps, cva } from 'class-variance-authority'
import { CodeXml, Shuffle } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import classNames from 'classnames'
import { DiscordIcon } from '../icons/discord-icon'
import { GithubIcon } from '../icons/github-icon'
import { SushiIcon } from '../icons/sushi-icon'
import { TelegramIcon } from '../icons/telegram-icon'
import { XIcon } from '../icons/x-icon'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion'
import { buttonVariants } from './button'
import { LinkInternal } from './link'
import { navigationMenuTriggerStyle } from './navigation-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu'

const PRODUCT_NAVIGATION_LINKS = [
  {
    title: 'Sushi API',
    href: 'https://docs.sushi.com/api/swagger',
    description: 'Swap, quotes, and pricing',
    icon: CodeXml,
  },
  {
    title: 'Sushi Aggregator',
    href: 'https://docs.sushi.com/aggregator/introduction',
    description: 'Best-price routing',
    icon: Shuffle,
  },
]

const COMPANY_NAVIGATION_LINKS: NavigationElementDropdown['items'] = [
  {
    title: 'Blog',
    href: '/blog',
    description:
      'Stay up to date with the latest product developments at Sushi.',
  },
  {
    title: 'Academy',
    href: '/academy',
    description: 'Everything you need to get up to speed with DeFi.',
  },
  {
    title: 'FAQ',
    href: '/faq',
    description: 'Answers to the most common questions about Sushi.',
  },
]

const PROTOCOL_NAVIGATION_LINKS: NavigationElementDropdown['items'] = [
  {
    title: 'Forum',
    href: 'https://forum.sushi.com',
    description: 'View and discuss proposals for SushiSwap.',
  },
  {
    title: 'Vote',
    href: 'https://snapshot.org/#/sushigov.eth',
    description:
      'As a Sushi holder, you can vote on proposals to shape the future of SushiSwap.',
  },
  {
    title: 'Docs',
    href: 'https://docs.sushi.com/what-is-sushi',
    description: 'Learn more about Sushi, its products, and how to use them.',
  },
]

const PARTNER_NAVIGATION_LINKS: NavigationElementDropdown['items'] = [
  {
    title: 'Partner with Sushi',
    href: '/partner',
    description: 'Incentivize your token with Sushi rewards.',
  },
  {
    title: 'Token Listing',
    href: '/tokenlist-request',
    description: 'Get your token on our default token list.',
  },
]

const LEGAL_NAVIGATION_LINKS = [
  { title: 'Terms of Service', href: '/legal/terms-of-service' },
  { title: 'Privacy Policy', href: '/legal/privacy-policy' },
  {
    title: 'Launchpad Terms of Service',
    href: '/legal/sushi-launchpad-terms-of-use',
  },
]

const SOCIAL_NAVIGATION_LINKS = [
  { title: 'X', href: 'https://sushi.com/twitter', icon: XIcon },
  { title: 'Discord', href: 'https://sushi.com/discord', icon: DiscordIcon },
  { title: 'Telegram', href: 'https://sushi.com/telegram', icon: TelegramIcon },
  { title: 'GitHub', href: 'https://sushi.com/github', icon: GithubIcon },
]

const navigationContainerVariants = cva(
  'px-4 flex items-center flex-grow gap-4 top-0 z-50 min-h-[56px] max-h-[56px] h-[56px]',
  {
    variants: {
      variant: {
        default:
          'bg-background border-b-[0.5px] border-accent black:bg-background black:border-accent',
        transparent: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface NavContainerProps
  extends VariantProps<typeof navigationContainerVariants> {
  children: React.ReactNode
  className?: string
}

const NavigationContainer: React.FC<NavContainerProps> = ({
  children,
  variant,
  className,
}) => {
  return (
    <div className={navigationContainerVariants({ variant, className })}>
      <div className="flex items-center justify-between flex-grow gap-4">
        {children}
      </div>
    </div>
  )
}

export type NavigationElementShow =
  | 'mobile'
  | 'desktop'
  | 'everywhere'
  | 'never'
  | 'perps-mobile'
  | 'perps-desktop'

export const navigationElementShowMap: Record<NavigationElementShow, string> = {
  'perps-mobile': 'md:hidden block',
  'perps-desktop': 'md:block hidden',
  mobile: 'md:hidden block',
  desktop: 'md:block hidden',
  everywhere: '',
  never: 'hidden',
}

export enum NavigationElementType {
  Single = 'single',
  Dropdown = 'dropdown',
  Custom = 'custom',
}

export type NavigationElementSingle = {
  title: string
  href: string
  show: NavigationElementShow
  type: NavigationElementType.Single
}

export type NavigationElementDropdown = {
  href?: string
  title: string
  items: {
    title: string
    href: string
    description: string
  }[]
  show: NavigationElementShow
  type: NavigationElementType.Dropdown
}

export type NavigationElementCustom = {
  item: React.ReactNode
  show: NavigationElementShow
  type: NavigationElementType.Custom
  href?: string
}

export type NavigationElement =
  | NavigationElementSingle
  | NavigationElementDropdown
  | NavigationElementCustom

interface NavProps extends VariantProps<typeof navigationContainerVariants> {
  leftElements: NavigationElement[]
  rightElement?: React.ReactNode
  className?: string
  hideSushiDropdown?: boolean
  cookiePreferences?: React.ReactNode
  sushiDropdownTriggerRef?: React.Ref<HTMLButtonElement>
}

const Navigation: React.FC<NavProps> = ({
  leftElements: _leftElements,
  rightElement,
  variant,
  className,
  hideSushiDropdown = false,
  cookiePreferences,
  sushiDropdownTriggerRef,
}) => {
  const leftElements = React.useMemo(() => {
    const SingleItem = (entry: NavigationElementSingle) => {
      return (
        <NavigationMenuItem
          key={`${entry.title}:${entry.type}`}
          className={navigationElementShowMap[entry.show]}
        >
          <NavigationMenuLink
            href={entry.href}
            className={navigationMenuTriggerStyle}
          >
            {entry.title}
          </NavigationMenuLink>
        </NavigationMenuItem>
      )
    }

    const DropdownItem = (entry: NavigationElementDropdown) => {
      return (
        <NavigationMenuItem
          key={entry.title}
          className={navigationElementShowMap[entry.show]}
        >
          <NavigationMenuTrigger>{entry.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[250px] sm:w-[400px] gap-3 p-4">
              {entry.items.map((component) => (
                <NavigationListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </NavigationListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      )
    }

    return _leftElements.flatMap((el, i) => {
      switch (el.type) {
        case NavigationElementType.Single:
          return SingleItem(el)
        case NavigationElementType.Dropdown:
          return DropdownItem(el)
        case NavigationElementType.Custom:
          return el.href ? (
            <LinkInternal
              key={`${i}`}
              href={el.href}
              className={navigationElementShowMap[el.show]}
            >
              {el.item}
            </LinkInternal>
          ) : (
            <div key={`${i}`} className={navigationElementShowMap[el.show]}>
              {el.item}
            </div>
          )
      }
    })
  }, [_leftElements])

  return (
    <NavigationContainer variant={variant} className={className}>
      <div className="flex space-x-1">
        {!hideSushiDropdown ? (
          <SushiNavigationDropdown
            cookiePreferences={cookiePreferences}
            triggerRef={sushiDropdownTriggerRef}
          >
            <SushiIcon width={24} height={24} />
          </SushiNavigationDropdown>
        ) : null}
        <NavigationMenu>
          <NavigationMenuList>{leftElements}</NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center gap-2">
        {rightElement ? rightElement : null}
      </div>
    </NavigationContainer>
  )
}

interface NavigationListItemProps extends React.ComponentPropsWithoutRef<'a'> {}

const NavigationListItem = React.forwardRef<
  React.ElementRef<'a'>,
  NavigationListItemProps
>(({ className, title, children, href, ...props }, ref) => {
  const { onSelect: _onSelect, ...anchorProps } = props
  const classes = classNames(
    'cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
    className,
  )

  const content = (
    <>
      <div className="text-sm font-medium [line-height:1]">{title}</div>
      <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
        {children}
      </p>
    </>
  )

  const isInternalLink = typeof href === 'string' && /^\/(?!\/)/.test(href)

  return (
    <li>
      {href && isInternalLink ? (
        <NavigationMenuLink asChild>
          <Link ref={ref} className={classes} href={href} {...anchorProps}>
            {content}
          </Link>
        </NavigationMenuLink>
      ) : (
        <NavigationMenuLink asChild>
          <a ref={ref} className={classes} href={href} {...anchorProps}>
            {content}
          </a>
        </NavigationMenuLink>
      )}
    </li>
  )
})

NavigationListItem.displayName = 'NavListItem'

function SushiNavigationDropdown({
  children,
  className,
  cookiePreferences,
  triggerRef,
}: {
  children?: React.ReactElement
  className?: string
  cookiePreferences?: React.ReactNode
  triggerRef?: React.Ref<HTMLButtonElement>
}): React.JSX.Element {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            ref={triggerRef}
            aria-label="Sushi menu"
            className={className}
          >
            {children}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="!max-h-[calc(100dvh-5rem)] overscroll-contain scroll">
            <div className="w-[min(36rem,calc(100vw-2rem))] space-y-3 p-3 text-primary sm:space-y-4 sm:p-4">
              <section className="space-y-2">
                <h2 className="px-1 text-xs text-muted-foreground">Products</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {PRODUCT_NAVIGATION_LINKS.map(
                    ({ title, href, description, icon: Icon }) => (
                      <li key={title}>
                        <NavigationMenuLink
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-full items-center gap-3 rounded-2xl border border-accent p-3 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink text-white">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 space-y-0.5">
                            <span className="block text-sm font-semibold">
                              {title}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {description}
                            </span>
                          </span>
                        </NavigationMenuLink>
                      </li>
                    ),
                  )}
                </ul>
              </section>

              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-accent bg-muted p-3 sm:grid-cols-3 sm:p-4">
                {[
                  { title: 'Company', links: COMPANY_NAVIGATION_LINKS },
                  { title: 'Protocol', links: PROTOCOL_NAVIGATION_LINKS },
                  { title: 'Partnership', links: PARTNER_NAVIGATION_LINKS },
                ].map(({ title, links }) => (
                  <section
                    key={title}
                    className="last:col-span-2 sm:last:col-span-1"
                  >
                    <h2 className="px-1.5 pb-1.5 text-xs text-muted-foreground">
                      {title}
                    </h2>
                    <ul>
                      {links.map((link) => (
                        <li key={link.title}>
                          <NavigationMenuLink
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-h-9 items-center rounded-lg p-1.5 text-sm transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
                          >
                            {link.title}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <Accordion type="single" collapsible className="min-w-0 flex-1">
                  <AccordionItem value="legal" className="!border-0">
                    <AccordionTrigger className="min-h-9 !justify-start gap-1.5 rounded-lg px-1 !py-1.5 text-xs !font-normal text-muted-foreground hover:text-primary hover:!no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink [&>svg]:!h-3 [&>svg]:!w-3">
                      Legal &amp; Privacy
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="pt-1">
                        {LEGAL_NAVIGATION_LINKS.map(({ title, href }) => (
                          <li key={title}>
                            <NavigationMenuLink
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex min-h-9 items-center rounded-lg p-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:bg-muted focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
                            >
                              {title}
                            </NavigationMenuLink>
                          </li>
                        ))}
                        {cookiePreferences ? (
                          <li>{cookiePreferences}</li>
                        ) : null}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <ul className="flex shrink-0 gap-1.5">
                  {SOCIAL_NAVIGATION_LINKS.map(
                    ({ title, href, icon: Icon }) => (
                      <li key={title}>
                        <NavigationMenuLink
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={title}
                          className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                            className: 'w-9 !bg-secondary !p-0 hover:!bg-muted',
                          })}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </NavigationMenuLink>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export {
  Navigation,
  NavigationContainer,
  NavigationListItem,
  SushiNavigationDropdown,
}
