export interface ChordPairData {
  volumeUSD: string
  txCount: number
  id: string
  asset0: string
  asset1: string
}

export function convertPairsToChordMatrix(
  segmentNames: string[],
  pairs: Record<string, { id: string; txCount: number; volumeUSD: number }>,
  key: 'txCount' | 'volumeUSD' = 'txCount',
): {
  matrix: number[][]
  segmentNames: string[]
  matrixProps: ChordPairData[][]
} {
  const matrix: number[][] = segmentNames.map(
    () => new Array(segmentNames.length),
  )
  const matrixProps: ChordPairData[][] = segmentNames.map(
    () => new Array<ChordPairData>(segmentNames.length),
  )

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (j === i) {
        matrix[i][j] = 0
      } else if (j !== i && !(matrix[i][j] || matrix[j][i])) {
        const iName = segmentNames[i]
        const jName = segmentNames[j]
        const pair = pairs[`${jName}-${iName}`] || pairs[`${iName}-${jName}`]

        if (pair) {
          matrix[i][j] = +pair[key]
          matrix[j][i] = +pair[key]
          matrixProps[i][j] = {
            volumeUSD: pair.volumeUSD.toString(),
            txCount: pair.txCount,
            id: pair.id,
            asset0: iName,
            asset1: jName,
          }
          matrixProps[j][i] = {
            volumeUSD: pair.volumeUSD.toString(),
            txCount: pair.txCount,
            id: pair.id,
            asset0: jName,
            asset1: iName,
          }
        } else {
          matrix[i][j] = 0
          matrix[j][i] = 0
        }
      }
    }
  }

  return {
    matrix,
    segmentNames,
    matrixProps,
  }
}

export function sortSubgroupsDescending(a: number, b: number): number {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : Number.NaN
}
