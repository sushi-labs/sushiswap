import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";

const schema = z.object({
  srcChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  dstChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
});

const handler = (request: VercelRequest, response: VercelResponse) => {
  const { srcChainId, dstChainId } = schema.parse(request.query);

  // const amount = request.query.amount

  // const gasPrice = request.query.gasPrice

  // const srcChainId = request.query.srcChainId
  // const srcToken = request.query.srcToken

  // const dstChainId = request.query.dstChainId
  // const dstToken = request.query.dstToken

  return response.status(200).json({ srcChainId, dstChainId });
};

export default handler;
