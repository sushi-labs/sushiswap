import { writeFileSync } from 'fs'
import path from 'path'

import { ChainId } from '../src/constants'
import { type Chain } from '../src'

(async function () {
    const chains = await fetch('https://chainid.network/chains.json').then((data) => data.json() as Promise<Chain[]>)
    writeFileSync(
        path.resolve(__dirname, '../src/generated.ts'),
        `export default ${JSON.stringify(
            chains.filter(({ chainId }) => Object.values(ChainId).find((id) => id === chainId)).map(({ chainId, explorers, nativeCurrency, name, shortName, parent }) => ({
                chainId,
                explorers,
                nativeCurrency,
                name,
                shortName,
                parent,
            })),
            null,
            2,
        )} as const;\n\n`,
    )
    process.exit(0)
})()
