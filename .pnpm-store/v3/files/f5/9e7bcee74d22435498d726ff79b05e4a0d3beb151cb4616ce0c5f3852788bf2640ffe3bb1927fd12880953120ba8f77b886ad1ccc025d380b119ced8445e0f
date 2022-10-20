const ws = require('isomorphic-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws'); 

const { request, gql } = require('graphql-request');

const {
    subWeeks,
    getUnixTime,
    fromUnixTime
} = require("date-fns");

const { graphAPIEndpoints, graphWSEndpoints } = require('./../../constants')
const { timestampToBlock, timestampsToBlocks } = require('./../../utils');

module.exports = {
    async ethPrice({block = undefined, timestamp = undefined} = {}) {
        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.exchange,
            gql`{
                    bundle(id: 1, ${block}) {
                        ${ethPrice.properties.toString()}
                    }
                }`
        );

        return ethPrice.callback(result.bundle);
    },

    async ethPriceHourly({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined} = {}) {
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
                    timestamp${timestamps[i]}: bundle(id: 1, block: {number: ${block}}) {
                        ${ethPrice.properties.toString()}
                }`))}
            }`
        );

        let result = await request(graphAPIEndpoints.exchange, query)

        result = Object.keys(result)
            .map(key => ({...result[key], timestamp: key.split("timestamp")[1]}))
            .sort((a, b) => Number(a.timestamp) - (b.timestamp));

        return ethPrice.callbackHourly(result);
    },

    observeEthPrice() {
        const query = gql`
            subscription {
                bundle(id: 1) {
                    ${ethPrice.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.exchange, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(ethPrice.callback(results.data.bundle));
                    },
                    error,
                    complete
                });
            }
        };
    },
}


const ethPrice = {
    properties: [
        'ethPrice'
    ],

    callback(results) {
        return Number(results.ethPrice);
    },

    callbackHourly(results) {
        return results.map(result => ({
            timestamp: Number(result.timestamp),
            priceUSD: Number(result.ethPrice)
        }))
    }
}