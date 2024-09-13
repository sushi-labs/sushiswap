# Tool for routing compare

## Run

Run routing compare for all networks:

`pnpm compare`

Run routing compare for <chainId> network:

`pnpm compare <chainId>`

Find worse sushi route for <chainId> network:

`pnpm findWorstSushiRoute <chainId>`

Test route real output in comparison with expected:

`pnpm testRealOutput <route project: sushi, 1inch, odos> <delay in ms between tests. Optional. Default is 0>`
