const ws = require('isomorphic-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws'); 

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints, graphWSEndpoints } = require('./../constants')
const { timestampToBlock } = require('./../utils')

module.exports = {
    async latestBlock() {
        const result = await request(graphAPIEndpoints.blocklytics,
            gql`{
                blocks(first: 1, orderBy: number, orderDirection: desc) {
                    ${latestBlock.properties.toString()}
                }
            }`
        );

        return latestBlock.callback(result.blocks);
    },

    observeLatestBlock() {
        const query = gql`
            subscription {
                blocks(first: 1, orderBy: number, orderDirection: desc) {
                    ${latestBlock.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.blocklytics, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(latestBlock.callback(results.data.blocks));
                    },
                    error,
                    complete
                })
            }
        };
    },

    async getBlock({block = undefined, timestamp = undefined} = {}) {
        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.blocklytics,
            gql`{
                blocks(first: 1, orderBy: number, orderDirection: desc, ${block}) {
                    ${getBlock.properties.toString()}
                }
            }`
        );

        return getBlock.callback(result.blocks[0]);
    }
}

const latestBlock = {
    properties: [
        'id',
        'number',
        'timestamp'
    ],

    callback([{ id, number, timestamp }]) {
        return ({
            id: id,
            number: Number(number),
            timestamp: Number(timestamp),
            date: new Date(timestamp * 1000)
        });
    }
};

const getBlock = {
    properties: [
        'id',
        'number',
        'timestamp',
        'author',
        'difficulty',
        'gasUsed',
        'gasLimit'
    ],

    callback(results) {
        return ({
            id: results.id,
            number: Number(results.number),
            timestamp: Number(results.timestamp),
            author: results.author,
            difficulty: Number(results.difficulty),
            gasUsed: Number(results.gasUsed),
            gasLimit: Number(results.gasLimit)
        })
    }
}