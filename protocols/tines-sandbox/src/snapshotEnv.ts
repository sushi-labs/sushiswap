import { SnapshotRestorer } from '@nomicfoundation/hardhat-network-helpers'
import { EthereumProvider } from 'hardhat/types'

export async function takeSnapshotEnv(
  provider: EthereumProvider,
): Promise<SnapshotRestorer> {
  let snapshotId = await provider.request({
    method: 'evm_snapshot',
  })

  if (typeof snapshotId !== 'string') {
    throw new Error(
      'Assertion error: the value returned by evm_snapshot should be a string',
    )
  }

  return {
    restore: async () => {
      const reverted = await provider.request({
        method: 'evm_revert',
        params: [snapshotId],
      })

      if (typeof reverted !== 'boolean') {
        throw new Error(
          'Assertion error: the value returned by evm_revert should be a boolean',
        )
      }

      if (!reverted) {
        throw new Error('Invalid snapshot')
      }

      // re-take the snapshot so that `restore` can be called again
      snapshotId = await provider.request({
        method: 'evm_snapshot',
      })
    },
    snapshotId,
  }
}
