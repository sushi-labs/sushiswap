import { ChainId, ChainKey } from '@sushiswap/chain'
import { formatUSD } from '@sushiswap/format'
import { CHAIN_NAME, SushiSwapChainId, TridentChainId } from '@sushiswap/graph-config'
import Cors from 'cors'
import { ethers } from 'ethers'
import stringify from 'fast-json-stable-stringify'
import { getOctokit, Token } from 'app/partner/lib'
import type { NextApiRequest, NextApiResponse } from 'next'

interface Body {
  tokenAddress: string
  tokenData: Token
  tokenIcon: string
  chainId: ChainId
  listType: 'default-token-list' | 'community-token-list'
}

const owner = 'sushiswap'

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

// TODO: Zod validation
// import { z } from "zod";
// const schema = z.object({
//     tokenAddress: ,
//     tokenData: ,
//     tokenIcon: ,
//     chainId: ,
//     listType: ,
// })

// TODO: Clean up by extracting octokit calls
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors)

  if (!process.env.TOKEN_LIST_PR_WEBHOOK_URL) throw new Error('TOKEN_LIST_PR_WEBHOOK_URL undefined')
  if (!process.env.OCTOKIT_KEY) throw new Error('OCTOKIT_KEY undefined')

  const { tokenAddress, tokenData, tokenIcon, chainId, listType } = req.body as Body

  if (
    tokenData?.decimals === undefined ||
    !tokenData.name ||
    !tokenData.symbol ||
    !tokenIcon ||
    !listType ||
    !chainId
  ) {
    res.status(500).json({ error: 'Invalid data submitted.' })
    return
  }

  const checksummedAddress = ethers.utils.getAddress(tokenAddress)

  const octokit = getOctokit(process.env.OCTOKIT_KEY)

  // Get latest commit for the new branch
  const {
    data: {
      commit: { sha: latestIconsSha },
    },
  } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
    owner,
    repo: 'list',
    branch: 'master',
  })

  // Filter out characters that github / ... might not like
  const displayName = tokenData.symbol.toLowerCase().replace(/( )|(\.)/g, '_')

  // Find unused branch name
  const branch = await (async function () {
    const branches: string[] = []

    for (let i = 1; ; i++) {
      // @ts-ignore
      const { data }: { data: { name: string }[] } = await octokit.request('GET /repos/{owner}/{repo}/branches', {
        owner,
        repo: 'list',
        per_page: 100,
        page: i,
      })

      const newBranches = data.reduce((acc: string[], e: { name: string }) => [...acc, e.name], [] as string[])

      branches.push(...newBranches)

      if (newBranches.length < 100) break
    }

    const createBranchName = (name: string, depth = 0): string => {
      if (!branches.includes(name)) return name
      else if (!branches.includes(`${name}-${depth}`)) return `${name}-${depth}`
      else return createBranchName(name, ++depth)
    }

    return createBranchName(displayName)
  })()

  // Create new branch
  await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
    owner,
    repo: 'list',
    ref: `refs/heads/${branch}`,
    sha: latestIconsSha,
  })

  const imagePath = `logos/token-logos/network/${ChainKey[chainId].toLowerCase()}/${checksummedAddress}.jpg`

  try {
    // Figure out if image already exists, overwrite if it does
    let previousImageFileSha: string | undefined

    try {
      ;({
        data: { sha: previousImageFileSha },
        // @ts-ignore
      } = (await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo: 'list',
        branch: 'master',
        path: imagePath,
      })) as any)
    } catch {
      //
    }

    // Upload image
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo: 'list',
      branch: branch,
      path: imagePath,
      content: tokenIcon.split(',')[1],
      message: `Upload ${displayName} icon`,
      sha: previousImageFileSha,
    })
  } catch (e) {
    res.status(500).json({ error: 'Failed to add token image' })
    return
  }

  const listPath = `lists/token-lists/${listType}/tokens/${ChainKey[chainId].toLowerCase()}.json`

  // Get current token list to append to
  let currentListData: { sha: string; content: any } | undefined

  try {
    // @ts-ignore
    ;({ data: currentListData } = (await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo: 'list',
      branch: 'master',
      path: listPath,
    })) as any)
  } catch {
    //
  }

  let currentList: any[] = currentListData
    ? JSON.parse(Buffer.from(currentListData?.content, 'base64').toString('ascii'))
    : []

  // Remove from current list if exists to overwrite later
  currentList = currentList.filter((entry) => entry.address !== checksummedAddress)

  // Append to current list
  const newList = [
    ...currentList,
    {
      address: checksummedAddress,
      chainId: chainId,
      decimals: Number(tokenData.decimals),
      logoURI: `https://raw.githubusercontent.com/${owner}/list/master/${imagePath}`,
      name: tokenData.name,
      symbol: tokenData.symbol,
    },
  ].sort((a, b) => a.symbol.localeCompare(b.symbol))

  // Upload new list
  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo: 'list',
    branch: branch,
    path: listPath,
    content: Buffer.from(JSON.stringify(newList, null, 2)).toString('base64'),
    message: `Add ${displayName} on ${CHAIN_NAME[chainId].toLowerCase()}`,
    sha: currentListData?.sha,
  })

  // const exchangeData = await getTokenKPI(tokenAddress, chainId as Extract<ChainId, SushiSwapChainId & TridentChainId>)
  // Volume: ${formatUSD(exchangeData?.volumeUSD ?? 0)}
  // Liquidity: ${formatUSD(exchangeData?.liquidityUSD ?? 0)}

  // Open List PR
  const {
    data: { html_url: listPr },
  } = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
    owner,
    repo: 'list',
    title: `Token: ${displayName}`,
    head: branch,
    base: 'master',
    body: `Chain: ${CHAIN_NAME[chainId] ?? chainId}
      Name: ${tokenData.name}
      Symbol: ${tokenData.symbol}
      Decimals: ${tokenData.decimals}
      List: ${listType}
      Volume: ${formatUSD(0)}
      Liquidity: ${formatUSD(0)}
      CoinGecko: ${await getCoinGecko(chainId, checksummedAddress)}
      Image: https://github.com/${owner}/list/tree/${branch}/${imagePath}
      ![${displayName}](https://raw.githubusercontent.com/${owner}/list/${branch}/${imagePath})
    `,
  })

  // Send Discord notification using webhook
  await fetch(process.env.TOKEN_LIST_PR_WEBHOOK_URL, {
    method: 'POST',
    body: stringify({
      content: null,
      embeds: [
        {
          description: 'New pull request',
          color: 5814783,
          author: {
            name: `${tokenData.name} - ${CHAIN_NAME[chainId]}`,
            url: listPr,
            icon_url: `https://raw.githubusercontent.com/${owner}/list/${branch}/${imagePath}`,
          },
        },
      ],
      username: 'GitHub List Repo',
      avatar_url:
        'https://banner2.cleanpng.com/20180824/jtl/kisspng-computer-icons-logo-portable-network-graphics-clip-icons-for-free-iconza-circle-social-5b7fe46b0bac53.1999041115351082030478.jpg',
    }),
    headers: { 'Content-Type': 'application/json' },
  })

  res.status(200).json({ listPr })
}

export default handler

async function getCoinGecko(chainId: ChainId, address: string) {
  return await fetch(`https://api.coingecko.com/api/v3/coins/${CHAIN_NAME[chainId].toLowerCase()}/contract/${address}`)
    .then((data) => data.json())
    .then((data) => (data.id ? `https://www.coingecko.com/en/coins/${data.id}` : 'Not Found'))
}
