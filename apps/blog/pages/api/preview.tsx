import type { NextApiRequest, NextApiResponse } from 'next'
import { getPreviewPostBySlug } from '../../lib/strapi/previewPostBySlug'

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (
    req.query.secret !== process.env.STRAPI_PREVIEW_SECRET ||
    !req.query.slug
  ) {
    res.status(401).json({ message: 'Invalid token' })
    return
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const article = await getPreviewPostBySlug(req.query.slug as string)

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!article) {
    res.status(401).json({ message: 'Invalid slug' })
    return
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, {
    Location: `/blog/${article.slug}`,
  })
  res.end()
}
