const ws = require('isomorphic-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws'); 

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints, graphWSEndpoints, barAddress } = require('./../constants')
const { timestampToBlock } = require('./../utils');

module.exports = {
    async info({block = undefined, timestamp = undefined} = {}) {
        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.bar,
            gql`{
                    bar(id: "${barAddress}", ${block}) {
                        ${info.properties.toString()}
                    }
                }`
        );

        return info.callback(result.bar);
    },

    observeInfo() {
        const query = gql`
            subscription {
                bar(id: "${barAddress}") {
                    ${info.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.bar, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(info.callback(results.data.bar));
                    },
                    error,
                    complete
                });
            }
        };
    },

    async user({block = undefined, timestamp = undefined, user_address = undefined} = {}) {
        if(!user_address) { throw new Error("sushi-data: User address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.bar,
            gql`{
                    user(id: "${user_address.toLowerCase()}", ${block}) {
                        ${user.properties.toString()}
                    }
                }`
        );

        return user.callback(result.user);
    },
}

const info = {
    properties: [
        'decimals',
        'name',
        'sushi',
        'symbol',
        'totalSupply',
        'ratio',
        'xSushiMinted',
        'xSushiBurned',
        'sushiStaked',
        'sushiStakedUSD',
        'sushiHarvested',
        'sushiHarvestedUSD',
        'xSushiAge',
        'xSushiAgeDestroyed',
        'updatedAt'
    ],

    callback(results) {
        return ({
            decimals: Number(results.decimals),
            name: results.name,
            sushi: results.sushi,
            symbol: results.symbol,
            totalSupply: Number(results.totalSupply),
            ratio: Number(results.ratio),
            xSushiMinted: Number(results.xSushiMinted),
            xSushiBurned: Number(results.xSushiBurned),
            sushiStaked: Number(results.totalSupply) * Number(results.ratio),
            sushiStakedUSD: Number(results.sushiStakedUSD),
            sushiHarvested: Number(results.sushiHarvested),
            sushiHarvestedUSD: Number(results.sushiHarvestedUSD),
            xSushiAge: Number(results.xSushiAge),
            xSushiAgeDestroyed: Number(results.xSushiAgeDestroyed),
            updatedAt: Number(results.updatedAt)
        })
    }
};

const user = {
    properties: [
        'xSushi',
        'xSushiIn',
        'xSushiOut',
        'xSushiMinted',
        'xSushiBurned',
        'xSushiOffset',
        'xSushiAge',
        'xSushiAgeDestroyed',
        'sushiStaked',
        'sushiStakedUSD',
        'sushiHarvested',
        'sushiHarvestedUSD',
        'sushiIn',
        'sushiOut',
        'usdOut',
        'usdIn',
        'updatedAt',
        'sushiOffset',
        'usdOffset'
    ],

    callback(results) {
        return ({
            xSushi: Number(results.xSushi),
            xSushiIn: Number(results.xSushiIn),
            xSushiOut: Number(results.xSushiOut),
            xSushiMinted: Number(results.xSushiMinted),
            xSushiBurned: Number(results.xSushiBurned),
            xSushiOffset: Number(results.xSushiOffset),
            xSushiAge: Number(results.xSushiAge),
            xSushiAgeDestroyed: Number(results.xSushiAgeDestroyed),
            sushiStaked: Number(results.sushiStaked),
            sushiStakedUSD: Number(results.sushiStakedUSD),
            sushiHarvested: Number(results.sushiHarvested),
            sushiHarvestedUSD: Number(results.sushiHarvestedUSD),
            sushiIn: Number(results.sushiIn),
            sushiOut: Number(results.sushiOut),
            usdOut: Number(results.usdOut),
            usdIn: Number(results.usdIn),
            updatedAt: Number(results.updatedAt),
            sushiOffset: Number(results.sushiOffset),
            usdOffset: Number(results.usdOffset)
        })
    }
};