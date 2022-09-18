import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { Button, Container, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { ArticleEntity } from '../../.mesh'

export const Hero: FC = () => {
  return (
    <section>
      <Container maxWidth="6xl" className="px-4 py-10 mx-auto">
        <div className="flex flex-col items-center">
          <Typography className="text-6xl md:text-[110px]" variant="hero">
            Sushi
          </Typography>
          <Typography className="text-6xl md:text-[110px]" variant="hero" weight={700}>
            Academy
          </Typography>
          <Typography className="mt-10 text-center">
            Demystifying DeFI and Crypto - everything you need to know in one place.
          </Typography>
          <Typography className="text-center">For beginners to advanced users, and everyone in between.</Typography>
          <Button
            // TODO: change link
            // TODO: styling (size, font size)
            as="a"
            // href={`/blog/${article?.attributes?.slug}`}
            href={`/academy`}
            color="blue"
            className="inline-flex h-12 text-base font-bold transition-all rounded-full px-7 md:px-10 mt-11 hover:ring-4 focus:ring-4 text-slate-50"
          >
            <PaperAirplaneIcon className="-rotate-45 -translate-y-0.5 text-slate-50" width={20} height={20} />
            Get started with Sushi
          </Button>
        </div>
      </Container>
    </section>
  )
}
