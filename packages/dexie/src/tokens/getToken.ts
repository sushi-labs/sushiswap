import {ChainId} from "@sushiswap/chain";

import {db} from "../db";
import {SavedToken} from "./types";

export const getToken = async ({ chainId, address }: { chainId: ChainId | undefined, address: string | undefined}): Promise<SavedToken | undefined> => {
   try  {
      return db.tokens.where('id').equals(`${chainId}:${address?.toLowerCase()}`).first().catch(() => undefined);
   } catch (e) {
      return undefined
   }
}
