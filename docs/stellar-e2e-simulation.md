# Stellar liquidity end-to-end simulations

Verified on 2026-09-29. No transactions were signed or broadcast. The monorepo frontend quotes matched the executed deployed contract binaries for every successful case below.

## Live mainnet simulations

The TypeScript runner uses the app's configured factory and manager, discovers the XLM/USDC 0.3% pool through the factory, and encodes calls with the existing generated bindings. It invokes `mint_with_hints` through Stellar's [`simulateTransaction`](https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/simulateTransaction) in authorization recording mode. Each quote, oracle-hint read and corresponding mint must use the same ledger; the runner retries if the ledger changes.

All four cases passed at ledger **64683157**. The recorded square-root price was `37436307248827487467710928719`, tick `-14995`. Every minted liquidity value and both charged amounts matched the frontend prediction exactly:

| Range | Ticks | Liquidity | XLM charge, raw | USDC charge, raw | Resource fee, stroops |
| --- | --- | --- | --- | --- | --- |
| In range | -15600, -14340 | 146757033 | 10000000 | 2067622 | 6935607 |
| Price below range | -14400, -14340 | 1625082119 | 10000000 | 0 | 6908080 |
| Price above range | -15600, -15060 | 797103721 | 0 | 10000000 | 5330070 |
| Full range | -887220, 887220 | 4725126 | 10000000 | 2232682 | 5610481 |

Assertions also inspect the RPC's simulated ledger changes: sender XLM/USDC debits and pool credits equal the charges; the position NFT belongs to the intended recipient; stored manager liquidity equals the quote. The real account's existing balances and trustline participate in these simulations. Authorization is recorded without signatures, and each simulation's changes are discarded.

**Separate fee finding:** the returned `minResourceFee` values are about **0.53–0.69 XLM**, before the inclusion fee. They exceed the current **0.5 XLM** Max buffer in `native-balance-reserve.ts`. That fixed buffer cannot reliably cover these mints; pool creation would require its own fee as well. This is not a liquidity arithmetic mismatch. The user's current reserve setting was preserved; fee-aware maximum deposits remain follow-up work.

## Exact deployed WASM execution

The harness in `apps/web/test/stellar/wasm` executes the downloaded mainnet factory, position manager, and pool WASM in Soroban SDK 23.0.2's local host. It imports no Sushi Rust contract source or liquidity formula. Minimal clients describe only the public ABI; the downloaded binaries execute all factory, manager, pool, and transfer logic.

| Contract | SHA-256 |
| --- | --- |
| Factory | `9f94c577ea24c2f71cbb0c964c9c9d321e02448d1fe946020afb18974b1c2602` |
| Position manager | `be969de545da89a04508e4952e94a53a77e76ecfa67d74b23fd56e0be42290d4` |
| Pool | `003710b383f9da7d650a7f719a7be479110266427817ebbed61d924505fcd7c7` |

For each of 88 vectors, the harness creates two local Stellar Asset Contracts, funds a sender, uploads the actual pool binary, initializes the actual factory and manager, calls `create_and_initialize_pool`, obtains oracle hints, and calls `mint_with_hints`.

**Results: 84 successful mints matched the frontend's exact integer liquidity and both expected token charges; 4 invalid mints reverted with the expected contract error.** All three fee tiers (500, 3000, 10000) are covered, including below/inside/above range, exact boundaries and adjacent square-root units, negative ticks, full range, dependent deposit calculations with unequal display decimals, minimum/maximum prices, low-price early division, and a one-unit deposit.

The 42 explicitly named `one-spacing` cases cover the smallest valid range for every fee tier: widths of 10, 60 and 200 ticks respectively. Each tests both `[-spacing, 0]` and `[0, spacing]`, with the price just below the lower boundary, exactly at it, just inside it, in the middle, just inside the upper boundary, exactly at it, and just above it. All 42 passed against the deployed binaries. A literal width of one numerical tick is not an aligned range for these configured fee tiers.

Successful cases additionally verify:

- Desired amounts cover actual token charges.
- Sender balance reductions and pool balance increases equal the returned charges exactly.
- The position NFT belongs to the sender.
- Manager position tokens, fee, ticks, and liquidity match the submitted quote.
- The pool position records the same liquidity; active pool liquidity matches whether the current tick lies in the range.
- Reversing the token input order resolves to the same canonical pool.
- Calling `create_and_initialize_pool` again with a different price preserves an already initialized pool's price.

Rejected cases additionally verify that both sender balances remain unchanged, active liquidity stays zero, and no manager NFT, manager position, or pool position remains:

| Case | Contract error |
| --- | --- |
| Low price truncates the token0 intermediate to zero | 70 |
| Minimum-price range has zero computed liquidity | 70 |
| A candidate liquidity overflows u128 before the minimum is selected | 1017 |
| Liquidity fits u128 but exceeds i128 | 11 |

The low-price regression at tick -600000 produces liquidity `31245331` from desired caps `999999975829740460` and `1`, with actual charges `998657305033100367` and `1`. This confirms why the desired token0 cap must preserve the manager's early-division calculation instead of being replaced with the smaller pool charge.

## Reproducing both stages

From the repository root, with dependencies installed and Rust available:

```sh
cd apps/web
stellar_sim_dir="$(mktemp -d)"
node --import tsx test/stellar/simulate-liquidity.ts "$stellar_sim_dir"
node --import tsx test/stellar/liquidity-vectors.ts "$stellar_sim_dir/vectors.json"
cargo run --locked --manifest-path test/stellar/wasm/Cargo.toml -- \
  "$stellar_sim_dir" "$stellar_sim_dir/vectors.json" "$stellar_sim_dir/wasm-results.json"
```

The RPC runner defaults to dRPC and reads `DRPC_ID` from the environment; `STELLAR_RPC_URL` selects another mainnet RPC. `STELLAR_SIMULATION_ACCOUNT` can select another public account with sufficient XLM/USDC balances and an existing USDC trustline. No private key is read. It saves deployment hashes, verified WASM bytes, live results, and raw simulated ledger changes to the output directory. It also verifies that the factory's new-pool hash matches the sampled pool binary.

The local stage needs `factory.wasm`, `manager.wasm`, and `pool.wasm` plus generated vectors; after downloading these, it can run offline with cached Cargo dependencies. Binaries and generated results are intentionally not committed. The committed Cargo lockfile fixes the tested dependency graph. The retained harness passed using Rust 1.94.1 and `cargo run --offline --locked`.

Repository formatting, lint, TypeScript checking and the full web unit suite also passed: **841 tests passed, 1 existing skip**. No production code changes were needed for the simulation results.

## Scope of the evidence

This checks actual deployed contract instructions against frontend quotes across the full create/initialize/mint state transition. The local ledger is intentionally synthetic: authorization is mocked, accounts are funded, and the instruction budget is unlimited. The live stage additionally checks minting against real pool/account state and reports resource fees; pool creation followed by minting is executed locally because separate RPC simulations do not retain each other's state.

These are contract-level end-to-end simulations, not browser/wallet signing tests. They do not prove production authorization, inclusion, all possible pool states, or safety against later price changes. Existing zero minimum-amount/slippage settings remain unchanged. Exact source-build reproducibility remains a separate issue documented in [deployment verification](stellar-deployment-verification.md).
