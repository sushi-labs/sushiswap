const pageResults = require('graph-results-pager');

const ws = require('isomorphic-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws'); 

const { request, gql } = require('graphql-request');

const {
    subWeeks,
    getUnixTime,
    fromUnixTime
} = require("date-fns");

const { graphAPIEndpoints, graphWSEndpoints, TWENTY_FOUR_HOURS } = require('./../../constants')
const { timestampToBlock, timestampsToBlocks, blockToTimestamp } = require('./../../utils');

const { ethPrice } = require('./../exchange/eth');

module.exports = {
    async pair({block = undefined, timestamp = undefined, pair_address = undefined} = {}) {
        if(!pair_address) { throw new Error("sushi-data: Pair address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.exchange,
            gql`{
                    pair(id: "${pair_address.toLowerCase()}", ${block}) {
                        ${pairs.properties.toString()}
                    }
                }`
        );

        return pairs.callback([result.pair])[0];
    },

    async pair24h({block = undefined, timestamp = undefined, pair_address = undefined} = {}) {
        if(!pair_address) { throw new Error("sushi-data: Pair address undefined"); }
        
        let timestampNow = timestamp ? timestamp : block ? await blockToTimestamp(block) : (Math.floor(Date.now() / 1000));
        timestamp24ago = timestampNow - TWENTY_FOUR_HOURS;
        timestamp48ago = timestamp24ago - TWENTY_FOUR_HOURS;

        block = timestamp ? await timestampToBlock(timestamp) : block;
        block24ago = await timestampToBlock(timestamp24ago);
        block48ago = await timestampToBlock(timestamp48ago);

        const result = await module.exports.pair({block: block, pair_address});
        const result24ago = await module.exports.pair({block: block24ago, pair_address});
        const result48ago = await module.exports.pair({block: block48ago, pair_address});

        const ethPriceUSD = await ethPrice({block: block});
        const ethPriceUSD24ago = await ethPrice({block: block24ago});

        return pairs.callback24h([result], [result24ago], [result48ago], ethPriceUSD, ethPriceUSD24ago)[0];
    },

    async pairHourData({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined, pair_address = undefined} = {}) {
        if(!pair_address) { throw new Error("sushi-data: Pair address undefined"); }
        
        minTimestamp = minBlock ? blockToTimestamp(minBlock) : minTimestamp;
        maxTimestamp = maxBlock ? blockToTimestamp(maxBlock) : maxTimestamp;

        const endTime = maxTimestamp ? fromUnixTime(maxTimestamp) : new Date();
        let time = minTimestamp ? minTimestamp : getUnixTime(subWeeks(endTime, 1));

        // create an array of hour start times until we reach current hour
        const timestamps = [];
        while (time <= getUnixTime(endTime) - 3600) {
            timestamps.push(time);
            time += 3600;
        }

        let blocks = await timestampsToBlocks(timestamps);

        const query = (
            gql`{
                ${blocks.map((block, i) => (gql`
                    timestamp${timestamps[i]}: pair(id: "${pair_address.toLowerCase()}", block: {number: ${block}}) {
                        ${pairs.properties.toString()}
                }`))}
            }`
        );

        let result = await request(graphAPIEndpoints.exchange, query)
        result = Object.keys(result)
            .map(key => ({...result[key], timestamp: Number(key.split("timestamp")[1])}))
            .sort((a, b) => (a.timestamp) - (b.timestamp));

        return pairs.callbackHourData(result);
    },

    async pairDayData({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined, pair_address = undefined} = {}) {
        if(!pair_address) { throw new Error("sushi-data: Pair address undefined"); }
        
        return pageResults({
            api: graphAPIEndpoints.exchange,
            query: {
                entity: 'pairDayDatas',
                selection: {
                    orderDirection: 'desc',
                    where: {
                        pair: `\\"${pair_address.toLowerCase()}\\"`,
                        date_gte: minTimestamp || (minBlock ? await blockToTimestamp(minBlock) : undefined),
                        date_lte: maxTimestamp || (maxBlock ? await blockToTimestamp(maxBlock) : undefined),
                    },
                },
                properties: pairs.propertiesDayData
            }
        })
            .then(results => pairs.callbackDayData(results))
            .catch(err => console.log(err));
    },

    observePair({pair_address = undefined}) {
        if(!pair_address) { throw new Error("sushi-data: Pair address undefined"); }

        const query = gql`
            subscription {
                pair(id: "${pair_address.toLowerCase()}") {
                    ${pairs.properties.toString()}
                }
            }`

        const client = new SubscriptionClient(graphWSEndpoints.exchange, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(pairs.callback([results.data.pair])[0]);
                    },
                    error,
                    complete
                });
            }
        };
    },

    async pairs({block = undefined, timestamp = undefined, max = undefined, pair_addresses = undefined} = {}) {
        if(pair_addresses) {
            
            block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
            block = block ? `block: { number: ${block} }` : "";

            const query = (
                gql`{
                    ${pair_addresses.map((pair, i) => (`
                        pair${i}: pair(id: "${pair.toLowerCase()}", ${block}) {
                            ${pairs.properties.toString()}
                    }`))}
                }`
            );

            const result = Object.values(await request(graphAPIEndpoints.exchange, query));

            return pairs.callback(result);
        }
        
        return pageResults({
            api: graphAPIEndpoints.exchange,
            query: {
                entity: 'pairs',
                selection: {
                    block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
                },
                properties: pairs.properties
            },
            max
        })
            .then(results => pairs.callback(results))
            .catch(err => console.log(err));
    },

    async pairs24h({block = undefined, timestamp = undefined, max = undefined} = {}) {
        let timestampNow = timestamp ? timestamp : block ? await blockToTimestamp(block) : (Math.floor(Date.now() / 1000));
        timestamp24ago = timestampNow - TWENTY_FOUR_HOURS;
        timestamp48ago = timestamp24ago - TWENTY_FOUR_HOURS;

        block = timestamp ? await timestampToBlock(timestamp) : block;
        block24ago = await timestampToBlock(timestamp24ago);
        block48ago = await timestampToBlock(timestamp48ago);

        const results = await module.exports.pairs({block: block, max});
        const results24ago = await module.exports.pairs({block: block24ago, max});
        const results48ago = await module.exports.pairs({block: block48ago, max});

        const ethPriceUSD = await ethPrice({block: block});
        const ethPriceUSD24ago = await ethPrice({block: block24ago});

        return pairs.callback24h(results, results24ago, results48ago, ethPriceUSD, ethPriceUSD24ago);
    },

    observePairs() {
        const query = gql`
            subscription {
                pairs(first: 1000, orderBy: reserveUSD, orderDirection: desc) {
                    ${pairs.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.exchange, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(pairs.callback(results.data.pairs));
                    },
                    error,
                    complete
                });
            }
        };
    }
};


const pairs = {
    properties: [
        'id',
        'token0 { id, name, symbol, totalSupply, derivedETH }',
        'token1 { id, name, symbol, totalSupply, derivedETH }',
        'reserve0',
        'reserve1',
        'totalSupply',
        'reserveETH',
        'reserveUSD',
        'trackedReserveETH',
        'token0Price',
        'token1Price',
        'volumeToken0',
        'volumeToken1',
        'volumeUSD',
        'untrackedVolumeUSD',
        'txCount',
    ],

    callback(results) {
        return results
            .map(result => ({
                id: result.id,
                token0: { 
                    id: result.token0.id,
                    name: result.token0.name,
                    symbol: result.token0.symbol,
                    totalSupply: Number(result.token0.totalSupply),
                    derivedETH: Number(result.token0.derivedETH),
                },
                token1: { 
                    id: result.token1.id,
                    name: result.token1.name,
                    symbol: result.token1.symbol,
                    totalSupply: Number(result.token1.totalSupply),
                    derivedETH: Number(result.token1.derivedETH),
                },
                reserve0: Number(result.reserve0),
                reserve1: Number(result.reserve1),
                totalSupply: Number(result.totalSupply),
                reserveETH: Number(result.reserveETH),
                reserveUSD: Number(result.reserveUSD),
                trackedReserveETH: Number(result.trackedReserveETH),
                token0Price: Number(result.token0Price),
                token1Price: Number(result.token1Price),
                volumeToken0: Number(result.volumeToken0),
                volumeToken1: Number(result.volumeToken1),
                volumeUSD: Number(result.volumeUSD),
                untrackedVolumeUSD: Number(result.untrackedVolumeUSD),
                txCount: Number(result.txCount),
            }))
        .sort((a, b) => b.reserveUSD - a.reserveUSD);     
    },

    callback24h(results, results24h, results48h, ethPriceUSD, ethPriceUSD24ago) {
        return results.map(result => {
            const result24h = results24h.find(e => e.id === result.id) || result;
            const result48h = results48h.find(e => e.id === result.id) || result;

            return ({
                ...result,
                
                trackedReserveUSD: result.trackedReserveETH * ethPriceUSD,
                trackedReserveUSDChange: (result.trackedReserveETH * ethPriceUSD) / (result24h.trackedReserveETH * ethPriceUSD24ago) * 100 - 100,
                trackedReserveUSDChangeCount: result.trackedReserveETH * ethPriceUSD - result24h.trackedReserveETH* ethPriceUSD24ago,

                trackedReserveETHChange: (result.trackedReserveETH / result24h.trackedReserveETH) * 100 - 100,
                trackedReserveETHChangeCount: result.trackedReserveETH - result24h.trackedReserveETH,

                volumeUSDOneDay: result.volumeUSD - result24h.volumeUSD,
                volumeUSDChange: (result.volumeUSD - result24h.volumeUSD) / (result24h.volumeUSD - result48h.volumeUSD) * 100 - 100,
                volumeUSDChangeCount: (result.volumeUSD - result24h.volumeUSD) - (result24h.volumeUSD - result48h.volumeUSD),
                
                untrackedVolumeUSDOneDay: result.untrackedVolumeUSD - result24h.untrackedVolumeUSD,
                untrackedVolumeUSDChange: (result.untrackedVolumeUSD - result24h.untrackedVolumeUSD) / (result24h.untrackedVolumeUSD - result48h.untrackedVolumeUSD) * 100 - 100,
                untrackedVolumeUSDChangeCount: (result.untrackedVolumeUSD - result24h.untrackedVolumeUSD) - (result24h.untrackedVolumeUSD - result48h.untrackedVolumeUSD),

                txCountOneDay: result.txCount - result24h.txCount,
                txCountChange: (result.txCount - result24h.txCount) / (result24h.txCount - result48h.txCount) * 100 - 100,
                txCountChangeCount: (result.txCount - result24h.txCount) - (result24h.txCount - result48h.txCount),
            })});
    },

    callbackHourData(results) {
        return results.map(result => ({
            id: result.id,
            token0: { 
                id: result.token0.id,
                name: result.token0.name,
                symbol: result.token0.symbol,
                totalSupply: Number(result.token0.totalSupply),
                derivedETH: Number(result.token0.derivedETH),
            },
            token1: { 
                id: result.token1.id,
                name: result.token1.name,
                symbol: result.token1.symbol,
                totalSupply: Number(result.token1.totalSupply),
                derivedETH: Number(result.token1.derivedETH),
            },
            reserve0: Number(result.reserve0),
            reserve1: Number(result.reserve1),
            totalSupply: Number(result.totalSupply),
            reserveETH: Number(result.reserveETH),
            reserveUSD: Number(result.reserveUSD),
            trackedReserveETH: Number(result.trackedReserveETH),
            token0Price: Number(result.token0Price),
            token1Price: Number(result.token1Price),
            volumeToken0: Number(result.volumeToken0),
            volumeToken1: Number(result.volumeToken1),
            volumeUSD: Number(result.volumeUSD),
            untrackedVolumeUSD: Number(result.untrackedVolumeUSD),
            txCount: Number(result.txCount),
            timestamp: result.timestamp
        }));
    },

    propertiesDayData: [
        'id',
        'date',
        'volumeUSD',
        'volumeToken0',
        'volumeToken1',
        'reserveUSD',
        'txCount'
    ],

    callbackDayData(results) {
        return results.map(result => ({
            id: result.id,
            date: new Date(result.date * 1000),
            timestamp: Number(result.date),
            volumeUSD: Number(result.volumeUSD),
            volumeToken0: Number(result.volumeToken0),
            volumeToken1: Number(result.volumeToken1),
            liquidityUSD: Number(result.reserveUSD),
            txCount: Number(result.txCount)
        }));
    }
}