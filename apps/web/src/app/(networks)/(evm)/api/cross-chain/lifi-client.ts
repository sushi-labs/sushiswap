import { stringify } from 'viem'

export async function postLifiRequest(
  endpoint: 'routes' | 'stepTransaction',
  body: unknown,
  cache?: RequestCache,
): Promise<{ response: Response; json: unknown }> {
  const response = await fetch(
    new URL(`https://li.quest/v1/advanced/${endpoint}`),
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        ...(process.env.LIFI_API_KEY && {
          'x-lifi-api-key': process.env.LIFI_API_KEY,
        }),
      },
      body: stringify(body),
      ...(cache && { cache }),
    },
  )
  const json: unknown = await response.json()
  return { response, json }
}
