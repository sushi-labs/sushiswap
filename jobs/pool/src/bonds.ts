import { ChainId } from 'sushi/chain'

export async function bonds() {
  console.log('Starting bonds')

  try {
    const startTime = performance.now()

    const bonds = await extract()

    const endTime = performance.now()
    console.log(
      `COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(
        1,
      )} seconds. `,
    )
  } catch (e) {
    console.error(e)
  }
}

async function extract() {}

async function extractChain(chainId: ChainId) {}

function transform(bonds: Awaited<ReturnType<typeof extract>>) {}
