import { initializeConnector } from '@web3-react/core'
import { Network } from '@web3-react/network'
import { URLS } from 'config/networks'

type CookieName = string
type Value = string

const getCookies = (): Record<CookieName, Value> =>
  decodeURIComponent(document.cookie)
    .split('; ')
    .map((str) => str.split('='))
    .reduce<Record<CookieName, Value>>((acc, [name, val]) => {
      if (name && val) {
        acc[name] = val
      }
      return acc
    }, {})

function getCookie(key: string) {
  const cookies = getCookies()
  return cookies[key]
}

export const [network, hooks] = initializeConnector<Network>(
  (actions) => {
    const provider = new Network(actions, URLS, false)
    void provider.activate(Number(getCookie('chain-id')))
    return provider
  },
  Object.keys(URLS).map((chainId) => Number(chainId)),
)
