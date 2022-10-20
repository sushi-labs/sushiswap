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
    async token({block = undefined, timestamp = undefined, token_address = undefined} = {}) {
        if(!token_address) { throw new Error("sushi-data: Token address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.exchange,
            gql`{
                    token(id: "${token_address.toLowerCase()}", ${block}) {
                        ${tokens.properties.toString()}
                    }
                }`
        );

        return tokens.callback([result.token])[0];
    },

    async token24h({block = undefined, timestamp = undefined, token_address = undefined} = {}) {
        if(!token_address) { throw new Error("sushi-data: Token address undefined"); }

        let timestampNow = timestamp ? timestamp : block ? await blockToTimestamp(block) : (Math.floor(Date.now() / 1000));
        timestamp24ago = timestampNow - TWENTY_FOUR_HOURS;
        timestamp48ago = timestamp24ago - TWENTY_FOUR_HOURS;

        block = timestamp ? await timestampToBlock(timestamp) : block;
        block24ago = await timestampToBlock(timestamp24ago);
        block48ago = await timestampToBlock(timestamp48ago);

        const result = await module.exports.token({block: block, token_address});
        const result24ago = await module.exports.token({block: block24ago, token_address});
        const result48ago = await module.exports.token({block: block48ago, token_address});

        const ethPriceUSD = await ethPrice({block: block});
        const ethPriceUSD24ago = await ethPrice({block: block24ago});

        return tokens.callback24h([result], [result24ago], [result48ago], ethPriceUSD, ethPriceUSD24ago)[0];
    },

    async tokenHourData({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined, token_address = undefined} = {}) {
        if(!token_address) { throw new Error("sushi-data: Token address undefined"); }
        
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
                    timestamp${timestamps[i]}: token(id: "${token_address.toLowerCase()}", block: {number: ${block}}) {
                        ${tokens.properties.toString()}
                }`))}
            }`
        );

        let result = await request(graphAPIEndpoints.exchange, query)
        result = Object.keys(result)
            .map(key => ({...result[key], timestamp: Number(key.split("timestamp")[1])}))
            .sort((a, b) => (a.timestamp) - (b.timestamp));

        return tokens.callbackHourData(result);
    },

    async tokenDayData({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined, token_address = undefined} = {}) {
        if(!token_address) { throw new Error("sushi-data: Token address undefined"); }
        
        return pageResults({
            api: graphAPIEndpoints.exchange,
            query: {
                entity: 'tokenDayDatas',
                selection: {
                    orderDirection: 'desc',
                    where: {
                        token: `\\"${token_address.toLowerCase()}\\"`,
                        date_gte: minTimestamp || (minBlock ? await blockToTimestamp(minBlock) : undefined),
                        date_lte: maxTimestamp || (maxBlock ? await blockToTimestamp(maxBlock) : undefined),
                    },
                },
                properties: tokens.propertiesDayData
            }
        })
            .then(results => tokens.callbackDayData(results))
            .catch(err => console.log(err));
    },

    observeToken({token_address = undefined}) {
        if(!token_address) { throw new Error("sushi-data: Token address undefined"); }

        const query = gql`
            subscription {
                token(id: "${token_address.toLowerCase()}") {
                    ${tokens.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.exchange, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(tokens.callback([results.data.token])[0]);
                    },
                    error,
                    complete
                });
            }
        };
    },

    async tokens({block = undefined, timestamp = undefined, max = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.exchange,
            query: {
                entity: 'tokens',
                selection: {
                    block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
                },
                properties: tokens.properties
            },
            max
        })
            .then(results => tokens.callback(results))
            .catch(err => console.log(err));
    },

    async tokens24h({block = undefined, timestamp = undefined, max = undefined} = {}) {
        let timestampNow = timestamp ? timestamp : block ? await blockToTimestamp(block) : (Math.floor(Date.now() / 1000));
        timestamp24ago = timestampNow - TWENTY_FOUR_HOURS;
        timestamp48ago = timestamp24ago - TWENTY_FOUR_HOURS;

        block = timestamp ? await timestampToBlock(timestamp) : block;
        block24ago = await timestampToBlock(timestamp24ago);
        block48ago = await timestampToBlock(timestamp48ago);

        const results = await module.exports.tokens({block: block, max});
        const results24ago = await module.exports.tokens({block: block24ago, max});
        const results48ago = await module.exports.tokens({block: block48ago, max});

        const ethPriceUSD = await ethPrice({block: block});
        const ethPriceUSD24ago = await ethPrice({block: block24ago});

        return tokens.callback24h(results, results24ago, results48ago, ethPriceUSD, ethPriceUSD24ago);
    },

    observeTokens() {
        const query = gql`
            subscription {
                tokens(first: 1000, orderBy: volumeUSD, orderDirection: desc) {
                    ${tokens.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.exchange, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(tokens.callback(results.data.tokens));
                    },
                    error,
                    complete
                });
            }
        };
    },
};

