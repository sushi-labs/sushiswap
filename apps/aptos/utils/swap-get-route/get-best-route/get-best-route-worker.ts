import { getBestRoute } from './get-best-route'

self.onmessage = async ({
  data: args,
}: MessageEvent<Parameters<typeof getBestRoute>>) => {
  const result = getBestRoute(...args)
  self.postMessage(result)
}
