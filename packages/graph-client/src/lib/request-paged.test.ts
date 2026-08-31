import type { TadaDocumentNode } from 'gql.tada'
import { ChainId } from 'sushi'
import { MAX_FIRST } from 'sushi/evm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { requestPaged } from './request-paged.js'
import { request } from './request.js'

vi.mock('./request.js', () => ({ request: vi.fn() }))

interface TestVariables {
  first?: number
  where?: { owner?: string; id_gt?: string }
}

const query = {
  definitions: [
    {
      selectionSet: {
        selections: [{ name: { value: 'items' } }],
      },
    },
  ],
} as unknown as TadaDocumentNode<{ items: { id: string }[] }, TestVariables>

describe('requestPaged', () => {
  const requestMock = vi.mocked(request)

  beforeEach(() => requestMock.mockReset())

  it('uses a single request when the requested page fits the chain limit', async () => {
    requestMock.mockResolvedValue({ items: [{ id: '1' }] })

    await expect(
      requestPaged({
        chainId: ChainId.ETHEREUM,
        url: 'https://example.com/graphql',
        query,
        variables: { first: 1 },
      }),
    ).resolves.toEqual({ items: [{ id: '1' }] })
    expect(requestMock).toHaveBeenCalledOnce()
  })

  it('continues from the final id while preserving caller filters', async () => {
    const pageSize = MAX_FIRST[ChainId.ETHEREUM]
    const firstPage = Array.from({ length: pageSize }, (_, index) => ({
      id: String(index + 1),
    }))
    requestMock
      .mockResolvedValueOnce({ items: firstPage })
      .mockResolvedValueOnce({ items: [{ id: String(pageSize + 1) }] })

    await expect(
      requestPaged({
        chainId: ChainId.ETHEREUM,
        url: 'https://example.com/graphql',
        query,
        variables: {
          first: pageSize + 1,
          where: { owner: '0xowner' },
        },
      }),
    ).resolves.toEqual({
      items: [...firstPage, { id: String(pageSize + 1) }],
    })
    expect(requestMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        variables: expect.objectContaining({
          where: { id_gt: String(pageSize), owner: '0xowner' },
        }),
      }),
      undefined,
    )
  })
})
