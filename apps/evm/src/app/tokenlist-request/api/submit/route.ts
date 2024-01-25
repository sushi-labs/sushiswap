import { createAppAuth } from '@octokit/auth-app'
import { CHAIN_NAME } from '@sushiswap/graph-config'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import stringify from 'fast-json-stable-stringify'
import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from 'octokit'
import { ChainId, ChainKey } from 'sushi/chain'
import { formatUSD } from 'sushi/format'

import { ApplyForTokenListTokenSchemaType } from '../../schema'

const owner = 'sushiswap'

interface ListEntry {
  address: string
  chainId: number
  decimals: number
  logoURI: string
  name: string
  symbol: string
}

interface MutationParams extends ApplyForTokenListTokenSchemaType {
  tokenName?: string
  tokenSymbol: string
  tokenDecimals: number
}

// To allow for development without rate limiting
let ratelimit: Ratelimit | undefined
try {
  if (!process.env.UPSTASH_REDIS_REST_URL)
    throw new Error('UPSTASH_REDIS_REST_URL undefined')
  if (!process.env.UPSTASH_REDIS_REST_TOKEN)
    throw new Error('UPSTASH_REDIS_REST_TOKEN undefined')

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
  })
} catch {
  console.warn('Rate limit not enabled')
}

export const maxDuration = 15 // in seconds

export async function POST(request: NextRequest) {
  if (ratelimit) {
    const { remaining } = await ratelimit.limit(request.ip || '127.0.0.1')
    if (!remaining) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  if (!process.env.TOKEN_LIST_PR_WEBHOOK_URL)
    throw new Error('TOKEN_LIST_PR_WEBHOOK_URL undefined')
  if (!process.env.OCTOKIT_KEY) throw new Error('OCTOKIT_KEY undefined')

  const {
    tokenAddress,
    tokenName,
    tokenDecimals,
    tokenSymbol,
    logoFile,
    chainId,
    listType,
  } = (await request.json()) as MutationParams

  const octoKit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: 169875,
      privateKey: process.env.OCTOKIT_KEY?.replace(/\\n/g, '\n'),
      installationId: 23112528,
    },
  })

  // Get latest commit for the new branch
  const {
    data: {
      commit: { sha: latestIconsSha },
    },
  } = await octoKit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
    owner,
    repo: 'list',
    branch: 'master',
  })

  // Filter out characters that github / ... might not like
  const displayName = tokenSymbol.toLowerCase().replace(/( )|(\.)/g, '_')

  // Find unused branch name
  const branch = await (async function () {
    const branches: string[] = []

    for (let i = 1; ; i++) {
      const { data }: { data: { name: string }[] } = await octoKit.request(
        'GET /repos/{owner}/{repo}/branches',
        {
          owner,
          repo: 'list',
          per_page: 100,
          page: i,
        },
      )

      const newBranches = data.reduce((acc: string[], e: { name: string }) => {
        acc.push(e.name)
        return acc
      }, [] as string[])

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
  await octoKit.request('POST /repos/{owner}/{repo}/git/refs', {
    owner,
    repo: 'list',
    ref: `refs/heads/${branch}`,
    sha: latestIconsSha,
  })

  const imagePath = `logos/token-logos/network/${ChainKey[
    chainId
  ].toLowerCase()}/${tokenAddress}.jpg`

  try {
    // Figure out if image already exists, overwrite if it does
    let previousImageFileSha: string | undefined

    try {
      const res = await octoKit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          owner,
          repo: 'list',
          branch: 'master',
          path: imagePath,
        },
      )

      if (!Array.isArray(res.data)) {
        previousImageFileSha = res.data.sha
      }
    } catch {
      //
    }

    // Upload image
    await octoKit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo: 'list',
      branch: branch,
      path: imagePath,
      content: logoFile.split(',')[1],
      message: `Upload ${displayName} icon`,
      sha: previousImageFileSha,
    })
  } catch (_e: unknown) {
    return NextResponse.json(
      { error: 'Failed to add token image' },
      { status: 500 },
    )
  }

  const listPath = `lists/token-lists/${listType}/tokens/${ChainKey[
    chainId
  ].toLowerCase()}.json`

  // Get current token list to append to
  let currentListData

  try {
    const res = await octoKit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo: 'list',
        branch: 'master',
        path: listPath,
      },
    )

    if (!Array.isArray(res.data) && res.data.type === 'file') {
      currentListData = { sha: res.data.sha, content: res.data.content }
    }
  } catch {
    //
  }

  let currentList: ListEntry[] = currentListData
    ? JSON.parse(
        Buffer.from(currentListData?.content, 'base64').toString('ascii'),
      )
    : []

  // Remove from current list if exists to overwrite later
  currentList = currentList.filter((entry) => entry.address !== tokenAddress)

  // Append to current list
  const newList = [
    ...currentList,
    {
      address: tokenAddress,
      chainId: chainId,
      decimals: Number(tokenDecimals),
      logoURI: `https://raw.githubusercontent.com/${owner}/list/master/${imagePath}`,
      name: tokenName,
      symbol: tokenSymbol,
    },
  ].sort((a, b) => a.symbol.localeCompare(b.symbol))

  // Upload new list
  await octoKit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo: 'list',
    branch: branch,
    path: listPath,
    content: Buffer.from(JSON.stringify(newList, null, 2)).toString('base64'),
    message: `Add ${displayName} on ${CHAIN_NAME[chainId].toLowerCase()}`,
    sha: currentListData?.sha,
  })

  // Open List PR
  const {
    data: { html_url: listPr },
  } = await octoKit.request('POST /repos/{owner}/{repo}/pulls', {
    owner,
    repo: 'list',
    title: `Token: ${displayName}`,
    head: branch,
    base: 'master',
    body: `Chain: ${CHAIN_NAME[chainId] ?? chainId}
      Name: ${tokenName}
      Symbol: ${tokenSymbol}
      Decimals: ${tokenDecimals}
      List: ${listType}
      Volume: ${formatUSD(0)}
      Liquidity: ${formatUSD(0)}
      CoinGecko: ${await getCoinGecko(chainId, tokenAddress)}
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
            name: `${tokenName} - ${CHAIN_NAME[chainId]}`,
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

  return NextResponse.json(
    { listPr },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    },
  )
}

async function getCoinGecko(chainId: ChainId, address: string) {
  return await fetch(
    `https://api.coingecko.com/api/v3/coins/${CHAIN_NAME[
      chainId
    ].toLowerCase()}/contract/${address}`,
  )
    .then((data) => data.json())
    .then((data) =>
      data.id ? `https://www.coingecko.com/en/coins/${data.id}` : 'Not Found',
    )
}
