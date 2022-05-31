import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { ChainId, CHAINLINK_ORACLE_ADDRESS } from '@sushiswap/core-sdk'
import { CHAINLINK_PRICE_FEED_MAP } from 'app/config/oracles/chainlink'
import { ChainlinkOracle, Oracle } from 'app/features/kashi/oracles'

import { e10 } from './math'

// @ts-ignore TYPE NEEDS FIXING
export function getOracle(chainId: ChainId = ChainId.ETHEREUM, address: string, data: string): Oracle {
  if (address.toLowerCase() === CHAINLINK_ORACLE_ADDRESS[chainId].toLowerCase()) {
    return new ChainlinkOracle(chainId, address, data)
  }
}

const validated: Record<string, boolean> = {}

// @ts-ignore TYPE NEEDS FIXING
export function validateChainlinkOracleData(chainId = ChainId.ETHEREUM, collateral: Token, asset: Token, data: string) {
  const key = `${chainId}-${collateral}-${asset}-${data}`
  if (key in validated) {
    return validated[key]
  }
  const mapping = CHAINLINK_PRICE_FEED_MAP[chainId]
  if (!mapping) {
    return (validated[key] = false)
  }
  const params = defaultAbiCoder.decode(['address', 'address', 'uint256'], data)
  let decimals = 54
  let from = ''
  let to = ''
  if (params[0] !== AddressZero) {
    if (!mapping![params[0]]) {
      // 'One of the Chainlink oracles used is not configured in this UI.'
      console.debug('One of the Chainlink oracles used is not configured in this UI.', { collateral, asset })
      return (validated[key] = false)
    } else {
      decimals -= 18 - mapping![params[0]].decimals
      from = mapping![params[0]].from
      to = mapping![params[0]].to
    }
  }
  if (params[1] !== AddressZero) {
    if (!mapping![params[1]]) {
      // 'One of the Chainlink oracles used is not configured in this UI.'
      console.debug('One of the Chainlink oracles used is not configured in this UI.', collateral, asset)
      return (validated[key] = false)
    } else {
      decimals -= mapping![params[1]].decimals
      if (!to) {
        from = mapping![params[1]].to
        to = mapping![params[1]].from
      } else if (to === mapping![params[1]].to) {
        to = mapping![params[1]].from
      } else {
        // "The Chainlink oracles used don't match up with eachother. If 2 oracles are used, they should have a common token, such as WBTC/ETH and LINK/ETH, where ETH is the common link."
        console.debug(
          "The Chainlink oracles used don't match up with eachother. If 2 oracles are used, they should have a common token, such as WBTC/ETH and LINK/ETH, where ETH is the common link.",
          collateral,
          asset
        )
        return (validated[key] = false)
      }
    }
  }

  if (from === asset.address && to === collateral.address) {
    const needed = collateral.decimals + 18 - asset.decimals
    const divider = e10(decimals - needed)
    if (!divider.eq(params[2])) {
      // 'The divider parameter is misconfigured for this oracle, which leads to rates that are order(s) of magnitude wrong.'
      console.debug(
        'The divider parameter is misconfigured for this oracle, which leads to rates that are order(s) of magnitude wrong.',
        collateral,
        asset
      )

      return (validated[key] = false)
    } else {
      return (validated[key] = true)
    }
  } else {
    // "The Chainlink oracles configured don't match the pair tokens."
    console.debug("The Chainlink oracles configured don't match the pair tokens.", collateral, asset)
    return (validated[key] = false)
  }
}
