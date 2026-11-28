import {
  type Difficulty,
  getDifficulties,
  getProducts,
  getTopics,
} from '@sushiswap/graph-client/strapi'
import { type StyledDifficultySlug, isStyledDifficulty } from './constants'

export interface FilterOption {
  name: string
  slug: string
}

type AcademyDifficulty = Difficulty & FilterOption

export type StyledDifficulty = AcademyDifficulty & {
  slug: StyledDifficultySlug
}

export async function getAcademyCategories(): Promise<FilterOption[]> {
  const [topics, products] = await Promise.all([getTopics(), getProducts()])

  return [...topics, ...products].flatMap(({ name, slug }) =>
    name && slug ? [{ name, slug }] : [],
  )
}

export async function getAcademyDifficulties(): Promise<AcademyDifficulty[]> {
  const difficulties = await getDifficulties()

  return difficulties.flatMap(({ name, slug, ...difficulty }) =>
    name && slug ? [{ ...difficulty, name, slug }] : [],
  )
}

export async function getStyledDifficulties(): Promise<StyledDifficulty[]> {
  const difficulties = await getAcademyDifficulties()

  return difficulties.filter((difficulty): difficulty is StyledDifficulty =>
    isStyledDifficulty(difficulty.slug),
  )
}
