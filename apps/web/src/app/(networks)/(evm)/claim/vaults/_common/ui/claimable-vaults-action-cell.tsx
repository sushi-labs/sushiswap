import { ExclamationCircleIcon } from '@heroicons/react-v1/solid'
import { Button, IconButton } from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import { steerFeeManagerAbi } from 'src/lib/steer/abi/steer-fee-manager-abi'
import { STEER_FEE_MANAGER_ADDRESS } from 'src/lib/steer/config'
import type { ChainVaultData } from 'src/lib/steer/hooks/use-claimable-vaults'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { MULTISIG_ADDRESS } from 'sushi/evm'
import { useConnection, useWriteContract } from 'wagmi'

export const ClaimableVaultsActionCell: FC<Row<ChainVaultData>> = ({
  original,
}) => {
  const { address } = useConnection()
  const { writeContract, isPending } = useWriteContract()

  const multisigAddress = MULTISIG_ADDRESS[original.chainId]
  const isMultisig = address?.toLowerCase() === multisigAddress?.toLowerCase()

  // Filter vaults with non-zero fees
  const vaultsWithFees = original.vaults.filter(
    (v) => v.amount0 > 0n || v.amount1 > 0n,
  )

  const handleClaim = () => {
    if (!address || vaultsWithFees.length === 0) return

    const vaultAddresses = vaultsWithFees.map((v) => v.address)
    const feeIdentifiers = vaultsWithFees.map(() => ['STRATEGIST_FEES'])
    const amounts0 = vaultsWithFees.map((v) => [v.amount0])
    const amounts1 = vaultsWithFees.map((v) => [v.amount1])

    writeContract({
      address: STEER_FEE_MANAGER_ADDRESS[original.chainId],
      abi: steerFeeManagerAbi,
      functionName: 'withdrawFeesFromMultipleVaults',
      args: [vaultAddresses, feeIdentifiers, amounts0, amounts1],
    })
  }

  const isDisabled = !isMultisig || vaultsWithFees.length === 0

  return (
    <div className="w-[140px]">
      <Checker.Connect size="default" fullWidth>
        <Checker.Network
          size="default"
          fullWidth
          chainId={original.chainId}
          hideChainName
        >
          <div className="flex gap-1 items-center">
            <Button
              size="default"
              fullWidth
              onClick={handleClaim}
              disabled={isDisabled}
              loading={isPending}
            >
              {isPending ? 'Claiming...' : 'Claim All Fees'}
            </Button>
            {!isMultisig ? (
              <IconButton
                variant="warning"
                description="Must be connected to multisig wallet to claim"
                icon={ExclamationCircleIcon}
                name={''}
              />
            ) : null}
          </div>
        </Checker.Network>
      </Checker.Connect>
    </div>
  )
}
