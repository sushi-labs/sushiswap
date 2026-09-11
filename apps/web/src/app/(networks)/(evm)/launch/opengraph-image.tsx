import type { ImageResponse } from 'next/og'
import { ChainId } from 'sushi'
import LaunchpadOpenGraphImage from '../[chainId]/launchpad/opengraph-image'

export {
  alt,
  contentType,
  size,
} from '../[chainId]/launchpad/opengraph-image'

export default function OpenGraphImage(): Promise<ImageResponse> {
  return LaunchpadOpenGraphImage({
    params: Promise.resolve({ chainId: ChainId.ROBINHOOD.toString() }),
  })
}
