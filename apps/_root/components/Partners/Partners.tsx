import { Container, Typography } from '@sushiswap/ui'
import { FC } from 'react'

const PARTNERS = ['Manifold Finance', 'KlimaDAO', 'The Graph', 'Partner 4', 'Partner 5', 'Partner 6', 'Partner 7']

const INCEPTION_DATE = new Date('08/26/2020')

export const Partners: FC = () => {
  const diff = Math.floor((new Date().getTime() - INCEPTION_DATE.getTime()) / (60 * 60 * 24 * 1000))

  return (
    <section className="py-20 sm:py-40 px-4 border-t border-neutral-200/5 bg-gradient-to-b from-pink/[0.04] to-black">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="flex flex-col items-center">
          <Typography variant="h1" weight={600} className="text-center">
            {diff} Days.
          </Typography>
          <Typography variant="lg" weight={400} className="text-center mt-2 max-w-[420px]">
            Since the inception of Sushi. We appreciate all the friends we’ve made along the way to the Future of
            Finance.
          </Typography>
        </div>
        <div className="flex flex-col gap-y-10">
          <div className="flex justify-center flex-wrap divide-x-2 divide-neutral-600">
            {PARTNERS.slice(0, 4).map((el) => (
              <Typography
                variant="lg"
                key={el}
                weight={500}
                className="cursor-pointer transition-all flex text-center whitespace-nowrap border-slate-200/5 px-10 hover:text-blue"
              >
                {el}
              </Typography>
            ))}
          </div>
          <div className="flex justify-center flex-wrap divide-x-2 divide-neutral-600">
            {PARTNERS.slice(4, 7).map((el) => (
              <Typography
                variant="lg"
                key={el}
                weight={500}
                className="cursor-pointer transition-all flex text-center whitespace-nowrap border-slate-200/5 px-10 hover:text-blue"
              >
                {el}
              </Typography>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
