import type { Metadata } from 'next'
import { ChainId } from 'sushi'
import LaunchpadPage, {
  generateMetadata as generateLaunchpadMetadata,
} from '../[chainId]/launchpad/(discover)/page'

const params = Promise.resolve({ chainId: ChainId.ROBINHOOD.toString() })

export function generateMetadata(): Promise<Metadata> {
  return generateLaunchpadMetadata({ params })
}

export default function LaunchPage(): React.ReactElement {
  return <LaunchpadPage params={params} />
}
