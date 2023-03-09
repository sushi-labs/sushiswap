import { GetStaticProps } from 'next'
import { Add } from './[chainId]'
import { ChainId } from '@sushiswap/chain'

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      chainId: ChainId.ETHEREUM,
    },
  }
}

export default Add
