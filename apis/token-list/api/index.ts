import type { VercelRequest, VercelResponse } from '@vercel/node';

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
  return response.redirect('https://storage.googleapis.com/token-list/token-list.json');
}

export default handler;