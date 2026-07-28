import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  Button,
  Currency,
  Dots,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
} from '@sushiswap/ui'
import { useCallback, useMemo, useState } from 'react'
import { logger } from 'src/lib/logger'
import { PERPS_CLAIM_CHAIN_ID, usePointClaimProof } from 'src/lib/perps'
import { extractGraphQLErrorMessage } from 'src/lib/perps/sushi-referral'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { formatNumber } from 'sushi'
import { type EvmAddress, SUSHI } from 'sushi/evm'
import { zeroAddress } from 'viem'
import {
  useConnection,
  usePublicClient,
  useReadContracts,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'

const CLAIM_CONTRACT_ADDRESS =
  '0xeabe255649297FFB86F7651Ee81D943ad28452BF' satisfies EvmAddress

export const ClaimSushi = () => {
  const [open, setOpen] = useState(false)
  const [isReceiptPending, setIsReceiptPending] = useState(false)
  const address = useAccount('evm')
  const { chainId } = useConnection()
  const client = usePublicClient()
  const {
    data: claimProofData,
    isLoading: isClaimProofLoading,
    error,
  } = usePointClaimProof({
    season: 'SEASON_1',
    address,
  })
  const {
    data: contractData,
    isLoading: isClaimStatusLoading,
    refetch: refetchClaimStatus,
  } = useReadContracts({
    contracts: [
      {
        address: CLAIM_CONTRACT_ADDRESS,
        abi,
        chainId: PERPS_CLAIM_CHAIN_ID,
        functionName: 'claimEndDate',
      },
      {
        address: CLAIM_CONTRACT_ADDRESS,
        abi,
        chainId: PERPS_CLAIM_CHAIN_ID,
        functionName: 'hasClaimed',
        args: [address ?? zeroAddress],
      },
    ],
    query: {
      enabled: Boolean(address),
    },
  })

  const { claimEndDate, hasClaimed } = useMemo(() => {
    const claimEndDateResult = contractData?.[0]?.result
    const hasClaimedResult = contractData?.[1]?.result

    return {
      claimEndDate:
        typeof claimEndDateResult === 'bigint' ? claimEndDateResult : 0n,
      hasClaimed: hasClaimedResult === true,
    }
  }, [contractData])

  const isClaimWindowOpen =
    claimEndDate > 0n && Date.now() / 1000 <= Number(claimEndDate)

  const { data: simulation, isLoading: isSimulationLoading } =
    useSimulateContract({
      address: CLAIM_CONTRACT_ADDRESS,
      abi,
      chainId: PERPS_CLAIM_CHAIN_ID,
      functionName: 'claim',
      args: [
        BigInt(claimProofData?.amount || '0'),
        claimProofData?.proof || [],
      ],
      query: {
        enabled: Boolean(
          address &&
            chainId === PERPS_CLAIM_CHAIN_ID &&
            isClaimWindowOpen &&
            !hasClaimed &&
            Boolean(claimProofData?.amount && claimProofData?.proof?.length),
        ),
      },
    })

  const handleClaimSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      if (!address || !client) {
        return
      }

      const receipt = client.waitForTransactionReceipt({ hash })
      const timestamp = Date.now()

      setIsReceiptPending(true)

      void receipt
        .then(async () => {
          await refetchClaimStatus()
          setOpen(false)
        })
        .catch((error: unknown) => {
          logger.error(error, {
            location: 'ClaimSushi',
            action: 'waitForReceipt',
          })
        })
        .finally(() => {
          setIsReceiptPending(false)
        })

      void createToast({
        account: address,
        type: 'approval',
        chainId: PERPS_CLAIM_CHAIN_ID,
        txHash: hash,
        promise: receipt,
        summary: {
          pending: `Claiming ${claimProofData?.displayAmount} SUSHI`,
          completed: `Successfully claimed ${claimProofData?.displayAmount} SUSHI`,
          failed: `Something went wrong claiming ${claimProofData?.displayAmount} SUSHI`,
        },
        groupTimestamp: timestamp,
        timestamp,
        variant: 'perps',
      })
    },
    [address, client, refetchClaimStatus, claimProofData?.displayAmount],
  )

  const handleClaimError = useCallback((error: Error) => {
    if (isUserRejectedError(error)) {
      return
    }

    logger.error(error, {
      location: 'ClaimSushi',
      action: 'claimError',
    })
    createErrorToast(error.message, true, 'perps')
  }, [])

  const { mutateAsync: writeContractAsync, isPending: isWritePending } =
    useWriteContract({
      mutation: {
        onSuccess: handleClaimSuccess,
        onError: handleClaimError,
      },
    })

  const handleClaim = useCallback(async () => {
    if (!simulation?.request) {
      return
    }

    try {
      await writeContractAsync(simulation.request)
    } catch {}
  }, [simulation?.request, writeContractAsync])

  const endDateString = useMemo(() => {
    if (claimEndDate === 0n) {
      return ''
    }

    const endDate = new Date(Number(claimEndDate) * 1000)
    return `${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString()}`
  }, [claimEndDate])

  const claimEnded = useMemo(() => {
    if (claimEndDate === 0n) {
      return false
    }

    return Date.now() / 1000 > Number(claimEndDate)
  }, [claimEndDate])

  const isClaimPending = isWritePending || isReceiptPending
  const isClaimButtonLoading = isSimulationLoading || isClaimPending

  const parsedGraphqlError = useMemo(() => {
    if (!error) {
      return null
    }
    if (error instanceof Error) {
      return extractGraphQLErrorMessage(error.message)
    }

    return 'Something went wrong fetching claim details'
  }, [error])

  return (
    <PerpsDialog open={open} onOpenChange={setOpen}>
      <PerpsDialogTrigger asChild>
        <Button variant="perps-default" disabled={isClaimStatusLoading}>
          Claim SUSHI
        </Button>
      </PerpsDialogTrigger>
      <PerpsDialogContent className="lg:max-w-md">
        <PerpsDialogHeader>
          <PerpsDialogTitle className="w-full text-center">
            Claim SUSHI
          </PerpsDialogTitle>
          <PerpsDialogDescription>
            Claim your SUSHI from points earned in Season 1.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="space-y-4 text-center">
            {isClaimStatusLoading || isClaimProofLoading ? (
              <div className="pb-4 text-sm text-slate-400">
                <Dots>Loading claim details</Dots>
              </div>
            ) : claimEndDate === 0n ? (
              <div className="pb-4 text-sm text-slate-400">
                Claim window has not opened yet. Claiming will open August 1,
                2026.
              </div>
            ) : claimEnded ? (
              <div className="pb-4 text-sm text-slate-400">
                Claim window has ended. Continue trading Perps to earn points
                for the next season!
              </div>
            ) : parsedGraphqlError ? (
              <div className="pb-4 text-sm text-slate-400">
                {parsedGraphqlError}
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-center">
                    <Currency.Icon width={42} height={42} currency={SUSHI[1]} />
                  </div>
                  {hasClaimed ? (
                    <div className="mt-1 text-lg font-medium">
                      Already claimed{' '}
                      {formatNumber(claimProofData?.displayAmount || '0', 6)}{' '}
                      SUSHI
                    </div>
                  ) : (
                    <div className="mt-1 text-2xl font-medium">
                      {formatNumber(claimProofData?.displayAmount || '0', 6)}{' '}
                      SUSHI
                    </div>
                  )}
                  <p className="text-xs text-slate-400">
                    Season 1 claim window ends {endDateString}.
                  </p>
                </div>
                <Checker.Root>
                  <Checker.Connect
                    variant="perps-tertiary"
                    size="default"
                    namespace="evm"
                  >
                    <Checker.Network
                      chainId={PERPS_CLAIM_CHAIN_ID}
                      variant="perps-tertiary"
                      size="default"
                    >
                      <Button
                        fullWidth
                        variant="perps-tertiary"
                        disabled={
                          hasClaimed ||
                          !simulation?.request ||
                          isClaimButtonLoading
                        }
                        loading={isClaimButtonLoading}
                        onClick={() => void handleClaim()}
                      >
                        {hasClaimed ? 'Claimed' : 'Claim'}
                      </Button>
                    </Checker.Network>
                  </Checker.Connect>
                </Checker.Root>
              </>
            )}
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}

const abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]',
      },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimEndDate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasClaimed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
