const pageResults = require('graph-results-pager');

const { graphAPIEndpoints } = require('./../constants');
const { timestampToBlock } = require('./../utils');

module.exports = {		    
    async queuedTxs({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined, max = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.timelock,
            query: {
                entity: 'timelocks',
                selection: {
                    where: {
                        isCanceled: false,
                        isExecuted: false,
                        createdBlock_gte: minBlock || (minTimestamp ? await timestampToBlock(minTimestamp) : undefined),
                        createdBlock_lte: maxBlock || (maxTimestamp ? await timestampToBlock(maxTimestamp) : undefined),
                    }
                },
                properties: queuedTxs.properties
            },
            max
        })
            .then(results => queuedTxs.callback(results))
            .catch(err => console.log(err));
    },

    async canceledTxs({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined, max = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.timelock,
            query: {
                entity: 'timelocks',
                selection: {
                    where: {
                        isCanceled: true,
                        createdBlock_gte: minBlock || (minTimestamp ? await timestampToBlock(minTimestamp) : undefined),
                        createdBlock_lte: maxBlock || (maxTimestamp ? await timestampToBlock(maxTimestamp) : undefined),
                    },
                },
                properties: canceledTxs.properties
            },
            max
        })
            .then(results => canceledTxs.callback(results))
            .catch(err => console.log(err));
    },

    async executedTxs({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined, max = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.timelock,
            query: {
                entity: 'timelocks',
                selection: {
                    where: {
                        isExecuted: true,
                        createdBlock_gte: minBlock || (minTimestamp ? await timestampToBlock(minTimestamp) : undefined),
                        createdBlock_lte: maxBlock || (maxTimestamp ? await timestampToBlock(maxTimestamp) : undefined),
                    }
                },
                properties: executedTxs.properties
            },
            max
        })
            .then(results => executedTxs.callback(results))
            .catch(err => console.log(err));
    },

    async allTxs({minTimestamp = undefined, maxTimestamp = undefined, minBlock = undefined, maxBlock = undefined, max = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.timelock,
            query: {
                entity: 'timelocks',
                selection: {
                    where: {
                        createdBlock_gte: minBlock || (minTimestamp ? await timestampToBlock(minTimestamp) : undefined),
                        createdBlock_lte: maxBlock || (maxTimestamp ? await timestampToBlock(maxTimestamp) : undefined),
                    },
                },
                properties: allTxs.properties
            },
            max
        })
            .then(results => allTxs.callback(results))
            .catch(err => console.log(err));
    }
}

const queuedTxs = {
    properties: [
        'id',
        'description',
        'value',
        'eta',
        'functionName',
        'data',
        'targetAddress',
        'createdBlock',
        'createdTs',
        'expiresTs',
        'createdTx',
    ],

    callback(results) {
        return results
            .map(({ id, description, value, eta, functionName, data, targetAddress, createdBlock, createdTs, expiresTs, createdTx }) => ({
                txHash: id,
                description: description,
                value: Number(value),
                etaTs: Number(eta * 1000),
                etaDate: new Date(eta * 1000),
                functionName: functionName,
                data: data,
                targetAddress: targetAddress,
                createdBlock: Number(createdBlock),
                createdTs: Number(createdTs * 1000),
                createdDate: new Date(createdTs * 1000),
                expiresTs: Number(expiresTs * 1000),
                expiresDate: new Date(expiresTs * 1000),
                createdTx: createdTx,
            }))
        .sort((a, b) => b.createdBlock - a.createdBlock);
    }
};

