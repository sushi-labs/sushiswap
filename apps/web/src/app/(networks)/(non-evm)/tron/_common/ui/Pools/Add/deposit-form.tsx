'use client'
import { FormSection } from '@sushiswap/ui'
import { AmountInToken0 } from './amount-in-token0'
import { AmountInToken1 } from './amount-int-token1'
import { Plus } from './plus'
import { ReviewAddDialog } from './review-add-dialog'

export const DepositForm = () => {
  return (
    <FormSection
      title="Deposit"
      description="Select the amount of tokens you want to deposit"
    >
      <section className="flex flex-col gap-4 relative w-full">
        <AmountInToken0 />
        <Plus />
        <AmountInToken1 />
      </section>
      <div className="flex w-full flex-col">
        <ReviewAddDialog size="xl" fullWidth />
      </div>
    </FormSection>
  )
}
