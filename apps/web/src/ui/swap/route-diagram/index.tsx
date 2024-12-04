import { useMemo, useState } from "react";
import { Fill, Route } from "./types";
import { SankeyModal } from "./Modal/SankeyModal";
import React from "react";
// import { mockedRoutes } from "./mock-data";
import { UseTradeReturn } from "src/lib/hooks/react-query";


function convertSushiResponseToRoute(
  trade: UseTradeReturn | undefined,
): Route | null {
  console.log({trade})
  if (trade === undefined || trade.route === undefined) return null
  const data = trade.route
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
  console.log({transformed})
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