const pageResults = require('graph-results-pager');

const ws = require('isomorphic-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws'); 

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints, graphWSEndpoints, factoryAddress, TWENTY_FOUR_HOURS } = require('./../../constants')
const { timestampToBlock, blockToTimestamp } = require('./../../utils');

module.exports = {
    async factory({block = undefined, timestamp = undefined} = {}) {
        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.exchange,
            gql`{
                    factory(id: "${factoryAddress}", ${block}) {
                        ${factory.properties.toString()}
                    }
                }`
        );

        return factory.callback(result.factory);
    },

    observeFactory() {
        const query = gql`
            subscription {
                factory(id: "${factoryAddress}") {
                    ${factory.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.exchange, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(factory.callback(results.data.factory));
                    },
                    error,
                    complete
                });
            }
        };
    },

    async dayData({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.exchange,
            query: {
                entity: 'dayDatas',
                selection: {
                    orderDirection: 'desc',
                    where: {
                        date_gte: minTimestamp || (minBlock ? await blockToTimestamp(minBlock) : undefined),
                        date_lte: maxTimestamp || (maxBlock ? await blockToTimestamp(maxBlock) : undefined),
                    },
                },
                properties: dayData.properties
            }
        })
        .then(results => dayData.callback(results))
        .catch(err => console.log(err));
    },

    async twentyFourHourData({block = undefined, timestamp = undefined} = {}) {
        timestamp = timestamp ? timestamp : block ? await blockToTimestamp(block) : (Date.now() / 1000)
        timestamp24ago = timestamp - TWENTY_FOUR_HOURS;

        block = await timestampToBlock(timestamp);
        block24ago = await timestampToBlock(timestamp24ago);

        block = `block: { number: ${block} }`;
        block24ago = `block: { number: ${block24ago} }`;

        const result = await request(graphAPIEndpoints.exchange,
            gql`{
                    factory(id: "${factoryAddress}", ${block}) {
                        ${twentyFourHourData.properties.toString()}
                    }
                }`
        );

        const result24ago = await request(graphAPIEndpoints.exchange,
            gql`{
                    factory(id: "${factoryAddress}", ${block24ago}) {
                        ${twentyFourHourData.properties.toString()}
                    }
                }`
        );

        return twentyFourHourData.callback(result.factory, result24ago.factory);
    }
};

const factory = {
    properties: [
        'pairCount',
        'volumeUSD',
        'volumeETH',
        'untrackedVolumeUSD',
        'liquidityUSD',
        'liquidityETH',
        'txCount',
        'tokenCount',
        'userCount',
    ],

    callback(results) {
        return ({
            pairCount: Number(results.pairCount),
			volumeUSD: Number(results.volumeUSD),
			volumeETH: Number(results.volumeETH),
			untrackedVolumeUSD: Number(results.untrackedVolumeUSD),
			liquidityUSD: Number(results.liquidityUSD),
			liquidityETH: Number(results.liquidityETH),
			txCount: Number(results.txCount),
			tokenCount: Number(results.tokenCount),
			userCount: Number(results.userCount),
        });
    }
};

const dayData = {
    properties: [
        'id',
        'date',
        'volumeETH',
        'volumeUSD',
        'liquidityETH',
        'liquidityUSD',
        'txCount'
    ],

    callback(results) {
        return results.map(({ id, date, volumeETH, volumeUSD, liquidityETH, liquidityUSD, txCount }) => ({
            id: Number(id),
            date: new Date(date * 1000),
            volumeETH: Number(volumeETH),
            volumeUSD: Number(volumeUSD),
            liquidityETH: Number(liquidityETH),
            liquidityUSD: Number(liquidityUSD),
            txCount: Number(txCount),
        }));
    }
};

const twentyFourHourData = {
    properties: [
        'id',
        'volumeUSD',
        'volumeETH',
        'untrackedVolumeUSD',
        'liquidityUSD',
        'liquidityETH',
        'txCount',
        'pairCount'
    ],

    callback(results, results24ago) {
        return ({
            id: results.id,
            volumeUSD: Number(results.volumeUSD) - Number(results24ago.volumeUSD),
            volumeETH: Number(results.volumeETH) - Number(results24ago.volumeETH),
            untrackedVolumeUSD: Number(results.untrackedVolumeUSD) - Number(results24ago.untrackedVolumeUSD),
            liquidityETH: Number(results.liquidityETH) - Number(results24ago.liquidityETH),
            liquidityUSD: Number(results.liquidityUSD) - Number(results24ago.liquidityUSD),
            txCount: Number(results.txCount) - Number(results24ago.txCount),
            pairCount: Number(results.pairCount) - Number(results24ago.pairCount)
        })
    }
}
