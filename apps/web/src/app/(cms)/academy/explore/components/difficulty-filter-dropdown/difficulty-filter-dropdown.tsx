import { getDifficulties } from '@sushiswap/graph-client/strapi'
import { DifficultyFilterDropdownClient } from './difficulty-filter-dropdown-client'

export async function DifficultyFilterDropdown() {
  const difficulties = await getDifficulties()

  return <DifficultyFilterDropdownClient difficulties={difficulties} />
}
