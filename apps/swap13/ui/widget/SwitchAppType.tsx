"use client";

import { RadioGroup } from "@headlessui/react";
import { Button } from "@sushiswap/ui13/components/button";
import { AppType } from "@sushiswap/ui13/types";
import React, { FC } from "react";

import { useSwapActions, useSwapState } from "../TradeProvider";

export const SwitchAppType: FC = () => {
  const { appType } = useSwapState();
  const { setAppType } = useSwapActions();

  return (
    <RadioGroup value={appType} onChange={setAppType} className="flex gap-2">
      <RadioGroup.Option
        as={Button}
        variant={appType === AppType.Swap ? "outlined" : "empty"}
        size="sm"
        value={AppType.Swap}
        color="default"
        className={({ checked }: { checked: boolean }) =>
          checked
            ? "text-gray-900 dark:text-slate-200"
            : "dark:text-slate-600 text-gray-400 hover:text-gray-900 hover:dark:text-white"
        }
      >
        {AppType.Swap}
      </RadioGroup.Option>
      <RadioGroup.Option
        as={Button}
        variant={appType === AppType.xSwap ? "outlined" : "empty"}
        size="sm"
        value={AppType.xSwap}
        color="default"
        className={({ checked }: { checked: boolean }) =>
          checked
            ? "text-gray-900 dark:text-white"
            : "dark:text-slate-600 text-gray-400 hover:text-gray-900 hover:dark:text-white"
        }
      >
        {AppType.xSwap}
      </RadioGroup.Option>
    </RadioGroup>
  );
};
