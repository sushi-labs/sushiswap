import { Contract } from '@ethersproject/contracts'
import { namehash } from '@ethersproject/hash'
import { BaseProvider } from '@ethersproject/providers'
import { WrappedTokenInfo } from '@sushiswap/token-lists'
import type { TokenInfo, TokenList } from '@uniswap/token-lists'
import schema from '@uniswap/token-lists/src/tokenlist.schema.json'
// @ts-ignore
import Ajv from 'ajv'
// @ts-ignore
import CID from 'cids'
// @ts-ignore
import { getCodec, rmPrefix } from 'multicodec'
// @ts-ignore
import { decode, toB58String } from 'multihashes'

import { DEFAULT_LIST_OF_LISTS } from './constants'
import { ChainTokenMap } from './types'

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

const mapCache = typeof WeakMap !== 'undefined' ? new WeakMap<TokenList | TokenInfo[], ChainTokenMap>() : null

export function tokensToChainTokenMap(tokens: TokenList | TokenInfo[]): ChainTokenMap {
  const cached = mapCache?.get(tokens)
  if (cached) return cached

  const [list, infos] = Array.isArray(tokens) ? [undefined, tokens] : [tokens, tokens.tokens]
  const map = infos.reduce<Mutable<ChainTokenMap>>((map, info) => {
    const token = new WrappedTokenInfo(info, list)
    if (map[token.chainId]?.[token.address] !== undefined) {
      console.warn(`Duplicate token skipped: ${token.address}`)
      return map
    }
    if (!map[token.chainId]) {
      map[token.chainId] = {}
    }
    map[token.chainId][token.address] = { token, list }
    return map
  }, {}) as ChainTokenMap
  mapCache?.set(tokens, map)
  return map
}

// use ordering of default list of lists to assign priority
export function sortByListPriority(urlA: string, urlB: string) {
  const first = DEFAULT_LIST_OF_LISTS.includes(urlA) ? DEFAULT_LIST_OF_LISTS.indexOf(urlA) : Number.MAX_SAFE_INTEGER
  const second = DEFAULT_LIST_OF_LISTS.includes(urlB) ? DEFAULT_LIST_OF_LISTS.indexOf(urlB) : Number.MAX_SAFE_INTEGER

  // need reverse order to make sure mapping includes top priority last
  if (first < second) return 1
  else if (first > second) return -1
  return 0
}

/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */
export function uriToHttp(uri: string): string[] {
  const protocol = uri.split(':')[0].toLowerCase()
  switch (protocol) {
    case 'https':
      return [uri]
    case 'http':
      return ['https' + uri.substr(4), uri]
    case 'ipfs':
      const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2]
      return [`https://cloudflare-ipfs.com/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`]
    case 'ipns':
      const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2]
      return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`]
    default:
      return []
  }
}

export function hexToUint8Array(hex: string): Uint8Array {
  hex = hex.startsWith('0x') ? hex.substr(2) : hex
  if (hex.length % 2 !== 0) throw new Error('hex must have length that is multiple of 2')
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return arr
}

const UTF_8_DECODER = new TextDecoder()

/**
 * Returns the URI representation of the content hash for supported codecs
 * @param contenthash to decode
 */
export function contenthashToUri(contenthash: string): string {
  const buff = hexToUint8Array(contenthash)
  const codec = getCodec(buff as Buffer) // the typing is wrong for @types/multicodec
  switch (codec) {
    case 'ipfs-ns': {
      const data = rmPrefix(buff as Buffer)
      const cid = new CID(Buffer.from(data))
      return `ipfs://${toB58String(cid.multihash)}`
    }
    case 'ipns-ns': {
      const data = rmPrefix(buff as Buffer)
      const cid = new CID(Buffer.from(data))
      const multihash = decode(cid.multihash)
      if (multihash.name === 'identity') {
        return `ipns://${UTF_8_DECODER.decode(multihash.digest).trim()}`
      } else {
        return `ipns://${toB58String(cid.multihash)}`
      }
    }
    default:
      throw new Error(`Unrecognized codec: ${codec}`)
  }
}

const REGISTRAR_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32',
      },
    ],
    name: 'resolver',
    outputs: [
      {
        name: 'resolverAddress',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]
const REGISTRAR_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

const RESOLVER_ABI = [
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'node',
        type: 'bytes32',
      },
    ],
    name: 'contenthash',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

// cache the resolver contracts since most of them are the public resolver
function resolverContract(resolverAddress: string, provider: BaseProvider): Contract {
  return new Contract(resolverAddress, RESOLVER_ABI, provider)
}

/**
 * Fetches and decodes the result of an ENS contenthash lookup on mainnet to a URI
 * @param ensName to resolve
 * @param provider provider to use to fetch the data
 */
export async function resolveENSContentHash(ensName: string, provider: BaseProvider): Promise<string> {
  const ensRegistrarContract = new Contract(REGISTRAR_ADDRESS, REGISTRAR_ABI, provider)
  const hash = namehash(ensName)
  const resolverAddress = await ensRegistrarContract.resolver(hash)
  return resolverContract(resolverAddress, provider).contenthash(hash)
}

const ENS_NAME_REGEX = /^(([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+)eth(\/.*)?$/

export function parseENSAddress(ensAddress: string): { ensName: string; ensPath: string | undefined } | undefined {
  const match = ensAddress.match(ENS_NAME_REGEX)
  if (!match) return undefined
  return { ensName: `${match[1].toLowerCase()}eth`, ensPath: match[4] }
}

const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
export async function getTokenList(
  listUrl: string,
  resolveENSContentHash: (ensName: string) => Promise<string>
): Promise<TokenList> {
  const parsedENS = parseENSAddress(listUrl)
  let urls: string[]
  if (parsedENS) {
    let contentHashUri
    try {
      contentHashUri = await resolveENSContentHash(parsedENS.ensName)
    } catch (error) {
      console.debug(`Failed to resolve ENS name: ${parsedENS.ensName}`, error)
      throw new Error(`Failed to resolve ENS name: ${parsedENS.ensName}`)
    }
    let translatedUri
    try {
      translatedUri = contenthashToUri(contentHashUri)
    } catch (error) {
      console.debug('Failed to translate contenthash to URI', contentHashUri)
      throw new Error(`Failed to translate contenthash to URI: ${contentHashUri}`)
    }
    urls = uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ''}`)
  } else {
    urls = uriToHttp(listUrl)
  }
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const isLast = i === urls.length - 1
    let response
    try {
      response = await fetch(url)
    } catch (error) {
      console.debug('Failed to fetch list', listUrl, error)
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }

    if (!response.ok) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }

    const json = await response.json()
    if (!tokenListValidator(json)) {
      const validationErrors: string =
        tokenListValidator.errors?.reduce<string>((memo, error) => {
          const add = `${error.dataPath} ${error.message ?? ''}`
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`
        }, '') ?? 'unknown error'
      throw new Error(`Token list failed validation: ${validationErrors}`)
    }
    return json
  }
  throw new Error('Unrecognized list URL protocol.')
}
