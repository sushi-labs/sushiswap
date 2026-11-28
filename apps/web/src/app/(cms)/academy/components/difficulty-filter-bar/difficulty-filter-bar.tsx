import { getStyledDifficulties } from '../../filter-options'
import { DifficultyFilterBarClient } from './difficulty-filter-bar-client'

export async function DifficultyFilterBar() {
  const difficulties = await getStyledDifficulties()

  return <DifficultyFilterBarClient difficulties={difficulties} />
}
