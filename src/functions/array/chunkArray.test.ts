import { chunkArray } from './chunkArray'

describe('#chunkArray', () => {
  it('distributes evenly', () => {
    expect(chunkArray([1, 2, 3])).toEqual([[1, 2, 3]])
  })
  it('takes gasLimit argument into account', () => {
    expect(chunkArray([1, 2, 3], 1)).toEqual([[1], [2], [3]])
  })
  it('handles empty array', () => {
    expect(chunkArray([])).toEqual([])
  })
  it('accepts objects with own gasRequired', () => {
    const items = [
      { item: 1, gasRequired: 30_000_000 },
      { item: 2, gasRequired: 40_000_000 },
      { item: 3, gasRequired: 50_000_000 },
    ]
    const [item1, item2, item3] = items
    expect(chunkArray(items)).toEqual([[item1, item2], [item3]])
  })
})
