"use client";

import { GlobalNav, NavLink } from "@sushiswap/ui13/components/GlobalNav";
import { APP_TYPE_LINKS } from "@sushiswap/ui13/constants";
import { AppType } from "@sushiswap/ui13/types";
import { NetworkSelector } from "@sushiswap/wagmi13/components/NetworkSelector";
import { UserProfile } from "@sushiswap/wagmi13/components/UserProfile";
import React, { FC } from "react";

import { SUPPORTED_CHAIN_IDS } from "../config";

export const Header: FC = () => {
  return (
    <GlobalNav
      appType={AppType.Earn}
      rightElement={
        <>
          <NetworkSelector supportedNetworks={SUPPORTED_CHAIN_IDS} />
          <UserProfile
            clearNotifications={() => {}}
            notifications={{}}
            supportedNetworks={SUPPORTED_CHAIN_IDS}
          />
        </>
      }
    >
      <NavLink title="Swap" href={APP_TYPE_LINKS[AppType.Swap]} />
      <NavLink title="xSwap" href={APP_TYPE_LINKS[AppType.xSwap]} />
    </GlobalNav>
  );
};
