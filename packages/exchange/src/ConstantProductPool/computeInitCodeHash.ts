import { defaultAbiCoder } from '@ethersproject/abi/lib.esm/index.js'
import { keccak256, pack } from '@ethersproject/solidity/lib.esm/index.js'

export const computeInitCodeHash = ({
  creationCode,
  deployData,
  masterDeployerAddress,
}: {
  creationCode: string
  deployData: string
  masterDeployerAddress: string
}): string =>
  keccak256(
    ['bytes'],
    [
      pack(
        ['bytes', 'bytes'],
        [creationCode, defaultAbiCoder.encode(['bytes', 'address'], [deployData, masterDeployerAddress])]
      ),
    ]
  )
