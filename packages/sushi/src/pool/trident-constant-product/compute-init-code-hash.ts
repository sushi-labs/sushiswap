import { defaultAbiCoder } from '@ethersproject/abi'
import type { Hex } from 'viem'
import { encodePacked, keccak256 } from 'viem/utils'

export const computeInitCodeHash = ({
  creationCode,
  deployData,
  masterDeployerAddress,
}: {
  creationCode: Hex
  deployData: string
  masterDeployerAddress: string
}): string => {
  return keccak256(
    encodePacked(
      ['bytes', 'bytes'],
      [
        creationCode,
        defaultAbiCoder.encode(
          ['bytes', 'address'],
          [deployData, masterDeployerAddress],
        ) as Hex,
      ],
    ),
  )
}
