import { uniq } from 'lodash'

import { ZERION_API, ZERION_API_KEY } from './constants'

const fetcher: any = (queries: string[]) => {
  return new Promise((resolve, reject) => {
    const openQueries = uniq(queries.map((query) => `${query.split(',')[0]}`))
    let doneQueries = 0
    let data: any = {}

    const webSocket = new WebSocket(`${ZERION_API}/?api_token=${ZERION_API_KEY}&EIO=3&transport=websocket`)
    webSocket.addEventListener('message', (event) => {
      if ((event.data as string).startsWith('40')) {
        const openData = event.data.replace('40/', '').split(',')[0]
        const readyQueries = queries.filter((query) => query.startsWith(openData))
        if (readyQueries.length === 0) return
        readyQueries.forEach((query) => webSocket.send(`42/${query}`))
      }
      if ((event.data as string).startsWith('42')) {
        doneQueries++

        data = {
          ...data,
          [JSON.parse(event.data.split(/,(.+)/)[1])[0]]: JSON.parse(event.data.split(/,(.+)/)[1])[1].payload,
        }
        if (doneQueries === queries.length) {
          webSocket.close()
          resolve(data)
        }
      }
    })
    webSocket.addEventListener('error', (event) => {
      console.log('error fetching assets: ', event)
      reject(event)
    })
    webSocket.addEventListener('open', () => {
      openQueries.forEach((openQuery) => {
        webSocket.send(`40/${openQuery},`)
      })
    })
  })
}

export const getAssets = async (account: string) => {
  const query = [
    `address,["subscribe",{"scope":["assets"],"payload":{"address":"${account}","currency":"usd"}}]`,
    `address,["subscribe",{"scope":["polygon-assets"],"payload":{"address":"${account}","currency":"usd"}}]`,
    `address,["subscribe",{"scope":["bsc-assets"],"payload":{"address":"${account}","currency":"usd"}}]`,
  ]

  enum Networks {
    assets = 'Mainnet',
    'polygon-assets' = 'Matic',
    'bsc-assets' = 'BSC',
  }

  const assets = await fetcher(query)

  return Object.keys(assets)
    .map((key) => {
      // @ts-ignore TYPE NEEDS FIXING
      const network = Networks[key.split(' ')[2]]
      return Object.values(assets[key][Object.keys(assets[key])[0]]).map((asset: any) => {
        return {
          ...asset.asset,
          quantity: asset.quantity,
          network,
        }
      })
    })
    .reduce((a, b) => [...a, ...b], [])
}
