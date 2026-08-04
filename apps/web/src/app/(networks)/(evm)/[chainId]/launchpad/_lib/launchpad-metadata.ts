import { updateLaunchpadMetadata } from '@sushiswap/graph-client/data-api'
import type { EvmAddress } from 'sushi/evm'
import { type Hex, isAddressEqual, sha256, zeroHash } from 'viem'
import { z } from 'zod'
import type { LaunchpadChainId } from '../constants'
import { prepareLaunchpadLogoFile } from './launchpad-logo'

export const LAUNCHPAD_METADATA_DESCRIPTION_MAX_BYTES = 4_000

export const launchpadMetadataDescriptionSchema = z
  .string()
  .trim()
  .max(
    LAUNCHPAD_METADATA_DESCRIPTION_MAX_BYTES,
    'Description must be 4,000 UTF-8 bytes or fewer',
  )
  .refine(
    (description) =>
      new TextEncoder().encode(description).byteLength <=
      LAUNCHPAD_METADATA_DESCRIPTION_MAX_BYTES,
    'Description must be 4,000 UTF-8 bytes or fewer',
  )

interface LaunchpadMetadataLink {
  kind: string
  url: string
  label?: string
}

export interface LaunchpadMetadataDocument {
  description?: string
  links: LaunchpadMetadataLink[]
}

export interface LaunchpadMetadataFormValues {
  description: string
  homepage: string
  x: string
  telegram: string
}

export function canSubmitLaunchpadMetadataSignature(input: {
  connectedAddress?: EvmAddress
  creatorAddress: EvmAddress
  creatorBytecode?: Hex
}): boolean {
  if (!input.connectedAddress) return false

  return (
    isAddressEqual(input.connectedAddress, input.creatorAddress) ||
    Boolean(input.creatorBytecode && input.creatorBytecode !== '0x')
  )
}

const metadataTypes = {
  LaunchpadMetadataLink: [
    { name: 'kind', type: 'string' },
    { name: 'url', type: 'string' },
    { name: 'label', type: 'string' },
  ],
  LaunchpadMetadataDocument: [
    { name: 'description', type: 'string' },
    { name: 'links', type: 'LaunchpadMetadataLink[]' },
  ],
  UpdateMetadata: [
    { name: 'tokenAddress', type: 'address' },
    { name: 'expectedRevision', type: 'uint256' },
    { name: 'metadata', type: 'LaunchpadMetadataDocument' },
    { name: 'logoHash', type: 'bytes32' },
    { name: 'deadline', type: 'uint256' },
  ],
} as const

export interface UpdateMetadataTypedData {
  domain: {
    name: 'Sushi Launchpad API'
    version: '1'
    chainId: LaunchpadChainId
    verifyingContract: EvmAddress
  }
  types: typeof metadataTypes
  primaryType: 'UpdateMetadata'
  message: {
    tokenAddress: EvmAddress
    expectedRevision: bigint
    metadata: {
      description: string
      links: Array<{ kind: string; url: string; label: string }>
    }
    logoHash: Hex
    deadline: bigint
  }
}

export function buildLaunchpadMetadataDocument(
  values: LaunchpadMetadataFormValues,
): LaunchpadMetadataDocument {
  return {
    description: values.description.trim() || undefined,
    links: [
      values.homepage
        ? {
            kind: 'homepage',
            url: new URL(values.homepage).toString(),
          }
        : null,
      values.x
        ? {
            kind: 'x',
            url: new URL(values.x).toString(),
          }
        : null,
      values.telegram
        ? {
            kind: 'telegram',
            url: new URL(values.telegram).toString(),
          }
        : null,
    ].filter((link): link is LaunchpadMetadataLink => Boolean(link)),
  }
}

export function buildUpdateMetadataTypedData(input: {
  chainId: LaunchpadChainId
  factoryAddress: EvmAddress
  tokenAddress: EvmAddress
  expectedRevision: number
  metadata: LaunchpadMetadataDocument
  logoHash: Hex
  deadline: bigint
}): UpdateMetadataTypedData {
  return {
    domain: {
      name: 'Sushi Launchpad API',
      version: '1',
      chainId: input.chainId,
      verifyingContract: input.factoryAddress,
    },
    types: metadataTypes,
    primaryType: 'UpdateMetadata',
    message: {
      tokenAddress: input.tokenAddress,
      expectedRevision: BigInt(input.expectedRevision),
      metadata: {
        description: input.metadata.description ?? '',
        links: input.metadata.links.map((link) => ({
          kind: link.kind,
          url: link.url,
          label: link.label ?? '',
        })),
      },
      logoHash: input.logoHash,
      deadline: input.deadline,
    },
  }
}

async function prepareLaunchpadLogo(file: File): Promise<{
  image: string
  logoHash: Hex
}> {
  const prepared = await prepareLaunchpadLogoFile(file)
  const preparedFile = prepared.file
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read the logo file'))
    reader.readAsDataURL(preparedFile)
  })

  const [, base64] = dataUrl.split(',', 2)
  if (!base64) throw new Error('Could not encode the logo file')
  const bytes = new Uint8Array(await preparedFile.arrayBuffer())

  return { image: base64, logoHash: sha256(bytes) }
}

export async function saveLaunchpadMetadata(input: {
  chainId: LaunchpadChainId
  factoryAddress: EvmAddress
  tokenAddress: EvmAddress
  expectedRevision: number
  values: LaunchpadMetadataFormValues
  logoFile?: File | null
  signTypedData: (typedData: UpdateMetadataTypedData) => Promise<Hex>
}): Promise<void> {
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 10 * 60)
  const metadata = buildLaunchpadMetadataDocument(input.values)
  const logo = input.logoFile
    ? await prepareLaunchpadLogo(input.logoFile)
    : undefined
  const signature = await input.signTypedData(
    buildUpdateMetadataTypedData({
      chainId: input.chainId,
      factoryAddress: input.factoryAddress,
      tokenAddress: input.tokenAddress,
      expectedRevision: input.expectedRevision,
      metadata,
      logoHash: logo?.logoHash ?? zeroHash,
      deadline,
    }),
  )

  await updateLaunchpadMetadata({
    input: {
      chainId: input.chainId,
      tokenAddress: input.tokenAddress,
      expectedRevision: input.expectedRevision,
      metadata,
      ...(logo ? { image: logo.image } : {}),
      deadline: deadline.toString(),
    },
    signature,
  })
}
