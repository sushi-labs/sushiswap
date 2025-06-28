import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  isTwapSupportedChainId,
  TWAP_SUPPORTED_CHAIN_IDS,
  TwapSupportedChainId,
} from "src/config";
import { TwapOrder, useTwapOrders } from "src/lib/hooks/react-query/twap";
import { useAccount } from "wagmi";
import { eqIgnoreCase } from "@orbs-network/twap-sdk";
import {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
} from "../../simple/derivedstate-simple-swap-provider";
import { Type } from "sushi/currency";

const getSymbol = (token: Type | undefined, isInput?: boolean): string => {
  if (!token) return "";
  const result = !isInput
    ? token.symbol
    : token.isNative
    ? token.wrapped.symbol
    : token.symbol;
  return result || "";
};

const filterByPair = (orders?: TwapOrder[], token0?: Type, token1?: Type) => {
  if (!orders || !token0 || !token1) return orders;
  const srcSymbol = getSymbol(token0, true);
  const dstSymbol = getSymbol(token1, false);
  return orders.filter((order) => {
    return (
      (eqIgnoreCase(order.srcTokenSymbol, srcSymbol) &&
        eqIgnoreCase(order.dstTokenSymbol, dstSymbol)) ||
      (eqIgnoreCase(order.srcTokenSymbol, dstSymbol) &&
        eqIgnoreCase(order.dstTokenSymbol, srcSymbol))
    );
  });
};

type TradeTablesContextType = {
  chainIds: TwapSupportedChainId[];
  currentTab: TABS;
  orders: TwapOrder[];
  ordersLoading: boolean;
  showCurrentPairOnly: boolean;
  onChainChange: (chainId: TwapSupportedChainId) => void;
  setCurrentTab: (currentTab: TABS) => void;
  setShowCurrentPairOnly: (show: boolean) => void;
  isChainLoadingCallback: (chainId: TwapSupportedChainId) => boolean;
};

export enum TABS {
  LIMIT_ORDERS = "limit-orders",
  DCA_ORDERS = "dca-orders",
  HISTORY = "history",
}

const Context = createContext<TradeTablesContextType>(
  {} as TradeTablesContextType
);
export const TradeTablesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DerivedstateSimpleSwapProvider>
      <Content>{children}</Content>
    </DerivedstateSimpleSwapProvider>
  );
};

const Content = ({ children }: { children: React.ReactNode }) => {
  const { chainId: accountChainId, address } = useAccount();
  const [showCurrentPairOnly, setShowCurrentPair] = useState(false);
  const [chainIds, setChainIds] = useState<TwapSupportedChainId[]>([]);
  const [currentTab, setCurrentTab] = useState(TABS.LIMIT_ORDERS);
  const {
    state: { token0, token1 },
  } = useDerivedStateSimpleSwap();

  const {
    data,
    isLoading: ordersLoading,
    loadingChains,
  } = useTwapOrders({
    chainIds,
    account: address,
    enabled: true,
  });

  useEffect(() => {
    if (accountChainId && isTwapSupportedChainId(accountChainId)) {
      setChainIds([accountChainId]);
    }
  }, [accountChainId, setChainIds]);

  const onChainChange = useCallback((chainId: TwapSupportedChainId) => {
    setChainIds((prev) => {
      if (prev.includes(chainId)) {
        return prev.filter((id) => id !== chainId);
      }
      return [...prev, chainId];
    });
  }, []);

  const orders = useMemo(() => {
    return showCurrentPairOnly
      ? filterByPair(data?.ALL ?? [], token0, token1) ?? []
      : data?.ALL ?? [];
  }, [data, token0, token1, showCurrentPairOnly]);

  const setShowCurrentPairOnly = useCallback((show: boolean) => {
    setShowCurrentPair(show);
  }, []);

  const isChainLoadingCallback = useCallback(
    (chainId: TwapSupportedChainId) => {
      return loadingChains.includes(chainId);
    },
    [loadingChains]
  );

  return (
    <Context.Provider
      value={{
        chainIds,
        onChainChange,
        currentTab,
        setCurrentTab,
        orders,
        ordersLoading,
        showCurrentPairOnly,
        setShowCurrentPairOnly,
        isChainLoadingCallback,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useTradeTablesContext = () => {
  return useContext(Context);
};
