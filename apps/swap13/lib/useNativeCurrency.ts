import { ChainId } from "@sushiswap/chain";
import { Native, Token } from "@sushiswap/currency";
import { useMemo } from "react";
import { useNetwork } from "wagmi";

export default function useNativeCurrency(): Native | Token {
  const { chain } = useNetwork();
  return useMemo(
    () => (chain ? Native.onChain(chain.id) : Native.onChain(ChainId.ETHEREUM)),
    [chain]
  );
}
