import { Container, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

export const NeedHelp: FC = () => {
  return (
    <section className="py-60">
      <Container maxWidth="5xl" className="mx-auto">
        <div className="flex flex-col gap-20">
          <div className="flex flex-col items-center lg:items-start">
            <Typography variant="xl" weight={600} className="text-center lg:text-left">
              Need Help?
            </Typography>
            <Typography variant="lg" weight={400} className="text-center lg:text-left mt-2">
              If you need help or have any questions, contact us on <br /> one of our social channels
            </Typography>
          </div>
        </div>
      </Container>
    </section>
  )
}