const tokens = {
    properties: [
        'id',
        'symbol',
        'name',
        'decimals',
        'totalSupply',
        'volume',
        'volumeUSD',
        'untrackedVolumeUSD',
        'txCount',
        'liquidity',
        'derivedETH'
    ],

    callback(results) {
        return results
            .map(({ id, symbol, name, decimals, totalSupply, volume, volumeUSD, untrackedVolumeUSD, txCount, liquidity, derivedETH }) => ({
                id: id,
                symbol: symbol,
                name: name,
                decimals: Number(decimals),
                totalSupply: Number(totalSupply),
                volume: Number(volume),
                volumeUSD: Number(volumeUSD),
                untrackedVolumeUSD: Number(untrackedVolumeUSD),
                txCount: Number(txCount),
                liquidity: Number(liquidity),
                derivedETH: Number(derivedETH)
            }))
        .sort((a, b) => b.volumeUSD - a.volumeUSD);
    },

    callback24h(results, results24h, results48h, ethPriceUSD, ethPriceUSD24ago) {
        return results.map(result => {
            const result24h = results24h.find(e => e.id === result.id) || result;
            const result48h = results48h.find(e => e.id === result.id) || result;

            return ({
                ...result,
                
                priceUSD: result.derivedETH * ethPriceUSD,
                priceUSDChange: (result.derivedETH * ethPriceUSD) / (result24h.derivedETH * ethPriceUSD24ago) * 100 - 100,
                priceUSDChangeCount: (result.derivedETH * ethPriceUSD) - (result24h.derivedETH * ethPriceUSD24ago),
                
                liquidityUSD: result.liquidity * result.derivedETH * ethPriceUSD,
                liquidityUSDChange: (result.liquidity * result.derivedETH * ethPriceUSD) / (result24h.liquidity * result24h.derivedETH * ethPriceUSD24ago) * 100 - 100,
                liquidityUSDChangeCount: result.liquidity * result.derivedETH * ethPriceUSD - result24h.liquidity * result24h.derivedETH * ethPriceUSD24ago,
                
                liquidityETH: result.liquidity * result.derivedETH,
                liquidityETHChange: (result.liquidity * result.derivedETH) / (result24h.liquidity * result24h.derivedETH) * 100 - 100,
                liquidityETHChangeCount: result.liquidity * result.derivedETH - result24h.liquidity * result24h.derivedETH,
                
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
            symbol: result.symbol,
            name: result.name,
            decimals: Number(result.decimals),
            totalSupply: Number(result.totalSupply),
            volume: Number(result.volume),
            volumeUSD: Number(result.volumeUSD),
            untrackedVolumeUSD: Number(result.untrackedVolumeUSD),
            txCount: Number(result.txCount),
            liquidity: Number(result.liquidity),
            derivedETH: Number(result.derivedETH),
            timestamp: result.timestamp
        }));
    },

    propertiesDayData: [
        'id',
        'date',
        'volume',
        'volumeETH',
        'volumeUSD',
        'liquidity',
        'liquidityETH',
        'liquidityUSD',
        'priceUSD',
        'txCount'
    ],

    callbackDayData(results) {
        return results.map(result => ({
            id: result.id,
            date: new Date(result.date * 1000),
            timestamp: Number(result.date),
            volume: Number(result.volume),
            volumeETH: Number(result.volumeETH),
            volumeUSD: Number(result.volumeUSD),
            liquidity: Number(result.liquidity),
            liquidityETH: Number(result.liquidityETH),
            liquidityUSD: Number(result.liquidityUSD),
            priceUSD: Number(result.priceUSD),
            txCount: Number(result.txCount)
        }));
    }
};
