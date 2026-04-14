'use client'

import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@sushiswap/hooks'
import {
  Button,
  ClipboardController,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import {
  PERPS_CLAIM_CHAIN_ID,
  REFERRAL_REGEX,
  REFERRAL_REGEX_FOR_INPUT,
  currencyFormatter,
  useClaimPerpsRewards,
  useCreateSushiReferralCode,
  useIsSushiReferralAvailable,
  usePerpsClaim,
  useRedeemSushiReferralCode,
  useSushiReferralOverview,
} from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { formatUnits } from 'viem'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'

const PERPS_CLAIM_TOKEN_DECIMALS = 6

export function ReferralsActionBar() {
  const address = useAccount('evm')
  const overview = useSushiReferralOverview({ address })
  const claim = usePerpsClaim({ address })

  const primaryCode = overview.data?.primaryReferralCode?.code
  const hasRedeemedReferralCode =
    overview.data?.hasRedeemedReferralCode ?? false
  const shareLink = primaryCode
    ? `https://sushi.com/perps/invite/${primaryCode}`
    : undefined

  const claimableRewardsValue = useMemo(() => {
    if (!claim.data) {
      return currencyFormatter.format(0)
    }

    return currencyFormatter.format(
      Number(
        formatUnits(
          BigInt(claim.data.claimableAmount),
          PERPS_CLAIM_TOKEN_DECIMALS,
        ),
      ),
    )
  }, [claim.data])

  const hasClaimableRewards = useMemo(() => {
    if (!claim.data) {
      return false
    }

    return BigInt(claim.data.claimableAmount) > 0n
  }, [claim.data])

  const refetchOverview = async () => {
    await overview.refetch()
  }

  return (
    <div className="flex flex-col gap-2 pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-4xl font-medium">Referrals</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <CreateCodeButton
          overviewLoaded={Boolean(overview.data)}
          primaryCode={primaryCode}
          refetchOverview={refetchOverview}
        />
        <RedeemCodeDialog
          overviewLoaded={Boolean(overview.data)}
          hasRedeemedReferralCode={hasRedeemedReferralCode}
        />
        <ClaimRewardsDialog
          claim={claim}
          claimableRewardsValue={claimableRewardsValue}
          hasClaimableRewards={hasClaimableRewards}
        />
        <ShareCodeDialog primaryCode={primaryCode} shareLink={shareLink} />
      </div>
    </div>
  )
}

function CreateCodeButton({
  overviewLoaded,
  primaryCode,
  refetchOverview,
}: {
  overviewLoaded: boolean
  primaryCode?: string
  refetchOverview: () => Promise<void>
}) {
  const createCode = useCreateSushiReferralCode()
  const [open, setOpen] = useState(false)
  const [userInputCode, setUserInputCode] = useState('')
  const debouncedUserInputCode = useDebounce(userInputCode, 250)
  const { data: isReferralAvailable, isLoading } = useIsSushiReferralAvailable({
    code: debouncedUserInputCode,
  })

  if (!overviewLoaded || primaryCode) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="perps-default">Create Code</Button>
      </DialogTrigger>
      <DialogContent variant="perps-default" className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create code</DialogTitle>
          <DialogDescription>
            Create a Sushi referral code for this wallet. This flow is separate
            from Hyperliquid&apos;s referral system.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <input
              className="h-10 w-full rounded-md border border-slate-700 bg-[#0D1421] px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#629FFF]"
              placeholder="SUSHI-ROLL"
              value={userInputCode}
              onChange={(event) =>
                setUserInputCode(event.target.value?.toUpperCase())
              }
              pattern={REFERRAL_REGEX_FOR_INPUT}
            />
            {!isReferralAvailable &&
            !isLoading &&
            REFERRAL_REGEX.test(debouncedUserInputCode) ? (
              <p className="text-xs text-red-500">
                This referral code already exists.
              </p>
            ) : null}
          </div>
          <Button
            variant="perps-default"
            fullWidth
            onClick={async () => {
              await createCode.mutateAsync(
                { code: userInputCode },
                {
                  onSuccess: () => {
                    setUserInputCode('')
                    setOpen(false)
                  },
                },
              )
              await refetchOverview()
            }}
            loading={createCode.isPending}
            disabled={
              !REFERRAL_REGEX.test(userInputCode) || !isReferralAvailable
            }
          >
            Create Code
          </Button>
          <div>
            <div className="bg-accent w-full h-[1px]" />
            <p className="text-xs text-muted-foreground italic mt-2">
              This code can only be created once and cannot be changed, so
              choose wisely!
            </p>
            <p className="text-xs text-muted-foreground italic mt-2">
              Code must be 4-20 characters and can only include uppercase
              letters, numbers, and hyphens.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RedeemCodeDialog({
  overviewLoaded,
  hasRedeemedReferralCode,
}: {
  overviewLoaded: boolean
  hasRedeemedReferralCode: boolean
}) {
  const [open, setOpen] = useState(false)
  const [redeemCode, setRedeemCode] = useState('')
  const redeemCodeMutation = useRedeemSushiReferralCode()
  const handleRedeem = async () => {
    await redeemCodeMutation.mutateAsync({
      code: redeemCode.trim().toUpperCase(),
    })
    setRedeemCode('')
    setOpen(false)
  }
  const isValidCode = REFERRAL_REGEX.test(redeemCode.trim().toUpperCase())

  if (!overviewLoaded || hasRedeemedReferralCode) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="perps-secondary">Enter Code</Button>
      </DialogTrigger>
      <DialogContent variant="perps-default" className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enter referral code</DialogTitle>
          <DialogDescription>
            Redeem a Sushi referral code for this wallet. This flow is separate
            from Hyperliquid&apos;s referral system.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <input
            className="h-10 w-full rounded-md border border-slate-700 bg-[#0D1421] px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#629FFF]"
            placeholder="ABC123"
            value={redeemCode}
            onChange={(event) =>
              setRedeemCode(event.target.value.toUpperCase())
            }
            pattern={REFERRAL_REGEX_FOR_INPUT}
          />
          <PerpsChecker.SimpleDeposit
            fullWidth
            variant="perps-default"
            size="default"
            disabled={!isValidCode}
          >
            <PerpsChecker.EnableTrading
              fullWidth
              variant="perps-default"
              size="default"
              disabled={!isValidCode}
            >
              <Button
                fullWidth
                variant="perps-default"
                disabled={!isValidCode}
                loading={redeemCodeMutation.isPending}
                onClick={() => void handleRedeem()}
              >
                Redeem Code
              </Button>
            </PerpsChecker.EnableTrading>
          </PerpsChecker.SimpleDeposit>
          <div>
            <div className="bg-accent w-full h-[1px]" />
            <p className="text-xs text-muted-foreground italic mt-2">
              Before a code can be redeemed, you must deposit funds into your
              account and enable trading.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ClaimRewardsDialog({
  claim,
  claimableRewardsValue,
  hasClaimableRewards,
}: {
  claim: ReturnType<typeof usePerpsClaim>
  claimableRewardsValue: string
  hasClaimableRewards: boolean
}) {
  const [open, setOpen] = useState(false)
  const claimRewards = useClaimPerpsRewards({
    claim: claim.data,
    onClaimSuccess: async () => {
      setOpen(false)
      await claim.refetch()
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="perps-default" disabled={!hasClaimableRewards}>
          Claim Rewards
        </Button>
      </DialogTrigger>
      <DialogContent variant="perps-default" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="w-full text-center">
            Claim rewards
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="space-y-4 text-center">
          <div>
            <div className="text-sm text-slate-400">Claimable rewards</div>
            <div className="mt-1 text-2xl font-medium">
              {claimableRewardsValue}
            </div>
          </div>
          <Checker.Root>
            <Checker.Network
              chainId={PERPS_CLAIM_CHAIN_ID}
              variant="perps-default"
              size="default"
            >
              <Button
                fullWidth
                variant="perps-default"
                disabled={!claimRewards.isEnabled}
                loading={claimRewards.isPending}
                onClick={() => void claimRewards.write?.()}
              >
                Execute Claim
              </Button>
            </Checker.Network>
          </Checker.Root>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ShareCodeDialog({
  primaryCode,
  shareLink,
}: {
  primaryCode?: string
  shareLink: string | undefined
}) {
  if (!shareLink) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="perps-secondary">Share Code</Button>
      </DialogTrigger>
      <DialogContent variant="perps-default" className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="w-full text-center">Share code</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="space-y-4 text-center">
          <div>
            <div className="text-sm text-slate-400">Your code is</div>
            <div className="mt-1 text-2xl font-medium">{primaryCode}</div>
          </div>
          <ClipboardController hideTooltip>
            {({ setCopied, isCopied }) => (
              <div className="flex justify-center">
                <div className="inline-flex max-w-full items-center gap-2 px-3 py-2">
                  <a
                    className="max-w-[240px] truncate text-center text-sm text-[#629FFF] underline underline-offset-2 sm:max-w-none"
                    href={shareLink}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {shareLink}
                  </a>
                  <button
                    aria-label={
                      isCopied ? 'Copied invite link' : 'Copy invite link'
                    }
                    className="shrink-0 text-slate-400 transition-colors hover:text-white"
                    onClick={() => setCopied(shareLink)}
                    type="button"
                  >
                    {isCopied ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <DocumentDuplicateIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </ClipboardController>
          <p className="text-sm text-slate-400">
            You will receive 20% of referred users&apos; fees.
          </p>
          <div>
            <div className="bg-accent w-full h-[1px]" />
            <p className="text-xs text-muted-foreground italic mt-2 text-left">
              Before a code can be redeemed, the user must have funds deposited
              into their account and have enabled trading.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
