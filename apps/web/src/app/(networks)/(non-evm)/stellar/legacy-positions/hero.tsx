import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  LinkInternal,
} from '@sushiswap/ui'
import type { FC } from 'react'

export const Hero: FC = () => {
  return (
    <section className="flex flex-col gap-6">
      <span className="text-5xl font-bold">Migrate Legacy Positions</span>
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger> What is this migration about?</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 pb-2">
              <p className="text-md w-full text-muted-foreground">
                A bug was discovered in the original position manager contract
                implementation that could lead to positions in heavily-used
                pools being locked.
              </p>
              <p className="text-md w-full text-muted-foreground">
                In such a state, only fees accrued from the position can be
                collected, but the position principal itself cannot be
                withdrawn.
              </p>
              <p className="text-md w-full text-muted-foreground">
                This migration allows users to collect any accrued fees and
                withdraw their position principal and then easily redeploy their
                liquidity with the same parameters (principal amounts and price
                range) under the new fixed implementation of the position
                manager.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            How do I migrate my legacy positions?
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 pb-2">
              <p className="text-md w-[720px] text-muted-foreground">
                Simply connect your wallet and click the "Migrate" button for
                each of your legacy positions below.
              </p>
              <p className="text-md w-[720px] text-muted-foreground">
                This will prompt the following on-chain transactions:
              </p>
              <ol className="list-decimal list-outside flex flex-col gap-1 pl-5">
                <li className="text-md w-[720px] text-muted-foreground">
                  Request withdrawal of the position principal
                </li>
                <li className="text-md w-[720px] text-muted-foreground">
                  Withdraw the position principal and accrued fees from the
                  legacy position
                </li>
                <li className="text-md w-[720px] text-muted-foreground">
                  Create a position with the new fixed implementation of the
                  position manager using the withdrawn liquidity and the same
                  price range as the legacy position
                </li>
              </ol>
              <p className="text-md w-[720px] text-muted-foreground">
                While the process will remember your legacy position parameters
                during the migration to facilitate the creation of the new
                position with the same parameters, it is recommended that you
                take note of your legacy position parameters (i.e., token pair,
                fee rate, principal amounts, and price range) before initiating
                the migration as a back-up.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
