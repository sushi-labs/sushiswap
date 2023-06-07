
import {db} from "../db";
import {SavedToken} from "./types";

export const saveTokens = async ({ tokens }: { tokens: SavedToken[]}) => {
   db.tokens.bulkPut(tokens).catch(() => undefined);
}
