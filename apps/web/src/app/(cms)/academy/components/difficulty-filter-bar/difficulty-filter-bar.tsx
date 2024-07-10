import { getDifficulties } from '@sushiswap/graph-client/strapi'
import { DifficultyFilterBarClient } from './difficulty-filter-bar-client'

export async function DifficultyFilterBar() {
  const difficulties = await getDifficulties()

  return <DifficultyFilterBarClient difficulties={difficulties} />
}
