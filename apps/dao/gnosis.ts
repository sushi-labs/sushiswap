import { ChainId } from '@sushiswap/chain'
import fetch from 'isomorphic-unfetch'

import { SAFES } from './config'
import { Safe, SafeBalance, SafeInfo } from './types'

const getSafeUrl = (safe: Safe): string => {
  if (safe.chainId === ChainId.HARMONY) {
    ;`${safe.baseUrl}/safes/${safe.address}`
  }

  return `${safe.baseUrl}/chains/${safe.chainId}/safes/${safe.address}`
}

export const getSafe = async (chainId: string, address: string): Promise<SafeInfo> => {
  const safe = SAFES[address] ?? undefined
  if (!safe || safe?.chainId.toString() != chainId) {
    throw 'Invalid chain ID or address'
  }
  const url = getSafeUrl(safe)
  const response = await fetch(url)

  if (response.status !== 200) {
    throw String(`${url} returned status code: ${response.status}, ${ChainId[chainId]}, ${safe.address}`)
  }
  const data = await response.json()
  updateSafeFields(data, safe.name, safe.chainId)
  data.balance = 'NA'
  return data as SafeInfo
}

export const getBalance = async (chainId: string, address: string): Promise<SafeBalance> => {
  const safe = SAFES[address] ?? undefined
  if (!safe || safe?.chainId.toString() != chainId) {
    throw String('Invalid chain ID or address')
  }

  if (safe.chainId === ChainId.HARMONY) {
    throw String('Harmony gnosis API does not have balance endpoint')
  }

  const url = `${safe.baseUrl}/chains/${chainId}/safes/${address}/balances/USD/?exclude_spam=true&trusted=false`
  const response = await fetch(url)

  if (response.status !== 200) {
    throw String(`${url} returned status code: ${response.status}, ${ChainId[chainId]}, ${safe.address}`)
  }

  const data = await response.json()
  return { ...data, chainId, address } as SafeBalance
}

/**
 * Some gnosis network have different APIs, this function maps those fields to make the data compatible with @type {SafeInfo}
 * @param data json response
 * @param chainId
 */
function updateSafeFields(data: any, name: string, chainId: ChainId) {
  data.type = name
  if (!data.address?.value) {
    data.address = { value: data.address }
  }

  if (data?.owners?.length && !data.owners[0]?.value) {
    data.owners = data.owners.map((owner) => ({ value: owner }))
  }

  if (!data.chainId) {
    data.chainId = chainId
  }
}
