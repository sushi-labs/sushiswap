import { LinkExternal, LinkInternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import { GithubIcon } from '@sushiswap/ui/icons/GithubIcon'
import { TwitterIcon } from '@sushiswap/ui/icons/TwitterIcon'
import { YoutubeIcon } from '@sushiswap/ui/icons/YoutubeIcon'
import React, { type FC } from 'react'

const SUPPORT_CHANNELS = [
  {
    icon: DiscordIcon,
    title: 'Community on Discord',
    link: 'https://sushi.com/discord',
  },
  {
    icon: TwitterIcon,
    title: 'Follow us on Twitter',
    link: 'https://twitter.com/sushiswap',
  },
  {
    icon: GithubIcon,
    title: 'Code on Github',
    link: 'https://github.com/sushiswap',
  },
  {
    icon: YoutubeIcon,
    title: 'Youtube',
    link: 'https://www.youtube.com/c/SushiOfficial',
  },
]

export const NeedHelp: FC = () => {
  return (
    <section className="py-40 px-4">
      <Container
        maxWidth="5xl"
        className="mx-auto border border-accent p-10 rounded-2xl"
      >
        <div className="flex flex-col gap-20">
          <div className="flex flex-col items-center lg:items-start">
            <span className="text-hero font-semibold text-center lg:text-left">
              Need Help?
            </span>
            <span className="text-lg text-center lg:text-left mt-2 max-w-[360px]">
              If you need help or have any questions, contact us on one of our
              social channels
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[120px]">
            <div className="order-2 md:order-1 flex flex-col gap-2">
              <span className="text-xl font-semibold">Contact Support</span>
              <span className="text-lg text-muted-foreground">
                Join the Sushi Discord community and ask away!
              </span>
              <div className="mt-4">
                {SUPPORT_CHANNELS.map(({ title, icon: Icon, link }, index) => (
                  <LinkInternal
                    href={link}
                    className="flex items-center gap-4 cursor-pointer group py-2"
                    key={index}
                  >
                    <Icon
                      width={24}
                      height={24}
                      className="text-blue group-hover:text-blue-300"
                    />
                    <span className="text-sm font-medium text-blue group-hover:text-blue-300">
                      {title}
                    </span>
                  </LinkInternal>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2 col-span-2">
              <div className="-mt-5 bg-gradient-to-b bg-secondary rounded-2xl p-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xl font-semibold">Sushi Academy</span>
                  <span className="text-lg text-muted-foreground">
                    Demystifying DeFi - everything you need to know in one
                    place. For beginners to advanced users, and everyone in
                    between.
                  </span>
                </div>
                <div className="flex justify-start mt-4">
                  <LinkExternal href="https://www.sushi.com/academy">
                    <Button variant="secondary">Visit Academy</Button>
                  </LinkExternal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
