import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@sushiswap/ui'
import type { ReactNode } from 'react'
import type { PortfolioAccordionValue } from './portfolio-assets/portfolio-assets'

export const PortfolfioAccordion = ({
  value,
  onValueChange,
  accordionValue,
  triggerChildren,
  children,
}: {
  value: PortfolioAccordionValue
  onValueChange: (val: PortfolioAccordionValue) => void
  accordionValue: PortfolioAccordionValue
  triggerChildren: ReactNode
  children: ReactNode
}) => {
  return (
    <Accordion
      type="single"
      className="border border-accent rounded-xl"
      value={value}
      onValueChange={(val) => onValueChange(val)}
    >
      <AccordionItem value={accordionValue} className="!border-0">
        <AccordionTrigger
          hideChevron={true}
          className="px-3 text-xs !py-2 hover:!no-underline data-[state=closed]:border-0 data-[state=closed]:rounded-b-xl !rounded-t-xl border-b border-b-accent dark:bg-slate-800 bg-slate-100 sm:bg-white flex justify-between items-center"
        >
          {triggerChildren}
        </AccordionTrigger>
        <AccordionContent className="cursor-default max-h-[225px] overflow-y-auto hide-scrollbar">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
