// import { useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  // useCallback,
  // useEffect, useMemo,
  useState,
} from 'react'
// import {
// 	SUPPORTED_CHAIN_IDS,
// 	TWAP_SUPPORTED_CHAIN_IDS,
// 	type TwapSupportedChainId,
// 	getSortedChainIds,
// 	isTwapSupportedChainId,
// } from "src/config";
// import { type TwapOrder, useTwapOrders } from "src/lib/hooks/react-query/twap";
// import type { EvmChainId } from "sushi/chain";
// import { useAccount } from "wagmi";
// import { SushiSwapProtocol } from 'sushi';

type TablesContextType = {
  // ordersChainIds: EvmChainId[];
  // lpChainIds: EvmChainId[];
  // ordersTab: ORDERS_TABS;
  // orders: TwapOrder[];
  // ordersLoading: boolean;
  // onOrdersChainChange: (chainId: EvmChainId) => void;
  // onLPChainChange: (chainId: EvmChainId) => void;
  // setOrdersTab: (tab: ORDERS_TABS) => void;
  // isChainLoadingCallback: (chainId: TwapSupportedChainId) => boolean;
  // protocol: SushiSwapProtocol[];
  // setProtocol: (protocol: SushiSwapProtocol[]) => void;
  tableView: PORTFOLIO_TABLE_VIEW
  setTableView: (view: PORTFOLIO_TABLE_VIEW) => void
}

// export enum ORDERS_TABS {
// 	LIMIT_ORDERS = "limit-orders",
// 	DCA_ORDERS = "dca-orders",
// 	HISTORY = "history",
// }

export enum PORTFOLIO_TABLE_VIEW {
  ALL = 'All',
  LP_POSITIONS = 'LP Positions',
  OPEN_ORDERS = 'Open Orders',
}

const Context = createContext<TablesContextType>({} as TablesContextType)

const Content = ({ children }: { children: React.ReactNode }) => {
  const [tableView, setTableView] = useState<PORTFOLIO_TABLE_VIEW>(
    PORTFOLIO_TABLE_VIEW.ALL,
  )
  // const { address } = useAccount();
  // const [protocol, setProtocol] = useState<SushiSwapProtocol[]>([]);
  // const [ordersChainIds, setOrdersChainIds] = useState<EvmChainId[]>([]);
  // const [lpChainIds, setLPChainIds] = useState<EvmChainId[]>([]);
  // const [ordersTab, setOrdersTab] = useState(ORDERS_TABS.LIMIT_ORDERS);
  // const searchParams = useSearchParams();
  // const isMarketHistoryTabSelected = searchParams.get("history-table-tab") === "true";

  // const {
  // 	data,
  // 	isLoading: ordersLoading,
  // 	loadingChains,
  // } = useTwapOrders({
  // 	chainIds: ordersChainIds.filter((chainId) => isTwapSupportedChainId(chainId)),
  // 	account: address,
  // 	enabled: Boolean(address),
  // });

  // useEffect(() => {
  // 	if (isMarketHistoryTabSelected) {
  // 		setOrdersChainIds(getSortedChainIds(SUPPORTED_CHAIN_IDS.map((chainId) => chainId)));
  // 	} else {
  // 		setOrdersChainIds(getSortedChainIds(TWAP_SUPPORTED_CHAIN_IDS.map((chainId) => chainId)));
  // 	}
  // }, [isMarketHistoryTabSelected]);

  // const onOrdersChainChange = useCallback((chainId: EvmChainId) => {
  // 	setOrdersChainIds((prev) => {
  // 		if (prev.includes(chainId)) {
  // 			return prev.filter((id) => id !== chainId);
  // 		}
  // 		return [...prev, chainId];
  // 	});
  // }, []);

  // const onLPChainChange = useCallback((chainId: EvmChainId) => {
  // 	setLPChainIds((prev) => {
  // 		if (prev.includes(chainId)) {
  // 			return prev.filter((id) => id !== chainId);
  // 		}
  // 		return [...prev, chainId];
  // 	});
  // }, []);

  // const orders = useMemo(() => {
  // 	return data?.ALL ?? [];
  // }, [data]);

  // const isChainLoadingCallback = useCallback(
  // 	(chainId: TwapSupportedChainId) => {
  // 		return loadingChains.includes(chainId);
  // 	},
  // 	[loadingChains]
  // );

  return (
    <Context.Provider
      value={{
        // ordersChainIds,
        // onOrdersChainChange,
        // ordersTab,
        // setOrdersTab,
        // orders,
        // ordersLoading,
        // isChainLoadingCallback,
        // lpChainIds,
        // onLPChainChange,
        // protocol,
        // setProtocol,
        tableView,
        setTableView,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const TablesProvider = ({ children }: { children: React.ReactNode }) => {
  return <Content>{children}</Content>
}

export const useTablesContext = () => {
  return useContext(Context)
}
