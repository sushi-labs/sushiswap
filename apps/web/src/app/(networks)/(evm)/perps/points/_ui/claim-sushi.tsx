import {
  Button,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
} from '@sushiswap/ui'
import { useMemo, useState } from 'react'

import { PERPS_CLAIM_CHAIN_ID, useClaimPerpsRewards } from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { isSeason1ClaimWindow } from '~evm/perps/leaderboard/season-constants'

export const ClaimSushi = () => {
  const [open, setOpen] = useState(false)
  // const claimRewards = useClaimPerpsRewards({
  //   claim: claim.data,
  //   onClaimSuccess: async () => {
  //     setOpen(false)
  //     await claim.refetch()
  //   },
  // })

  const isClaimWindow = useMemo(() => {
    return isSeason1ClaimWindow()
  }, [])

  if (!isClaimWindow) return null

  return (
    <PerpsDialog open={open} onOpenChange={setOpen}>
      <PerpsDialogTrigger asChild>
        <Button
          variant="perps-default"
          //  disabled={!hasClaimableRewards}
        >
          Claim SUSHI
        </Button>
      </PerpsDialogTrigger>
      <PerpsDialogContent className="lg:max-w-md">
        <PerpsDialogHeader>
          <PerpsDialogTitle className="w-full text-center">
            Claim SUSHI
          </PerpsDialogTitle>
          <PerpsDialogDescription />
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="space-y-4 text-center">
            <div>
              <div className="text-sm text-slate-400">Claimable SUSHI</div>
              <div className="mt-1 text-2xl font-medium">{'123321'} SUSHI</div>
            </div>
            <Checker.Root>
              <Checker.Network
                chainId={PERPS_CLAIM_CHAIN_ID}
                variant="perps-tertiary"
                size="default"
              >
                <Button
                  fullWidth
                  variant="perps-tertiary"
                  // disabled={!claimRewards.isEnabled}
                  // loading={claimRewards.isPending}
                  // onClick={() => void claimRewards.write?.()}
                >
                  Claim
                </Button>
              </Checker.Network>
            </Checker.Root>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
