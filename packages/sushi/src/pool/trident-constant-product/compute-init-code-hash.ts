import type { Address, Hex } from 'viem'
import {
  encodeAbiParameters,
  encodePacked,
  keccak256,
  parseAbiParameters,
} from 'viem/utils'

export const computeInitCodeHash = ({
  creationCode,
  deployData,
  masterDeployerAddress,
}: {
  creationCode: Hex
  deployData: Hex
  masterDeployerAddress: Address
}): string => {
  return keccak256(
    encodePacked(
      ['bytes', 'bytes'],
      [
        creationCode,
        encodeAbiParameters(parseAbiParameters('bytes, address'), [
          deployData,
          masterDeployerAddress,
        ]),
      ],
    ),
  )
}
