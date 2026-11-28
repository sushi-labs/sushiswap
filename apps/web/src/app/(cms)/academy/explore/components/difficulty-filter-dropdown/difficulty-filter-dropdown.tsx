import { getAcademyDifficulties } from '../../../filter-options'
import { DifficultyFilterDropdownClient } from './difficulty-filter-dropdown-client'

export async function DifficultyFilterDropdown() {
  const difficulties = await getAcademyDifficulties()

  const options = difficulties.map(({ name, slug }) => ({ name, slug }))

  return <DifficultyFilterDropdownClient difficulties={options} />
}
