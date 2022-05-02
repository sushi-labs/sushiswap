import { getBar } from 'graph/graph-client'

export async function fetchBar() {
  console.log(await getBar())
}
