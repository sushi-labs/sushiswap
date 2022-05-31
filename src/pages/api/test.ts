import { withSentry } from '@sentry/nextjs'

// @ts-ignore TYPE NEEDS FIXING
const handler = async (req, res) => {
  throw new Error('API throw error test')
}

export default withSentry(handler)
