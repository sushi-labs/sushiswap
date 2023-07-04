import { Button } from '@sushiswap/ui/components/button'
import { Container } from '@sushiswap/ui/components/container'
import { DiscordIcon, GithubIcon, TwitterIcon, YoutubeIcon } from '@sushiswap/ui/components/icons'
import React, { FC } from 'react'

const SUPPORT_CHANNELS = [
  {
    icon: DiscordIcon,
    title: 'Community on Discord',
    link: 'https://discord.gg/NVPXN4e',
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
      <Container maxWidth="5xl" className="mx-auto border border-neutral-900 p-10 rounded-2xl">
        <div className="flex flex-col gap-20">
          <div className="flex flex-col items-center lg:items-start">
            <span className="text-hero font-semibold text-center lg:text-left">Need Help?</span>
            <span className="text-lg text-center lg:text-left mt-2 max-w-[360px]">
              If you need help or have any questions, contact us on one of our social channels
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[120px]">
            <div className="order-2 md:order-1 flex flex-col gap-2">
              <span className="text-xl font-semibold text-white">Contact Support</span>
              <span className="text-lg text-neutral-400">Join the Sushi Discord community and ask away!</span>
              <div className="mt-4">
                {SUPPORT_CHANNELS.map(({ title, icon: Icon, link }, index) => (
                  <a href={link} className="flex items-center gap-4 cursor-pointer group py-2" key={index}>
                    <Icon width={24} height={24} className="text-blue group-hover:text-blue-300" />
                    <span className="text-sm font-medium text-blue group-hover:text-blue-300">{title}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2 col-span-2">
              <div className="-mt-5 bg-gradient-to-b bg-neutral-900 rounded-2xl p-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xl font-semibold text-white">Sushi Academy</span>
                  <span className="text-lg text-neutral-400">
                    Demystifying DeFi - everything you need to know in one place. For beginners to advanced users, and
                    everyone in between.
                  </span>
                </div>
                <div className="flex justify-start mt-4">
                  <Button asChild variant="secondary">
                    <a href="https://www.sushi.com/academy">Visit Academy</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
