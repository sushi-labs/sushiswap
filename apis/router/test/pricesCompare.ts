export function comparePrices(
  pricesEthalon: Record<string, number>,
  pricesCompared: Record<string, number> | undefined,
  levels: number[] = [],
) {
  if (pricesCompared === undefined) return
  const ethalonTokens = Object.keys(pricesEthalon)
  const comparedTokens = Object.keys(pricesCompared)
  const lengthDiff = comparedTokens.length - ethalonTokens.length
  if (lengthDiff > 0) console.log(`${lengthDiff} tokens more`)
  if (lengthDiff < 0) console.log(`${lengthDiff} tokens less`)
  let totalNum = 0
  let totalR = 0
  let totalShift = 0
  let maxR = 0
  const levelsEx = levels.map((_) => 0)
  ethalonTokens.forEach((eT) => {
    const eP = pricesEthalon[eT] as number
    const cP = pricesCompared[eT]
    if (cP === undefined) {
      //console.log(`No price for ${eT}`)
    } else {
      if (eP === 0) {
        if (cP > 1e-5) console.log(`Token ${eT} price mismatch ${eP} => ${cP}`)
      } else {
        const s = cP / eP - 1
        totalShift += s
        const r = Math.abs(s)
        ++totalNum
        totalR += r
        maxR = Math.max(r, maxR)
        levels.forEach((l, i) => {
          if (r > l) levelsEx[i] += 1
        })
      }
    }
  })
  console.log(
    `Compared prices: ${totalNum}/${ethalonTokens.length}, avg diff ${(
      (totalR / totalNum) *
      100
    ).toFixed(4)}%, avg shift ${((totalShift / totalNum) * 100).toFixed(
      4,
    )}%, max diff ${(maxR * 100).toFixed(4)}%, ${levels
      .map((l, i) => {
        return `>${l * 100}% - ${(
          ((levelsEx[i] as number) / totalNum) *
          100
        ).toFixed(1)}%`
      })
      .join(', ')}`,
  )
}

async function compareOldNewPrices(chainId: number) {
  const resNew = await fetch(`https://api.sushi.com/price/v1/${chainId}`)
  const pricesNew = await resNew.json()
  const resOld = await fetch(
    `https://api.sushi.com/price/v1/${chainId}?oldPrices=true`,
  )
  const pricesOld = await resOld.json()
  comparePrices(pricesOld, pricesNew, [0.01, 0.005])
}

compareOldNewPrices(56)
