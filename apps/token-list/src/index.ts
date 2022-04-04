import { json, urlencoded } from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import fetch from 'isomorphic-fetch'
import { List, Lists, Token } from './types'

const port = process.env.PORT || 5001

let lists: Lists

async function updateLists() {
  try {
    const authHeaders = {
      headers: {
        Authorization: 'Basic' + '',
      },
    }

    let newList: Partial<Lists> = {
      networks: {},
    }

    // Fetches the token-lists folder, gets list of token-lists
    const listTypes = (
      (await fetch(`https://api.github.com/repos/sushiswap/list/contents/lists/token-lists/`, authHeaders).then(
        (data: any) => data.json(),
      )) as any[]
    ).map((entry) => entry.name as string)

    // Need to download all networks for all chains
    for (let listType of listTypes) {
      // Fetches the tokens folder of the token-list, gets list of all networks
      const networks = (
        (await fetch(
          `https://api.github.com/repos/sushiswap/list/contents/lists/token-lists/${listType}/tokens/`,
          authHeaders,
        ).then((data: any) => data.json())) as any[]
      ).map((entry) => (entry.name as string).split('.')[0])

      const queries = []
      for (const network of networks) {
        queries.push(
          fetch(
            `https://raw.githubusercontent.com/sushiswap/list/master/lists/token-lists/${listType}/tokens/${network}.json`,
            authHeaders,
          )
            .then((data) => data.json())
            .then((data) => ({ [network]: data as Token[] })),
        )
      }

      const tokens = (await Promise.all(queries)).reduce((acc, cur) => ({ ...acc, ...cur }))

      Object.keys(tokens).forEach((network) => {
        newList.networks![network] = newList.networks![network] ?? {}
        newList.networks![network][listType] = {
          name: `${listType} - ${network}`,
          timestamp: new Date().toISOString(),
          tags: { network, listType },
          logoURI: 'https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo-256x256.png',
          keywords: ['sushiswap', network, listType],
          tokens: tokens[network],
        }
      })

      // Special case - full compiled default-token-list
      if (listType === 'default-token-list') {
        newList.default = {
          name: 'SushiSwap Menu',
          timestamp: new Date().toISOString(),
          version: {
            major: 0,
            minor: 0,
            patch: 0,
          },
          tags: {},
          logoURI: 'https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo-256x256.png',
          keywords: ['sushiswap', 'default'],
          tokens: Object.values(tokens).reduce((acc, cur) => [...acc, ...cur]),
        }
      }
    }

    lists = newList as Lists
  } catch (error) {
    console.log(error)
  }
}

const app = express()
app
  .disable('x-powered-by')
  .use(morgan('dev'))
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(cors())

app.get('/update', async (req, res) => {
  await updateLists()
  res.sendStatus(200)
})

app.get('/', (req, res) => {
  try {
    res.json(lists.default)
    return
  } catch {
    res.sendStatus(500)
    return
  }
})

app.get('/:network/:listType', (req, res) => {
  const { network, listType }: { network: string; listType: string } = {
    network: req.params.network ?? 'ethereum',
    listType: req.params.listType ?? 'default-token-list',
  }

  let list: List
  try {
    console.log(lists)
    list = lists.networks[network][listType]
    res.json(list)
    return
  } catch {
    res.sendStatus(404)
    return
  }
})

app.listen(port, () => {
  updateLists()
  console.log(`api running on ${port}`)
})
