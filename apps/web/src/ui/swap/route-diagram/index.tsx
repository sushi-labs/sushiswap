import { useMemo, useState } from "react";
import { Fill, Route } from "./types";
import { SankeyModal } from "./Modal/SankeyModal";
import React from "react";
// import { mockedRoutes } from "./mock-data";
import { UseTradeReturn } from "src/lib/hooks/react-query";

function convertSushiResponseToRoute(
  trade: UseTradeReturn | undefined,
): Route | null {
  console.log({ trade })

  const data3 = {
    liquidityProviders: [
      'NativeWrap',
      'UniswapV2',
      'UniswapV3',
      'PancakeSwapV3',
      'CurveSwap',
    ],
    nodes: [
      {
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        symbol: 'ETH',
        name: 'Ether',
        decimals: 18,
      },
      {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
      },
      {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        symbol: 'WBTC',
        name: 'Wrapped BTC',
        decimals: 8,
      },
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
      },
      {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18,
      },
    ],
    links: [
      {
        source: 0,
        target: 1,
        liquidityProvider: 0,
        amountIn: 1.9999999999999984e21,
        amountOut: 1.9999999999999984e21,
        value: 100,
      },
      {
        source: 1,
        target: 4,
        liquidityProvider: 1,
        amountIn: 52643625543602610000,
        amountOut: 176804648968,
        value: 2.63,
      },
      {
        source: 1,
        target: 3,
        liquidityProvider: 1,
        amountIn: 52624828552106164000,
        amountOut: 176729991258,
        value: 2.63,
      },
      {
        source: 1,
        target: 2,
        liquidityProvider: 2,
        amountIn: 52619385268113330000,
        amountOut: 190216773,
        value: 2.63,
      },
      {
        source: 1,
        target: 2,
        liquidityProvider: 2,
        amountIn: 105267567583466550000,
        amountOut: 380445024,
        value: 5.26,
      },
      {
        source: 1,
        target: 4,
        liquidityProvider: 2,
        amountIn: 52634063657628470000,
        amountOut: 176969406915,
        value: 2.63,
      },
      {
        source: 1,
        target: 4,
        liquidityProvider: 2,
        amountIn: 473691439350120300000,
        amountOut: 1593438242253,
        value: 23.68,
      },
      {
        source: 1,
        target: 4,
        liquidityProvider: 2,
        amountIn: 263161142532548430000,
        amountOut: 885185298548,
        value: 13.16,
      },
      {
        source: 1,
        target: 3,
        liquidityProvider: 2,
        amountIn: 52633406376633770000,
        amountOut: 176907392256,
        value: 2.63,
      },
      {
        source: 1,
        target: 3,
        liquidityProvider: 2,
        amountIn: 105261710721856320000,
        amountOut: 354130128564,
        value: 5.26,
      },
      {
        source: 1,
        target: 3,
        liquidityProvider: 2,
        amountIn: 631570264331138000000,
        amountOut: 2123638845307,
        value: 31.58,
      },
      {
        source: 1,
        target: 3,
        liquidityProvider: 3,
        amountIn: 52630855360928150000,
        amountOut: 176825597700,
        value: 2.63,
      },
      {
        source: 1,
        target: 5,
        liquidityProvider: 2,
        amountIn: 105261710721856300000,
        amountOut: 3.537156385274919e23,
        value: 5.26,
      },
      {
        source: 2,
        target: 4,
        liquidityProvider: 2,
        amountIn: 190290260,
        amountOut: 177198201353,
        value: 2.63,
      },
      {
        source: 2,
        target: 3,
        liquidityProvider: 2,
        amountIn: 190119021,
        amountOut: 176705373114,
        value: 2.63,
      },
      {
        source: 2,
        target: 3,
        liquidityProvider: 2,
        amountIn: 190252516,
        amountOut: 176884062869,
        value: 2.63,
      },
      {
        source: 3,
        target: 5,
        liquidityProvider: 4,
        amountIn: 3361821391068,
        amountOut: 3.3622341798237134e24,
        value: 49.99,
      },
      {
        source: 4,
        target: 5,
        liquidityProvider: 4,
        amountIn: 3009595798037,
        amountOut: 3.009250581680893e24,
        value: 44.75,
      },
    ],
  }

  const data = data3

  const transformed = {
    fills: data.links.map((link) => {
      return {
        from: data.nodes[link.source].address,
        to: data.nodes[link.target].address,
        source: data.liquidityProviders[link.liquidityProvider],
        proportionBps: Math.floor(Number(link.value * 100)),
      } as Fill
    }),
    tokens: data.nodes,
  }

  return transformed
}

export const RouteDiagram = ({
  trade
}: {
  trade: UseTradeReturn
}) => {
  const [sankeyModalOpen, setSankeyModalOpen] = useState(false);
  // const [activeRoute, setActiveRoute] = useState<Route | null>(mockedRoutes[0]);

  const route = useMemo(() =>
    convertSushiResponseToRoute(trade)
    , [
      trade
    ]);

  // const openModalWithRoute = (route: Route) => {
  //   setActiveRoute(route);
  //   setSankeyModalOpen(true);
  // };

  return (
    <>
      {/* <button onClick={() => openModalWithRoute(mockedRoutes[0])}> View </button> */}
      <SankeyModal
        chainId={1}
        route={route}
        isOpen={sankeyModalOpen}
        onClose={() => setSankeyModalOpen(false)}
      />

    </>
  )
}