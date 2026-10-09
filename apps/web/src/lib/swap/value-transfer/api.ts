import {
  type ValueTransferMetadataResponse,
  type ValueTransferUserStep,
  valueTransferBuildUserStepsResponseSchema,
  valueTransferMetadataResponseSchema,
} from './schemas'

export async function fetchValueTransferUserSteps({
  quoteId,
  signal,
}: {
  quoteId: string
  signal?: AbortSignal
}): Promise<ValueTransferUserStep[]> {
  const response = await fetch(
    '/api/cross-chain/value-transfer/build-user-steps',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quoteId }),
      signal,
    },
  )
  if (!response.ok) throw new Error('LayerZero build-user-steps request failed')
  return valueTransferBuildUserStepsResponseSchema.parse(await response.json())
    .userSteps
}

export async function fetchValueTransferMetadata(
  signal?: AbortSignal,
): Promise<ValueTransferMetadataResponse> {
  const response = await fetch('/api/cross-chain/value-transfer/metadata', {
    signal,
  })
  if (!response.ok) throw new Error('LayerZero contract metadata unavailable')
  return valueTransferMetadataResponseSchema.parse(await response.json())
}
