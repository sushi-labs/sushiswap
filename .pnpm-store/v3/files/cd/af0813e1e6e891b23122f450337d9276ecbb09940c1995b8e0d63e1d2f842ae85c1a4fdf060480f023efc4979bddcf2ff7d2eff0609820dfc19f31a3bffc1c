type Clone = {
  address: string;
  block: number;
  timestamp: number;
}

type Pair = {
  id: string;
  name: string;
  symbol: string;
  asset: string;
  assetSymbol: string;
  assetDecimals: number;
  collateral: string;
  collateralSymbol: string;
  collateralDecimals: number;
  totalAssetBase: number;
  totalAssetElastic: number;
  totalAssetStaked: number;
  balanceUSD: number;
  rewardPerBlock: number;
  roiPerBlock: number;
  roiPerYear: number;
}

export function clones({ masterAddress, chainId }?: {
  masterAddress?: string;
  chainId?: number;
}): Promise<Clone>;

export function kashiStakedInfo(): Promise<Pair[]>;
