import { withSentry } from '@sentry/nextjs'

// @ts-ignore TYPE NEEDS FIXING
const handler = async (req, res) => {
  res.status(200).json([{ id: 1 }, { id: 2 }])
}

export default withSentry(handler)
