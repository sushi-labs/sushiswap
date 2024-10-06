import { useMemo, useState } from "react";
import { Fill, Route, Token } from "./types";
import { SankeyModal } from "./Modal/SankeyModal";
import React from "react";
// import { mockedRoutes } from "./mock-data";
import { UseTradeReturn } from "src/lib/hooks/react-query";
import { NativeAddress } from "src/lib/constants";


function convertSushiResponseToRoute(trade: UseTradeReturn): Route | null {
  console.log({ trade })
  console.log("test")

  if (trade.route === undefined) {
    console.log('trade.route is undefined')
    return null
  }
  if (trade.route.legs === undefined) {
    console.log('trade.route.legs is undefined')
    return null
  }
  // if (trade === undefined || trade.route === undefined || trade.route.legs === undefined) return null;
  if (!trade?.route?.fromToken.address && !trade.route.fromToken.isNative) return null;

  if (!trade?.route?.toToken.address && !trade.route.fromToken.isNative) return null;

  const lastDepthPools = trade.route.legs.filter((l) => l.tokenTo.address === trade.route?.toToken.address)
  const totalAmountOut = lastDepthPools.reduce((acc: number, r) => acc + Number(r.assumedAmountOut), 0);
  const lastDepthShares: Record<string, number> = {};
  lastDepthPools.forEach((r) => {
    lastDepthShares[r.poolAddress] = Number(r.assumedAmountOut) / totalAmountOut;
  })


  const cumulativeShares = new Map<string, number>();
  const firstTokenAddress = trade.route.fromToken.isNative ? NativeAddress : trade.route.fromToken.address!;
  cumulativeShares.set(firstTokenAddress, 1);


  const tokensMap = new Map<string, Token>();
  trade.route.legs.forEach((leg) => {
    const tokenFrom = leg.tokenFrom.isNative ? NativeAddress : leg.tokenFrom.address!
    const tokenTo = leg.tokenTo.isNative ? NativeAddress : leg.tokenTo.address!
    if (!tokensMap.has(tokenFrom)) {
      tokensMap.set(tokenFrom, {
        address: tokenFrom,
        symbol: leg.tokenFrom.symbol!
      } as Token)
    }
    if (!tokensMap.has(tokenTo)) {
      tokensMap.set(tokenTo, {
        address: tokenTo,
        symbol: leg.tokenTo.symbol!
      } as Token)
    }
  })

  const transformed = {
    fills: trade.route.legs.map((leg) => {
      const tokenFrom = leg.tokenFrom.isNative ? NativeAddress : leg.tokenFrom.address!
      const tokenTo = leg.tokenTo.isNative ? NativeAddress : leg.tokenTo.address!
      const sourceCumulativeShare = cumulativeShares.get(tokenFrom) || 0;
      const addedShare = sourceCumulativeShare * leg.absolutePortion;
      const newCumulativeShare =
        (cumulativeShares.get(tokenTo) || 0) + addedShare;
      cumulativeShares.set(tokenTo, newCumulativeShare);
      return {
        from: leg.tokenFrom.isNative ? NativeAddress : leg.tokenFrom.address!,
        to: leg.tokenTo.address!,
        source: leg.poolName,
        proportionBps: Math.floor(Number((lastDepthShares[leg.poolAddress] ?? addedShare) * 10_000)),
      } satisfies Fill;
    }),
    tokens: Array.from(tokensMap.values())
  } satisfies Route;

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