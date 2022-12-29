"use client";

import { ChainId, chains } from "@sushiswap/chain";
import { Token, Type } from "@sushiswap/currency";
import { FundSource } from "@sushiswap/hooks";
import { useAddCustomToken } from "@sushiswap/react-query";
import { useTokens } from "@sushiswap/react-query";
import { SlideIn } from "@sushiswap/ui13/components/animation";
import { Dialog } from "@sushiswap/ui13/components/dialog";
import { NetworkIcon } from "@sushiswap/ui13/components/icons";
import { Input } from "@sushiswap/ui13/components/input";
import { Search } from "@sushiswap/ui13/components/input/Search";
import { List } from "@sushiswap/ui13/components/list/List";
import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from "react";

import { usePrices } from "../../hooks";
import { TokenSelectorCurrencyList } from "./TokenSelectorCurrencyList";
import { TokenSelectorImportRow } from "./TokenSelectorImportRow";
import { TokenSelectorListFilterByQuery } from "./TokenSelectorListFilterByQuery";
import { TokenSelectorSettingsOverlay } from "./TokenSelectorSettingsOverlay";

interface TokenSelectorProps {
  id: string;
  selected: Type | undefined;
  chainId: ChainId;
  onSelect(currency: Type): void;
  children({
    open,
    setOpen,
  }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  }): ReactNode;
  fundSource?: FundSource;
}

export const TokenSelector: FC<TokenSelectorProps> = ({
  id,
  selected,
  onSelect,
  chainId,
  children,
  fundSource = FundSource.WALLET,
}) => {
  const { mutate: onAddCustomToken } = useAddCustomToken();

  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);

  const { data: tokenMap } = useTokens({ chainId });
  const { data: pricesMap } = usePrices({ chainId });

  const balancesMap = undefined;

  const _onSelect = useCallback(
    (currency: Token) => {
      if (onSelect) {
        onSelect(currency);
      }

      setOpen(false);
    },
    [onSelect]
  );

  const handleImport = useCallback(
    (currency: Token) => {
      onAddCustomToken(currency);
      _onSelect(currency);
    },
    [_onSelect, onAddCustomToken]
  );

  return (
    <>
      {children({ open, setOpen })}
      <TokenSelectorListFilterByQuery
        tokenMap={tokenMap}
        pricesMap={pricesMap}
        balancesMap={balancesMap}
        fundSource={fundSource}
        chainId={chainId}
      >
        {({ currencies, query, onInput, searching, queryToken }) => (
          <Dialog open={open} onClose={handleClose}>
            <Dialog.Content className="!pb-0 h-[75vh] sm:h-[640px]">
              <SlideIn>
                <div className="flex gap-2 items-center">
                  <Search
                    id={id}
                    input={Input.Address}
                    value={query}
                    loading={searching}
                    onChange={onInput}
                  />
                  <TokenSelectorSettingsOverlay />
                </div>

                <div className="flex flex-col gap-6 relative h-[320px] sm:h-full mt-3">
                  <div className="relative h-[320px] sm:h-[calc(100%-32px)] pt-5">
                    <div className="absolute inset-0 h-full rounded-t-none rounded-xl">
                      <div className="flex flex-col gap-3 h-full">
                        {queryToken[0] && (
                          <List>
                            <List.Label className="px-2">
                              Search results
                            </List.Label>
                            <TokenSelectorImportRow
                              currencies={queryToken}
                              onImport={() =>
                                queryToken[0] && handleImport(queryToken[0])
                              }
                            />
                          </List>
                        )}
                        <List>
                          <List.Label className="px-2">Tokens</List.Label>
                        </List>
                        <TokenSelectorCurrencyList
                          onSelect={_onSelect}
                          id={id}
                          currencies={currencies}
                          chainId={chainId}
                        />
                      </div>
                      {currencies.length === 0 && !queryToken && chainId && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="text-xs flex italic text-slate-500">
                              No tokens found on
                            </span>
                            <span className="text-xs font-medium flex gap-1 italic text-slate-500">
                              <NetworkIcon
                                width={14}
                                height={14}
                                chainId={chainId}
                              />{" "}
                              {chains[chainId].name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SlideIn>
            </Dialog.Content>
          </Dialog>
        )}
      </TokenSelectorListFilterByQuery>
    </>
  );
};
