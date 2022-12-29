import { AddressZero } from "@ethersproject/constants";
import { ChainId } from "@sushiswap/chain";
import { Type } from "@sushiswap/currency";
import { Currency } from "@sushiswap/ui13/components/currency";
import React, { FC, memo, useMemo } from "react";
import { useAccount } from "wagmi";

import { usePrices } from "../../hooks";
import { TokenSelectorRow } from "./TokenSelectorRow";

interface TokenSelectorCurrencyListProps {
  id: string;
  currencies: Type[];
  chainId: ChainId;
  onSelect(currency: Type): void;
}

export const TokenSelectorCurrencyList: FC<TokenSelectorCurrencyListProps> =
  memo(({ id, onSelect, currencies, chainId }) => {
    const { address } = useAccount();
    const { data: pricesMap } = usePrices({ chainId });

    // TODO
    const balancesMap = undefined;

    const rowData: TokenSelectorRow[] = useMemo(() => {
      if (!currencies) return [];

      return currencies.map((currency) => ({
        id: id,
        account: address,
        currency,
        balance:
          balancesMap?.[currency.isNative ? AddressZero : currency.address],
        pricesMap:
          pricesMap?.[currency.isNative ? AddressZero : currency.address],
        onSelect: () => onSelect(currency),
      }));
    }, [address, balancesMap, currencies, id, onSelect, pricesMap]);

    return (
      <Currency.List
        className="divide-y hide-scrollbar divide-slate-700"
        rowRenderer={TokenSelectorRow}
        rowData={rowData}
      />
    );
  });
