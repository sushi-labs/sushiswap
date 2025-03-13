import { Carousel, typographyVariants } from '@sushiswap/ui'
import { getUnauthenticatedStyroClient } from '../_common/lib/styro/styro-client'
import { PlanCard } from '../_common/ui/plans/plan-card'

export const revalidate = 3600

export default async function Page() {
  const client = getUnauthenticatedStyroClient()
  const response = await client.getPlans()

  return (
    <div className="flex flex-col items-center w-full space-y-20">
      <span className={typographyVariants({ variant: 'h1' })}>
        Plans & Pricing
      </span>
      <div className="gap-6 flex flex-row flex-wrap justify-center">
        {response.data.plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  )
}
