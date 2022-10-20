'use strict';

const graphResultsPager = require('.');

const hexToAscii = str => {
	const hex = str.toString();
	let out = '';
	for (let n = 2; n < hex.length; n += 2) {
		const nextPair = hex.substr(n, 2);
		if (nextPair !== '00') {
			out += String.fromCharCode(parseInt(nextPair, 16));
		}
	}
	return out;
};

graphResultsPager({
	api: 'https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix-exchanges',
	max: 10,
	timeout: 5e3,
	query: {
		entity: 'synthExchanges',
		selection: {
			where: {
				timestamp_gt: Math.floor(Date.now() / 1e3) - 3600 * 24, // one day ago
			},
		},
		properties: [
			'id',
			'timestamp',
			'from',
			'fromAmountInUSD',
			'fromCurrencyKey',
			'toCurrencyKey',
			'toAmountInUSD',
			'feesInUSD',
		],
	},
})
	.then(results =>
		results.map(
			({ id, timestamp, from, fromAmountInUSD, fromCurrencyKey, toAmountInUSD, toCurrencyKey, feesInUSD }) => ({
				timestamp: Number(timestamp * 1000),
				date: new Date(timestamp * 1000),
				hash: id.split('-')[0],
				fromAddress: from,
				fromCurrencyKey: hexToAscii(fromCurrencyKey),
				fromAmountInUSD: fromAmountInUSD / 1e18,
				toAmountInUSD: toAmountInUSD / 1e18,
				toCurrencyKey: hexToAscii(toCurrencyKey),
				feesInUSD: feesInUSD / 1e18,
			}),
		),
	)
	.then(console.log)
	.catch(err => console.error(err));
