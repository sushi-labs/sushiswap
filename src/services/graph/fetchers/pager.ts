import { request } from 'graphql-request'

// @ts-ignore TYPE NEEDS FIXING
export async function pager(endpoint, query, variables = {}) {
  if (endpoint.includes('undefined')) return {}

  let data: any = {}
  let skip = 0
  let flag = true

  while (flag) {
    flag = false
    const req = await request(endpoint, query, variables)

    Object.keys(req).forEach((key) => {
      data[key] = data[key] ? [...data[key], ...req[key]] : req[key]
    })

    Object.values(req).forEach((entry: any) => {
      if (entry.length === 1000) flag = true
    })

    // @ts-ignore TYPE NEEDS FIXING
    if (Object.keys(variables).includes('first') && variables['first'] !== undefined) break

    skip += 1000
    variables = { ...variables, skip }
  }
  return data
}
