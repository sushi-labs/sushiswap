import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { createErrorToast } from '@sushiswap/notifications'
import {
  Button,
  Collapsible,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Message,
  classNames,
} from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useInitiateClaim, useSnapshotCheck } from 'src/lib/migration-claim'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useConnection, useSignTypedData } from 'wagmi'

export const V2MigrationNotice = ({ className }: { className?: string }) => {
  const { address } = useConnection()
  const { data: snapshotCheck } = useSnapshotCheck({ address })
  const [open, setOpen] = useState(false)
  if (!snapshotCheck?.isOnAnySnapshot || !address) return null
  return (
    <Message className={classNames(className ?? '')}>
      <div className="flex items-center justify-between">
        <p className="font-bold whitespace-nowrap">V2 Migration Notice</p>
        <IconButton
          icon={ChevronDownIcon}
          size="xs"
          name="Toggle Swap Details"
          onClick={() => {
            setOpen(!open)
          }}
          className={classNames(
            !open ? '' : 'rotate-180',
            'transition-transform',
          )}
        />
      </div>
      <Collapsible open={open}>
        <div className="flex flex-col md:flex-row gap-4 items-center mt-2">
          <div className="flex flex-col">
            <p>
              If you had LPs staked in a MasterChef or MiniChef contracts, they
              have been migrated to a V3 position. If you would like to claim
              the underlying tokens, use the initiate claim button while
              connected with the wallet that made the LP staking transaction to
              start the claim process and receive the underlying tokens.
            </p>
          </div>

          <ClaimFormDialog />
        </div>
      </Collapsible>
    </Message>
  )
}

const ClaimFormDialog = () => {
  const signTypedData = useSignTypedData()
  const { address, chainId } = useConnection()
  const [open, setOpen] = useState(false)
  const {
    data: snapshotCheck,
    isLoading,
    isError,
  } = useSnapshotCheck({ address })
  const { mutateAsync, isPending } = useInitiateClaim()
  const queryClient = useQueryClient()

  const onSubmit = useCallback(async () => {
    if (!address || !chainId) return

    try {
      const params = {
        types: {
          ClaimRequest: [
            { name: 'requester', type: 'address' },
            { name: 'chainId', type: 'uint256' },
            { name: 'message', type: 'string' },
          ],
        },
        primaryType: 'ClaimRequest' as const,
        message: {
          requester: address.toLowerCase(),
          chainId: chainId,
          message:
            'I am initiating a claim for my migrated V2 staked LPs to receive the underlying tokens.',
        },
      }
      const signature = await signTypedData.mutateAsync(params)
      await mutateAsync(
        {
          address,
          message: params.message.message,
          signature,
          chainId: chainId,
        },
        {
          onSuccess: () => {
            setOpen(false)
          },
        },
      )
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred initiating claim'
      createErrorToast(errorMessage, false)
    } finally {
      queryClient.invalidateQueries({ queryKey: ['useSnapshotCheck', address] })
    }
  }, [address, chainId, signTypedData, mutateAsync, queryClient])

  const infoText = useMemo(() => {
    if (isLoading) return 'Checking snapshot eligibility...'
    if (isError) return 'Error checking snapshot eligibility.'
    if (snapshotCheck?.claimStatus.hasInitiatedClaim) {
      if (snapshotCheck.claimStatus.status === 'pending') {
        return `Claim has been initiated and is currently PENDING. Our support team will be processing your claim, check back for status updates.`
      }
      if (snapshotCheck.claimStatus.status === 'processing') {
        return `Claim has been initiated and is currently PROCESSING. Our support team is working on your claim.`
      }
      if (snapshotCheck.claimStatus.status === 'completed') {
        return `Claim has been COMPLETED for this wallet. The underlying tokens should now be in your wallet.`
      }
    }
    if (snapshotCheck?.isOnAnySnapshot) {
      return 'Connected wallet is eligible to initiate a claim. You will be prompted to sign a message to verify your ownership of this wallet.'
    }
    return 'Connected wallet was not found on our snapshot.'
  }, [isLoading, isError, snapshotCheck])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Checker.Connect fullWidth size="default" namespace="evm">
        <DialogTrigger asChild>
          <Button fullWidth>Initiate Claim</Button>
        </DialogTrigger>
      </Checker.Connect>

      <DialogContent>
        <DialogHeader className="!text-left">
          <DialogTitle>Initiate Claim</DialogTitle>
          <DialogDescription>
            If your wallet is eligible, you can initiate a claim for your
            migrated V2 staked LP.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <p className="font-medium">{infoText}</p>

          <Button
            fullWidth
            type="submit"
            disabled={
              !address ||
              isLoading ||
              isError ||
              !snapshotCheck?.isOnAnySnapshot ||
              snapshotCheck?.claimStatus.hasInitiatedClaim
            }
            loading={isPending}
            size="xl"
            onClick={onSubmit}
          >
            Initiate Claim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
