import { Button, LinkInternal } from '@sushiswap/ui'
import type { FC } from 'react'

export const Hero: FC = () => {
  return (
    <section className="flex flex-col gap-6">
      <span className="text-5xl font-bold">Manage Liquidity Positions</span>
      <div className="flex justify-between flex-wrap gap-6">
        <span className="text-xl w-[720px] text-muted-foreground">
          You can adjust and claim rewards for your liquidity positions on the
          connected network.
        </span>
        <div className="flex flex-col w-full sm:w-[204px] gap-4">
          <Button asChild size="sm">
            <LinkInternal href="/stellar/pool/add">
              I want to create a position
            </LinkInternal>
          </Button>
        </div>
      </div>
    </section>
  )
}
