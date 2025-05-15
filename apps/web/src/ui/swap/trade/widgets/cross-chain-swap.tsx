import { CrossChainSwapMaintenanceMessage } from 'src/ui/swap/cross-chain/cross-chain-swap-maintenance-message';
import { CrossChainSwapToken0Input } from 'src/ui/swap/cross-chain/cross-chain-swap-token0-input';
import { CrossChainSwapSwitchTokensButton } from 'src/ui/swap/cross-chain/cross-chain-swap-switch-tokens-button';
import { CrossChainSwapToken1Input } from 'src/ui/swap/cross-chain/cross-chain-swap-token1-input';
import { CrossChainSwapTradeButton } from 'src/ui/swap/cross-chain/cross-chain-swap-trade-button';
import { CrossChainSwapTradeStats } from 'src/ui/swap/cross-chain/cross-chain-swap-trade-stats';
import { CrossChainSwapTokenNotFoundDialog } from 'src/ui/swap/cross-chain/cross-chain-swap-token-not-found-dialog';
import { SimpleSwapBanner } from 'src/ui/swap/simple/simple-swap-banner';
import { classNames } from '@sushiswap/ui';
import { FC } from 'react';

export const CrossChainSwapWidget: FC<{ animated: boolean }> = ({ animated }) => {
  return (
    <div className={classNames("flex flex-col gap-4", { "animate-slide-secondary": animated })}>
      <CrossChainSwapMaintenanceMessage />
      <CrossChainSwapToken0Input />
      <CrossChainSwapSwitchTokensButton />
      <div className="flex flex-col">
        <CrossChainSwapToken1Input />
        <CrossChainSwapTradeButton />
      </div>
      <CrossChainSwapTradeStats />
      <SimpleSwapBanner className="xl:hidden" />
      <CrossChainSwapTokenNotFoundDialog />
    </div>
  )
}
