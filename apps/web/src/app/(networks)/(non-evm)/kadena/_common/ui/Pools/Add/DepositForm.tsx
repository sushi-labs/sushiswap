'use client'
import { Button, FormSection } from '@sushiswap/ui'
import { AmountInToken0 } from './AmountInToken0'
import { AmountInToken1 } from './AmountInToken1'
import { Plus } from './Plus'
// import { ReviewAddDialog } from './ReviewAddDialog'

export const DepositForm = () => {
  return (
    <FormSection
      title="Deposit"
      description="Select the amount of tokens you want to deposit"
    >
      <section className="relative flex flex-col w-full gap-4 opacity-40 pointer-events-none">
        <AmountInToken0 disabled />
        <Plus />
        <AmountInToken1 disabled />
      </section>
      <div className="flex flex-col w-full">
        <Button size="xl" disabled>
          Pool Creation Is Currently Disabled
        </Button>
        {/* <ReviewAddDialog size="xl" fullWidth /> */}
      </div>
    </FormSection>
  )
}
