// @ts-nocheck

import { exec } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import type { Abi } from 'viem'

const abiDirPath = new URL(import.meta.url).pathname
  .split('/')
  .slice(0, -1)
  .join('/')
const abiDirContent = readdirSync(abiDirPath)

const abiDirTsFiles = abiDirContent.filter((file) => file.endsWith('.ts'))

for (const file of abiDirTsFiles) {
  if (file === 'index.ts') continue
  if (file === 'splitter.ts') continue

  const mod = await import(`./${file}`)
  const [abiName, abiContent] = Object.entries(mod)[0] as [string, Abi]

  const functions = abiContent.filter((item) => item.type === 'function')

  mkdirSync(`${abiDirPath}/${abiName}`, { recursive: true })

  const indexFileContent = []

  for (const func of functions) {
    const fileName = `${abiName}_${func.name}.ts`

    writeFileSync(
      `${abiDirPath}/${abiName}/${fileName}`,
      `export const ${abiName}_${func.name} = [${JSON.stringify(
        func,
      )}] as const`,
    )

    indexFileContent.push(`export * from './${fileName.replace('.ts', '.js')}'`)
  }

  writeFileSync(
    `${abiDirPath}/${abiName}/index.ts`,
    indexFileContent.join('\n'),
  )

  rmSync(`${abiDirPath}/${file}`)

  try {
    exec(`pnpm biome format ${abiDirPath}/${abiName} --write`)
  } catch {
    console.log("Couldn't format", abiName)
  }
}
