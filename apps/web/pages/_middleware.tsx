import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUBDOMAIN_CHAIN_ID: { [subdomain: string]: string } = {
  celo: "42220",
};

const DEFAULT_CHAIN_ID = "1";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const chainId = request.cookies["chain-id"];

  const subdomain = request.headers.get("host")?.split(".")[0];

  // If chainId already set and no subdomain, just return...
  if (chainId && !subdomain) {
    return response;
  }

  // set the `cookie`
  response.cookie(
    "chain-id",
    !(chainId && subdomain) || !(subdomain in SUBDOMAIN_CHAIN_ID)
      ? DEFAULT_CHAIN_ID
      : SUBDOMAIN_CHAIN_ID[subdomain]
  );

  return response;
}
