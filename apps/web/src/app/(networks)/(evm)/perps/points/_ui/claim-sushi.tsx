import { createErrorToast, createToast } from '@sushiswap/notifications'
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
import { useCallback, useMemo, useState } from 'react'
import { logger } from 'src/lib/logger'
import { PERPS_CLAIM_CHAIN_ID } from 'src/lib/perps'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import { type Hex, formatUnits, zeroAddress } from 'viem'
import {
  useConnection,
  usePublicClient,
  useReadContracts,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'

const CLAIM_CONTRACT_ADDRESS =
  '0xE156D33dE305026D8B74BC00373bE5AbDD01325c' satisfies EvmAddress

const CLAIM_PROOF = [
  '0x3430cdd41a49ca09e7cb22202438f8e76482327ce1f7d4a4de77dc3eba693286',
  '0xbe4bc311b0c9abbe7ac4e0f63d44cafc9a693349d49bcee3946c2e4f3e61d5e7',
  '0x5dde247742925a471b55911b1270d57182984a6a51f7288cc80a227a65dfe7c6',
  '0x46564d618650d169ad556d11d6a0fbb5c6182d89cd2fd3d6c5584308fed561c0',
  '0xa959d4adabdcf2260deac2023c459677df9977b1194f74178160d34e5934c00f',
  '0xc3435f0c69a1be615ed2709ee9bf24a435229a6e377f35271bbbfa82f6715515',
  '0xcad9f9ad8c4f93f2e649f9a904abceece95bb3556819ec65ec7e03ebfc5403b4',
] as const satisfies readonly Hex[]

const CLAIM_AMOUNT = 31_206_759_036_261_103_062n
const CLAIM_AMOUNT_FORMATTED = formatUnits(CLAIM_AMOUNT, 18)

export const ClaimSushi = () => {
  const [open, setOpen] = useState(false)
  const [isReceiptPending, setIsReceiptPending] = useState(false)
  const address = useAccount('evm')
  const { chainId } = useConnection()
  const client = usePublicClient()
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
      args: [CLAIM_AMOUNT, CLAIM_PROOF],
      query: {
        enabled: Boolean(
          address &&
            chainId === PERPS_CLAIM_CHAIN_ID &&
            isClaimWindowOpen &&
            !hasClaimed,
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
          pending: `Claiming ${CLAIM_AMOUNT_FORMATTED} SUSHI`,
          completed: `Successfully claimed ${CLAIM_AMOUNT_FORMATTED} SUSHI`,
          failed: `Something went wrong claiming ${CLAIM_AMOUNT_FORMATTED} SUSHI`,
        },
        groupTimestamp: timestamp,
        timestamp,
        variant: 'perps',
      })
    },
    [address, client, refetchClaimStatus],
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

  const isClaimPending = isWritePending || isReceiptPending
  const isClaimButtonLoading = isSimulationLoading || isClaimPending

  if (!isClaimStatusLoading && !isClaimWindowOpen) {
    return null
  }

  return (
    <PerpsDialog open={open} onOpenChange={setOpen}>
      <PerpsDialogTrigger asChild>
        <Button
          variant="perps-default"
          disabled={isClaimStatusLoading}
          loading={isClaimStatusLoading}
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
            {isClaimStatusLoading ? (
              <div className="py-4 text-sm text-slate-400">
                Loading claim details...
              </div>
            ) : (
              <>
                <div>
                  <div className="text-sm text-slate-400">
                    Claimable SUSHI from points earned in Season 1
                  </div>
                  {hasClaimed ? (
                    <div className="mt-1 text-lg font-medium">
                      Already claimed {CLAIM_AMOUNT_FORMATTED} SUSHI
                    </div>
                  ) : (
                    <div className="mt-1 text-2xl font-medium">
                      {CLAIM_AMOUNT_FORMATTED} SUSHI
                    </div>
                  )}
                  <p className="text-xs text-slate-400">
                    There is a 30 day claim window. After {endDateString}, you
                    will no longer be able to claim your SUSHI.
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
