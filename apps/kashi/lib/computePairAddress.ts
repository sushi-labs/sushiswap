import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { Token } from '@sushiswap/currency'
import { BENTOBOX_ADDRESS } from '@sushiswap/wagmi'
import { KASHI_ADDRESS } from 'config'

export const computePairAddress = ({
  collateral,
  asset,
  oracle,
  oracleData,
}: {
  collateral: Token
  asset: Token
  oracle: string
  oracleData: string
}): string => {
  return getCreate2Address(
    BENTOBOX_ADDRESS[collateral.chainId],
    keccak256(
      ['bytes'],
      [
        defaultAbiCoder.encode(
          ['address', 'address', 'address', 'bytes'],
          [collateral.address, asset.address, oracle, oracleData]
        ),
      ]
    ),
    keccak256(
      ['bytes'],
      [
        '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' +
          KASHI_ADDRESS[collateral.chainId].substring(2) +
          '5af43d82803e903d91602b57fd5bf3',
      ]
    )
  )
}
