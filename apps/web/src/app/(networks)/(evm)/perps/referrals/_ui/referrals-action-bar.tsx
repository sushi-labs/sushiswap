'use client'

import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@sushiswap/hooks'
import {
  Button,
  ClipboardController,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
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
import { getReferralShareFeePercent } from './referral-share-fee'

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
  const shareFeePercent = getReferralShareFeePercent(
    overview.data?.activeFeeLevels,
  )

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
        <ShareCodeDialog
          primaryCode={primaryCode}
          shareLink={shareLink}
          shareFeePercent={shareFeePercent}
        />
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
    <PerpsDialog open={open} onOpenChange={setOpen}>
      <PerpsDialogTrigger asChild>
        <Button variant="sushi-gradient">Create Code</Button>
      </PerpsDialogTrigger>
      <PerpsDialogContent className="lg:max-w-md">
        <PerpsDialogHeader>
          <PerpsDialogTitle>Create code</PerpsDialogTitle>
          <PerpsDialogDescription>
            Create a Sushi referral code for this wallet. This flow is separate
            from Hyperliquid&apos;s referral system.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="space-y-3">
            <div className="space-y-1">
              <input
                className="h-10 w-full rounded-md border border-[#FFFFFF1A] bg-transparent px-3 text-sm text-white outline-none "
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
              variant="perps-tertiary"
              fullWidth
              onClick={async () => {
                await createCode.mutateAsync(
                  { code: userInputCode },
                  {
                    onSuccess: async () => {
                      setUserInputCode('')
                      setOpen(false)
                      await refetchOverview()
                    },
                  },
                )
              }}
              loading={createCode.isPending}
              disabled={
                !REFERRAL_REGEX.test(userInputCode) || !isReferralAvailable
              }
            >
              Create Code
            </Button>
            <div>
              <p className="text-xs text-perps-muted-50 italic mt-2">
                This code can only be created once and cannot be changed, so
                choose wisely!
              </p>
              <p className="text-xs text-perps-muted-50 italic mt-2">
                Code must be 6-20 characters and can only include uppercase
                letters, numbers, and hyphens.
              </p>
            </div>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
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
    <PerpsDialog open={open} onOpenChange={setOpen}>
      <PerpsDialogTrigger asChild>
        <Button variant="perps-secondary">Enter Code</Button>
      </PerpsDialogTrigger>
      <PerpsDialogContent className="lg:max-w-md">
        <PerpsDialogHeader>
          <PerpsDialogTitle>Enter referral code</PerpsDialogTitle>
          <PerpsDialogDescription>
            Redeem a Sushi referral code for this wallet. This flow is separate
            from Hyperliquid&apos;s referral system.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="space-y-3">
            <input
              className="h-10 w-full rounded-md border border-[#FFFFFF1A] bg-transparent px-3 text-sm text-white outline-none "
              placeholder="ABC123"
              value={redeemCode}
              onChange={(event) =>
                setRedeemCode(event.target.value.toUpperCase())
              }
              pattern={REFERRAL_REGEX_FOR_INPUT}
            />
            <PerpsChecker.SimpleDeposit
              fullWidth
              variant="perps-tertiary"
              size="default"
              disabled={!isValidCode}
            >
              <PerpsChecker.EnableTrading
                fullWidth
                variant="perps-tertiary"
                size="default"
                disabled={!isValidCode}
              >
                <Button
                  fullWidth
                  variant="perps-tertiary"
                  disabled={!isValidCode}
                  loading={redeemCodeMutation.isPending}
                  onClick={() => void handleRedeem()}
                >
                  Redeem Code
                </Button>
              </PerpsChecker.EnableTrading>
            </PerpsChecker.SimpleDeposit>
            <div>
              <p className="text-xs text-perps-muted-50 italic mt-2">
                Before a code can be redeemed, you must deposit funds into your
                account and enable trading.
              </p>
            </div>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
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
    <PerpsDialog open={open} onOpenChange={setOpen}>
      <PerpsDialogTrigger asChild>
        <Button variant="perps-default" disabled={!hasClaimableRewards}>
          Claim Rewards
        </Button>
      </PerpsDialogTrigger>
      <PerpsDialogContent className="lg:max-w-md">
        <PerpsDialogHeader>
          <PerpsDialogTitle className="w-full text-center">
            Claim rewards
          </PerpsDialogTitle>
          <PerpsDialogDescription />
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
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
                variant="perps-tertiary"
                size="default"
              >
                <Button
                  fullWidth
                  variant="perps-tertiary"
                  disabled={!claimRewards.isEnabled}
                  loading={claimRewards.isPending}
                  onClick={() => void claimRewards.write?.()}
                >
                  Execute Claim
                </Button>
              </Checker.Network>
            </Checker.Root>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}

function ShareCodeDialog({
  primaryCode,
  shareLink,
  shareFeePercent,
}: {
  primaryCode?: string
  shareLink: string | undefined
  shareFeePercent: number
}) {
  if (!shareLink) {
    return null
  }

  return (
    <PerpsDialog>
      <PerpsDialogTrigger asChild>
        <Button variant="perps-secondary">Share Code</Button>
      </PerpsDialogTrigger>
      <PerpsDialogContent className="max-w-lg">
        <PerpsDialogHeader>
          <PerpsDialogTitle className="w-full text-center">
            Share code
          </PerpsDialogTitle>
          <PerpsDialogDescription />
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
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
              You will receive {shareFeePercent}% of referred users&apos; fees.
            </p>
            <div>
              <div className="bg-accent w-full h-[1px]" />
              <p className="text-xs text-muted-foreground italic mt-2 text-left">
                Before a code can be redeemed, the user must have funds
                deposited into their account and have enabled trading.
              </p>
            </div>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
