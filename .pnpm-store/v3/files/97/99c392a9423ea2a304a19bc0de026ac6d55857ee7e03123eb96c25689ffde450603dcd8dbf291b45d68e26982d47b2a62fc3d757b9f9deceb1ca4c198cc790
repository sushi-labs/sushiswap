// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withAxiom } from 'next-axiom'

async function handler(req, res) {
  req.log.info('Hello from function', { url: req.url });
  res.status(200).json({ name: 'John Doe' })
}

export default withAxiom(handler)
