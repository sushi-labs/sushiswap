import { defaultAbiCoder } from '@ethersproject/abi'
import { keccak256, pack } from '@ethersproject/solidity'

export const computeInitCodeHash = ({
  creationCode,
  deployData,
  masterDeployerAddress,
}: {
  creationCode: string
  deployData: string
  masterDeployerAddress: string
}): string => {
  return keccak256(
    ['bytes'],
    [
      pack(
        ['bytes', 'bytes'],
        [
          creationCode,
          defaultAbiCoder.encode(
            ['bytes', 'address'],
            [deployData, masterDeployerAddress],
          ),
        ],
      ),
    ],
  )
}
