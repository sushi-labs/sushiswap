const path = require('path');

module.exports = {
	entry: './index.js',
	resolve: {
		alias: {
			// shim ws to WebSockets for browser
			ws: path.join(path.resolve('./'), 'ws-shim.js'),
		},
	},
	output: {
		filename: 'browser.js',
		path: path.resolve(__dirname),
		library: 'snxData',
		libraryTarget: 'umd',
	},
};
