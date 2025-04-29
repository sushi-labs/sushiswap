'use client'
import { FormSection } from '@sushiswap/ui'
import { AmountInToken0 } from './AmountInToken0'
import { AmountInToken1 } from './AmountIntToken1'
import { Plus } from './Plus'
import { ReviewAddDialog } from './ReviewAddDialog'

export const DepositForm = () => {
  return (
    <FormSection
      title="Deposit"
      description="Select the amount of tokens you want to deposit"
    >
      <section className="relative flex flex-col w-full gap-4">
        <AmountInToken0 />
        <Plus />
        <AmountInToken1 />
      </section>
      <div className="flex flex-col w-full">
        <ReviewAddDialog size="xl" fullWidth />
      </div>
    </FormSection>
  )
}
