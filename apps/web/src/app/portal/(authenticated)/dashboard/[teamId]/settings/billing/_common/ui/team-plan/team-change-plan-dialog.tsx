'use client'

import type { ResponseError, StyroResults } from '@sushiswap/styro-client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dots,
  ScrollArea,
  ScrollBar,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { parseStyroError } from 'src/app/portal/_common/lib/styro/parse-error'
import { useStyroClient } from 'src/app/portal/_common/ui/auth-provider/auth-provider'
import { CheckerCustom } from 'src/app/portal/_common/ui/checker/checker-custom/checker-custom'
import { CheckerRoleClient } from 'src/app/portal/_common/ui/checker/checker-role/checker-role-client'
import {
  CollapsibleMessage,
  useCollapsibleMessage,
} from 'src/app/portal/_common/ui/collapsible-message'
import { PlanCard } from 'src/app/portal/_common/ui/plans/plan-card'

interface TeamChangePlanDialog {
  teamId: string
  teamBalance: number
  teamPlan: StyroResults['getTeamsTeamIdPlan']['data']['team']['plan']
  plans: StyroResults['getPlans']['data']['plans']
  children: React.ReactNode
}

export function TeamChangePlanDialog({
  teamId,
  teamBalance,
  teamPlan,
  plans,
  children,
}: TeamChangePlanDialog) {
  const [open, setOpen] = useState(false)

  const client = useStyroClient(true)
  const router = useRouter()

  const { message, setMessage } = useCollapsibleMessage()

  const { mutateAsync, isPending, variables } = useMutation({
    mutationKey: ['portal-patchTeamsTeamIdPlan', teamId],
    mutationFn: async (newPlanId: string) => {
      const response = await client.patchTeamsTeamIdPlan({
        teamId,
        patchTeamsTeamIdPlanRequest: {
          newPlanId,
        },
      })

      return response.data
    },
    onSuccess: () => {
      router.refresh()
      setOpen(false)
    },
    onError: async (e: ResponseError) => {
      setMessage({ type: 'error', message: await parseStyroError(e) })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[70vw] !w-max !min-w-0">
        <DialogHeader>
          <DialogTitle>Change Plan</DialogTitle>
          <DialogDescription>
            Upgrade or downgrade your team's subscription.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pb-6" type="always">
          <div className="flex w-max gap-4 px-1">
            {plans.map((plan) => {
              const isPlanPending = isPending && variables === plan.id

              const isSelected = plan.id === teamPlan.id
              const canAfford = teamBalance >= plan.priceUSD

              const buttonText = (() => {
                if (isPlanPending) {
                  return (
                    <span>
                      Pending
                      <Dots />
                    </span>
                  )
                }

                if (isSelected) {
                  return <span>Selected</span>
                }

                return <span>Select</span>
              })()

              const canSelect = !isSelected && canAfford && !isPending

              return (
                <PlanCard key={plan.id} plan={plan} className="min-w-[320px]">
                  <div className="flex flex-col w-full">
                    <CheckerCustom
                      disableWhen={!canAfford && !isSelected}
                      message="Your team has insufficient balance"
                    >
                      {(disabled) => (
                        <CheckerRoleClient
                          message="You must be the owner of the team to change the plan"
                          teamId={teamId}
                          disabled={disabled || isSelected}
                          requiredRole="owner"
                        >
                          {(disabled) => (
                            <Button
                              fullWidth
                              disabled={disabled || !canSelect}
                              onClick={() => mutateAsync(plan.id)}
                            >
                              {buttonText}
                            </Button>
                          )}
                        </CheckerRoleClient>
                      )}
                    </CheckerCustom>
                    <CollapsibleMessage message={message} />
                  </div>
                </PlanCard>
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" className="px-1" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
