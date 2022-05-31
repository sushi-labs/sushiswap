import { withSentry } from '@sentry/nextjs'

// @ts-ignore TYPE NEEDS FIXING
const handler = async (req, res) => {
  res.status(200).json({ name: 'John Doe' })
}

export default withSentry(handler)