const canceledTxs = {
    properties: [
        'id',
        'description',
        'value',
        'eta',
        'functionName',
        'data',
        'targetAddress',
        'createdBlock',
        'createdTs',
        'expiresTs',
        'canceledBlock',
        'canceledTs',
        'createdTx',
        'canceledTx',
    ],

    callback(results) {
        return results
            .map(({ id, description, value, eta, functionName, data, targetAddress, createdBlock, createdTs, expiresTs, canceledBlock, canceledTs, createdTx, canceledTx }) => ({
                txHash: id,
                description: description,
                value: Number(value),
                etaTs: Number(eta * 1000),
                etaDate: new Date(eta * 1000),
                functionName: functionName,
                data: data,
                targetAddress: targetAddress,
                createdBlock: Number(createdBlock),
                createdTs: Number(createdTs * 1000),
                createdDate: new Date(createdTs * 1000),
                expiresTs: Number(expiresTs * 1000),
                expiresDate: new Date(expiresTs * 1000),
                canceledBlock: canceledTx ? Number(canceledBlock) : null,
                canceledTs: canceledTx ? Number(canceledTs * 1000) : null,
                canceledDate: canceledTx ? new Date(canceledTs * 1000) : null,
                createdTx: createdTx,
                canceledTx: canceledTx,
            }))
        .sort((a, b) => b.createdBlock - a.createdBlock);
    }
};

const executedTxs = {
    properties: [
        'id',
        'description',
        'value',
        'eta',
        'functionName',
        'data',
        'targetAddress',
        'createdBlock',
        'createdTs',
        'expiresTs',
        'executedBlock',
        'executedTs',
        'createdTx',
        'executedTx'
    ],

    callback(results) {
        return results
            .map(({ id, description, value, eta, functionName, data, targetAddress, createdBlock, createdTs, expiresTs, executedBlock, executedTs, createdTx, executedTx }) => ({
                txHash: id,
                description: description,
                value: Number(value),
                etaTs: Number(eta * 1000),
                etaDate: new Date(eta * 1000),
                functionName: functionName,
                data: data,
                targetAddress: targetAddress,
                createdBlock: Number(createdBlock),
                createdTs: Number(createdTs * 1000),
                createdDate: new Date(createdTs * 1000),
                expiresTs: Number(expiresTs * 1000),
                expiresDate: new Date(expiresTs * 1000),
                executedBlock: executedTx ? Number(executedBlock) : null,
                executedTs: executedTx ? Number(executedTs * 1000) : null,
                executedDate: executedTx ? new Date(executedTs * 1000) : null,
                createdTx: createdTx,
                executedTx: executedTx
            }))
            .sort((a, b) => b.createdBlock - a.createdBlock);;
    }
};

const allTxs = {
    properties: [
        'id',
        'description',
        'value',
        'eta',
        'functionName',
        'data',
        'targetAddress',
        'isCanceled',
        'isExecuted',
        'createdBlock',
        'createdTs',
        'expiresTs',
        'canceledBlock',
        'canceledTs',
        'executedBlock',
        'executedTs',
        'createdTx',
        'canceledTx',
        'executedTx'
    ],

    callback(results) {
        return results
            .map(({ id, description, value, eta, functionName, data, targetAddress, isCanceled, isExecuted, createdBlock, createdTs, expiresTs, canceledBlock, canceledTs, executedBlock, executedTs, createdTx, canceledTx, executedTx }) => ({
                txHash: id,
                description: description,
                value: Number(value),
                etaTs: Number(eta * 1000),
                etaDate: new Date(eta * 1000),
                functionName: functionName,
                data: data,
                targetAddress: targetAddress,
                isCanceled: isCanceled,
                isExecuted: isExecuted,
                createdBlock: Number(createdBlock),
                createdTs: Number(createdTs * 1000),
                createdDate: new Date(createdTs * 1000),
                expiresTs: Number(expiresTs * 1000),
                expiresDate: new Date(expiresTs * 1000),
                canceledBlock: canceledTx ? Number(canceledBlock) : null,
                canceledTs: canceledTx ? Number(canceledTs * 1000) : null,
                canceledDate: canceledTx ? new Date(canceledTs * 1000) : null,
                executedTs: executedTx ? Number(executedTs * 1000) : null,
                executedDate: executedTx ? new Date(executedTs * 1000) : null,
                createdTx: createdTx,
                canceledTx: canceledTx,
                executedTx: executedTx
            }))
            .sort((a, b) => b.createdBlock - a.createdBlock);
    }
};
