const pageResults = require('graph-results-pager');

const ws = require('isomorphic-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws'); 

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints, graphWSEndpoints } = require('../constants')
const { timestampToBlock } = require('../utils')

module.exports = {
    userHistory({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined, user_address = undefined, max = undefined} = {}) {
        if(!user_address) { throw new Error("sushi-data: User address undefined"); }

        return pageResults({
            api: graphAPIEndpoints.exchange_v1,
            query: {
                entity: 'liquidityPositionSnapshots',
                selection: {
                    where: {
                        user: `\\"${user_address.toLowerCase()}\\"`,
                        block_gte: minBlock || undefined,
                        block_lte: maxBlock || undefined,
                        timestamp_gte: minTimestamp || undefined,
                        timestamp_lte: maxTimestamp || undefined,
                    },
                },
                properties: userHistory.properties
            },
            max
        })
            .then(results => userHistory.callback(results))
            .catch(err => console.log(err));
    },

    async userPositions({block = undefined, timestamp = undefined, user_address = undefined} = {}) {
        if(!user_address) { throw new Error("sushi-data: User address undefined"); }

        return pageResults({
            api: graphAPIEndpoints.exchange_v1,
            query: {
                entity: 'liquidityPositions',
                selection: {
                    where: {
                        user: `\\"${user_address.toLowerCase()}\\"`,
                    },
                    block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
                },
                properties: userPositions.properties
            }
        })
            .then(results => userPositions.callback(results))
            .catch(err => console.log(err));
    }
}

const userHistory = {
    properties: [
        'id',
        'timestamp',
        'block',
        'pair { id, reserve0, reserve1, reserveUSD, token0 { id }, token1 { id } }',
        'token0PriceUSD',
        'token1PriceUSD',
        'reserve0',
        'reserve1',
        'reserveUSD',
        'liquidityTokenTotalSupply',
        'liquidityTokenBalance',        
    ],

    callback(results) {
        return results.map(entry => ({
            id: entry.id,
            timestamp: Number(entry.timestamp),
            block: Number(entry.block),
            pair: {
                id: entry.pair.id,
                reserve0: Number(entry.pair.reserve0),
                reserve1: Number(entry.pair.reserve1),
                reserveUSD: Number(entry.pair.reserveUSD),
                token0: {
                    id: entry.pair.token0.id
                },
                token1: {
                    id: entry.pair.token1.id
                },
            },
            token0PriceUSD: Number(entry.token0PriceUSD),
            token1PriceUSD: Number(entry.token1PriceUSD),
            reserve0: Number(entry.reserve0),
            reserve1: Number(entry.reserve1),
            reserveUSD: Number(entry.reserveUSD),
            liquidityTokenTotalSupply: Number(entry.liquidityTokenTotalSupply),
            liquidityTokenBalance: Number(entry.liquidityTokenBalance),
        }));
    }
};

const userPositions = {
    properties: [
        'id',
        'pair { id, reserve0, reserve1, reserveUSD, token0 { id, symbol, derivedETH }, token1 { id, symbol, derivedETH }, totalSupply }',
        'liquidityTokenBalance',
    ],

    callback(results) {
        return results.map(entry => ({
            id: entry.id,
            pair: {
                id: entry.pair.id,
                reserve0: Number(entry.pair.reserve0),
                reserve1: Number(entry.pair.reserve1),
                reserveUSD: Number(entry.pair.reserveUSD),
                token0: {
                    id: entry.pair.token0.id,
                    symbol: entry.pair.token0.symbol,
                    derivedETH: Number(entry.pair.token0.derivedETH)
                },
                token1: {
                    id: entry.pair.token1.id,
                    symbol: entry.pair.token1.symbol,
                    derivedETH: Number(entry.pair.token1.derivedETH)
                },
                totalSupply: Number(entry.pair.totalSupply)
            },
            liquidityTokenBalance: Number(entry.liquidityTokenBalance)
        }));
    }
}
