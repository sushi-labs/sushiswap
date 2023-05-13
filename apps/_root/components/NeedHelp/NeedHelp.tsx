import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { Button, Container, DiscordIcon, GithubIcon, TwitterIcon, Typography, YoutubeIcon } from '@sushiswap/ui'
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
            <Typography variant="hero" weight={600} className="text-center lg:text-left">
              Need Help?
            </Typography>
            <Typography variant="lg" weight={400} className="text-center lg:text-left mt-2 max-w-[360px]">
              If you need help or have any questions, contact us on one of our social channels
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[120px]">
            <div className="order-2 md:order-1 flex flex-col gap-2">
              <Typography variant="xl" weight={700} className="text-white">
                Contact Support
              </Typography>
              <Typography variant="lg" weight={400} className="text-neutral-400">
                Join the Sushi Discord community and ask away!
              </Typography>
              <div className="mt-4">
                {SUPPORT_CHANNELS.map(({ title, icon: Icon, link }, index) => (
                  <a href={link} className="flex items-center gap-4 cursor-pointer group py-2" key={index}>
                    <Icon width={24} height={24} className="text-blue group-hover:text-blue-300" />
                    <Typography variant="sm" weight={500} className="text-blue group-hover:text-blue-300">
                      {title}
                    </Typography>
                  </a>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2 col-span-2">
              <div className="-mt-5 bg-gradient-to-b bg-neutral-900 rounded-2xl p-6">
                <div className="flex flex-col gap-2">
                  <Typography variant="xl" weight={700} className="text-white">
                    Sushi Academy
                  </Typography>
                  <Typography variant="lg" weight={400} className="text-neutral-400">
                    Demystifying DeFi - everything you need to know in one place. For beginners to advanced users, and
                    everyone in between.
                  </Typography>
                </div>
                <div className="flex justify-start mt-4">
                  <Button
                    as="a"
                    href="https://www.sushi.com/academy"
                    className="!p-0 mt-3"
                    variant="empty"
                    endIcon={<ExternalLinkIcon width={16} height={16} />}
                  >
                    Visit Academy
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
