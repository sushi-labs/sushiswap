import { ChainId } from '@sushiswap/core-sdk'

// CLASS A

const fetcher = (url: string) =>
  fetch(`${url}${url.endsWith('&') ? '' : '?'}page-size=1000&key=ckey_cba3674f2ce5450f9d5dd29058`)
    .then((res) => res.json())
    .then((data) => data.data)

// @ts-ignore TYPE NEEDS FIXING
export const getTokenBalances = (chainId = ChainId.ETHEREUM, address) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`)

// @ts-ignore TYPE NEEDS FIXING
export const getPortfolio = (chainId = ChainId.ETHEREUM, address) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/address/${address}/portfolio_v2/`)

// @ts-ignore TYPE NEEDS FIXING
export const getTransfers = (chainId = ChainId.ETHEREUM, address) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/address/${address}/transfers_v2/`)

// @ts-ignore TYPE NEEDS FIXING
export const getBlock = (chainId = ChainId.ETHEREUM, blockHeight) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/block_v2/${blockHeight}/`)

// @ts-ignore TYPE NEEDS FIXING
export const getBlockHeights = (chainId = ChainId.ETHEREUM, startDate, endDate) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/block_v2/${startDate}/${endDate}/`)

// @ts-ignore TYPE NEEDS FIXING
export const getLogs = (chainId = ChainId.ETHEREUM, address) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/events/address/${address}/`)

// @ts-ignore TYPE NEEDS FIXING
export const getLogsForTopic = (chainId = ChainId.ETHEREUM, topic) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/events/topics/${topic}/`)

// @ts-ignore TYPE NEEDS FIXING
export const getNftMetadata = (chainId = ChainId.ETHEREUM, address, tokenId) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_metadata/${tokenId}/`)

// @ts-ignore TYPE NEEDS FIXING
export const getNftTokenIds = (chainId = ChainId.ETHEREUM, address) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_token_ids/`)

// @ts-ignore TYPE NEEDS FIXING
export const getNftTransactions = (chainId = ChainId.ETHEREUM, address, tokenId) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_transactions/${tokenId}/`)

// @ts-ignore TYPE NEEDS FIXING
export const getHoldersChanges = (chainId = ChainId.ETHEREUM, address) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders_changes/`)

// @ts-ignore TYPE NEEDS FIXING
export const getTokenHolders = (chainId = ChainId.ETHEREUM, address) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders/`)

// @ts-ignore TYPE NEEDS FIXING
export const getTokenMetadata = (chainId = ChainId.ETHEREUM, id) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/${id}/`)

// @ts-ignore TYPE NEEDS FIXING
export const getTransaction = (chainId = ChainId.ETHEREUM, txHash) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/trasaction_v2/${txHash}/`)

export const getChains = () => fetcher(`https://api.covalenthq.com/v1/chains/`)

export const getChainsStatus = () =>
  fetcher(`https://api.covalenthq.com/v1/chains/status/?key=ckey_cba3674f2ce5450f9d5dd290589`)

// TODO: CLASS B
// @ts-ignore TYPE NEEDS FIXING
export const getSushiSwapLiquidityTransactions = (chainId = ChainId.ETHEREUM, address) =>
  fetcher(`https://api.covalenthq.com/v1/${chainId}/address/${address}/stacks/sushiswap/acts/`)
