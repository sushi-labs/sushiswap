import { CheckIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  classNames,
  typographyVariants,
} from '@sushiswap/ui'
import Link from 'next/link'
import { getUnauthenticatedStyroClient } from '../_common/lib/styro/styro-client'
import { PlanCard } from '../_common/ui/plans/plan-card'

export const revalidate = 3600

const enterpriseFeatures = [
  'Custom requests',
  'Dedicated support',
  'Custom features',
  'Personalized pricing built for your needs',
]

function EnterpriseCard() {
  return (
    <Card className="flex flex-row items-stretch space-x-6">
      <div className="w-2/5">
        <CardHeader>
          <CardDescription>Enterprise</CardDescription>
          <CardTitle className="whitespace-nowrap">Enterprise Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-slate-400">Custom pricing</span>
          <Link href="mailto:portal-support@sushi.com">
            <Button variant="secondary">Contact Us</Button>
          </Link>
        </CardContent>
      </div>
      <div className="py-6">
        <Separator orientation="vertical" />
      </div>
      <div className="flex items-center">
        <CardContent className="!pt-6 !gap-2">
          {enterpriseFeatures.map((feature) => (
            <div key={feature} className="flex items-center space-x-4">
              <CheckIcon width={16} height={16} className="shrink-0" />
              <span className="text-slate-400 text-sm md:whitespace-nowrap">
                {feature}
              </span>
            </div>
          ))}
        </CardContent>
      </div>
    </Card>
  )
}

export default async function Page() {
  const client = getUnauthenticatedStyroClient()
  const response = await client.getPlans()

  return (
    <div className="flex flex-col items-center w-full space-y-16 lg:space-y-20">
      <span
        className={classNames(
          typographyVariants({ variant: 'h1' }),
          'whitespace-nowrap',
        )}
      >
        Plans & Pricing
      </span>
      <div className="flex flex-col items-center space-y-12">
        <div className="gap-6 flex flex-row flex-wrap justify-center">
          {response.data.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        <EnterpriseCard />
      </div>
    </div>
  )
}
