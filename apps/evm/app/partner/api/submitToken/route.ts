import { ChainId, ChainKey } from '@sushiswap/chain'
import { formatUSD } from '@sushiswap/format'
import { CHAIN_NAME } from '@sushiswap/graph-config'
import { SubmiTokenSchema } from 'app/partner/config'
import { getOctokit } from 'app/partner/lib'
import stringify from 'fast-json-stable-stringify'
import { NextResponse } from 'next/server'

const owner = 'sushiswap'

interface ListEntry {
  address: string
  chainId: number
  decimals: number
  logoURI: string
  name: string
  symbol: string
}

export async function POST(request: Request) {
  if (!process.env.TOKEN_LIST_PR_WEBHOOK_URL) throw new Error('TOKEN_LIST_PR_WEBHOOK_URL undefined')
  if (!process.env.OCTOKIT_KEY) throw new Error('OCTOKIT_KEY undefined')

  const parsed = SubmiTokenSchema.safeParse(await request.json())
  if (parsed.success === false) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }
  const { token, tokenIcon, chainId, listType } = parsed.data

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
  const displayName = token.symbol.toLowerCase().replace(/( )|(\.)/g, '_')

  // Find unused branch name
  const branch = await (async function () {
    const branches: string[] = []

    for (let i = 1; ; i++) {
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

  const imagePath = `logos/token-logos/network/${ChainKey[chainId].toLowerCase()}/${token.address}.jpg`

  try {
    // Figure out if image already exists, overwrite if it does
    let previousImageFileSha: string | undefined

    try {
      const res = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo: 'list',
        branch: 'master',
        path: imagePath,
      })

      if (!Array.isArray(res.data)) {
        previousImageFileSha = res.data.sha
      }
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
    return NextResponse.json({ error: 'Failed to add token image' }, { status: 500 })
  }

  const listPath = `lists/token-lists/${listType}/tokens/${ChainKey[chainId].toLowerCase()}.json`

  // Get current token list to append to
  let currentListData

  try {
    const res = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo: 'list',
      branch: 'master',
      path: listPath,
    })

    if (!Array.isArray(res.data) && res.data.type === 'file') {
      currentListData = { sha: res.data.sha, content: res.data.content }
    }
  } catch {
    //
  }

  let currentList: ListEntry[] = currentListData
    ? JSON.parse(Buffer.from(currentListData?.content, 'base64').toString('ascii'))
    : []

  // Remove from current list if exists to overwrite later
  currentList = currentList.filter((entry) => entry.address !== token.address)

  // Append to current list
  const newList = [
    ...currentList,
    {
      address: token.address,
      chainId: chainId,
      decimals: Number(token.decimals),
      logoURI: `https://raw.githubusercontent.com/${owner}/list/master/${imagePath}`,
      name: token.name,
      symbol: token.symbol,
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
      Name: ${token.name}
      Symbol: ${token.symbol}
      Decimals: ${token.decimals}
      List: ${listType}
      Volume: ${formatUSD(0)}
      Liquidity: ${formatUSD(0)}
      CoinGecko: ${await getCoinGecko(chainId, token.address)}
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
            name: `${token.name} - ${CHAIN_NAME[chainId]}`,
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
    }
  )
}

async function getCoinGecko(chainId: ChainId, address: string) {
  return await fetch(`https://api.coingecko.com/api/v3/coins/${CHAIN_NAME[chainId].toLowerCase()}/contract/${address}`)
    .then((data) => data.json())
    .then((data) => (data.id ? `https://www.coingecko.com/en/coins/${data.id}` : 'Not Found'))
}
