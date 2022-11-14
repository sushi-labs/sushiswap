import { Container, Typography } from '@sushiswap/ui'
import { FC } from 'react'

const PARTNERS = ['Manifold Finance', 'KlimaDAO', 'The Graph', 'Partner 4', 'Partner 5', 'Partner 6', 'Partner 7']

export const Partners: FC = () => {
  return (
    <section className="py-40 border-t border-slate-200/5 bg-gradient-to-b from-pink/[0.04] to-black">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="flex flex-col items-center">
          <Typography variant="h1" weight={600} className="text-center">
            796 Days.
          </Typography>
          <Typography variant="lg" weight={400} className="text-center mt-2 max-w-[420px]">
            Since the inception of Sushi. We appreciate all the friends we’ve made along the way to the Future of
            Finance.
          </Typography>
        </div>
        <div className="flex gap-x-4 gap-y-4 justify-center flex-wrap">
          {PARTNERS.slice(0, 4).map((el) => (
            <Typography
              variant="lg"
              key={el}
              weight={500}
              className="flex text-center whitespace-nowrap bg-white/[0.04] rounded-xl px-10 py-3"
            >
              {el}
            </Typography>
          ))}
          <div className="flex gap-x-4 gap-y-4 justify-center flex-wrap">
            {PARTNERS.slice(4, 7).map((el) => (
              <Typography
                variant="lg"
                key={el}
                weight={500}
                className="flex text-center whitespace-nowrap bg-white/[0.04] rounded-xl px-10 py-3"
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
