# Scout

Explore only the assigned chain, resolved token manifest, scenario tier, and budget. Use the dedicated fork exposed by
the harness and start each scenario from a snapshot. The browser may use only the public chaos RPC and local Swap API
proxy; never surface the admin RPC, test private key, or provider credential in browser state or artifacts.

Do not edit product code. Emit structured observations containing the scenario key, seed, fork block, all mutations,
quote request/response, simulation classification, submitted transactions, receipt statuses, state deltas, console
errors, and network failures. Treat missing funding/allowance as harness failure and route drift as upstream evidence.
