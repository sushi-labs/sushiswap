var PoolType;
(function (PoolType) {
    PoolType["CONSTANT_PRODUCT_POOL"] = "CONSTANT_PRODUCT_POOL";
    PoolType["STABLE_POOL"] = "STABLE_POOL";
    PoolType["CONCENTRATED_LIQUIDITY_POOL"] = "CONCENTRATED_LIQUIDITY_POOL";
})(PoolType || (PoolType = {}));
var PoolVersion;
(function (PoolVersion) {
    PoolVersion["LEGACY"] = "LEGACY";
    PoolVersion["TRIDENT"] = "TRIDENT";
})(PoolVersion || (PoolVersion = {}));
var RewarderType;
(function (RewarderType) {
    RewarderType["Primary"] = "Primary";
    RewarderType["Secondary"] = "Secondary";
})(RewarderType || (RewarderType = {}));
export const EVM_APP_BASE_URL = process.env['POOLS_API_V0_BASE_URL'] ||
    process.env['NEXT_PUBLIC_POOLS_API_V0_BASE_URL'] ||
    'https://pools.sushi.com';
export function parseArgs(args) {
    if (!args)
        return '';
    return Object.entries(args).reduce((acc, [key, value]) => {
        if (value === undefined)
            return acc;
        return `${acc}&${key}=${Array.isArray(value) ? value.join(',') : value}`;
    }, '?');
}
export const getPool = async (poolId) => {
    return fetch(`${EVM_APP_BASE_URL}/api/v0?ids=${poolId}`)
        .then((data) => data.json())
        .then((data) => data[0]);
};
export const getPools = async (args) => {
    return fetch(`${EVM_APP_BASE_URL}/api/v0${parseArgs(args)}`).then((data) => data.json());
};
export const getPoolCount = async (args) => fetch(`${EVM_APP_BASE_URL}/api/v0/count${parseArgs(args)}`)
    .then((data) => data.json())
    .then((data) => data.count);
//# sourceMappingURL=pools.js.map