// TODO: Get rid of manual enums when the DB is migrated

export enum PoolType {
  CONSTANT_PRODUCT_POOL = 'CONSTANT_PRODUCT_POOL',
  STABLE_POOL = 'STABLE_POOL',
  CONCENTRATED_LIQUIDITY_POOL = 'CONCENTRATED_LIQUIDITY_POOL',
}

export enum PoolVersion {
  LEGACY = 'LEGACY',
  TRIDENT = 'TRIDENT',
}

export enum ChefType {
  MasterChefV1 = 'MasterChefV1',
  MasterChefV2 = 'MasterChefV2',
  MiniChef = 'MiniChef',
}

export enum RewarderType {
  Primary = 'Primary',
  Secondary = 'Secondary',
}
