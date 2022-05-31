import { withSentry } from '@sentry/nextjs'

// @ts-ignore TYPE NEEDS FIXING
const handler = async (req, res) => {
  res.status(200).json([])
}

export default withSentry(handler)
