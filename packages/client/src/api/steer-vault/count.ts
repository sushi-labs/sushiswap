import { type Prisma, createClient } from '@sushiswap/database'
import { type SteerVaultCountApiSchema } from '../../pure/steer-vault/count/schema'
import { parseSteerArgs } from './parse'

export async function getSteerVaultCountFromDB(
  args: typeof SteerVaultCountApiSchema._output,
) {
  const where: Prisma.SteerVaultWhereInput = parseSteerArgs(args)

  const client = await createClient()
  const count = await client.steerVault.count({
    where,
  })

  await client.$disconnect()
  return { count }
}
