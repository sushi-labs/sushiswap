# graph-results-pager

[![npm version](https://badge.fury.io/js/graph-results-pager.svg)](https://badge.fury.io/js/graph-results-pager)

Utility to get paged results from The Graph endpoints

## Node & Webpack Usage

```javascript
const graphResultsPager = require('graph-results-pager'); // common js
// or
import graphResultsPager from 'graph-results-pager';

graphResultsPager({
	api: 'https://api.thegraph.com/subgraphs/name/...',
	// Note: a single subgraph fetch can return 1000 results, any larger numbers will trigger multiple fetches
	max: 12, // leave empty for all results
	timeout: 5e3, // 5s timeout for an individual page request
	query: {
		entity: '...',
		selection: {
			// Note: orderBy DOES NOT WORK due to how the paging is implemented, it is overriden by id 
			orderBy: '...',
			orderDirection: 'desc',
			where: {
				// Note: the below filters are combined - like the AND operater in an SQL WHERE clause
				someStringField: `\\"${someValue}\\"`, // use double quotes for strings / bytes / addresses
				someNumber: 321, // numbers don't require escaping
				// ...
				willBeIgnored: undefined, // useful if you want to use the ternary operator for inline checks
			},
		},
		properties: [
			'id',
			...ss, // the list of the entity's fields you want returned
		],
	},
});
```

For an example in node, try running `node example.js` ([see source](./example.js))

## Direct browser usage

```html
<script src="//cdn.jsdelivr.net/npm/graph-results-pager/browser.js"></script>
<script>
	window.graphResultsPager({...}).then(console.log).catch(console.error)
</script>
```
