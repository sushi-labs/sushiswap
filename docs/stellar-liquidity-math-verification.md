# Stellar liquidity math verification

Audited the PR #2166 replacement on 2026-09-29. The initial implementation was **not fully correct**. The failures below were reproduced with tests before being fixed.

## Findings and fixes

| Finding | Reproduction | Correction |
| --- | --- | --- |
| Token0 liquidity used the SDK's full-precision formula, skipping a division the position manager rounds down. | At tick -600000, range [-600060, -599940], and 10^18 units of each token: the initial helper reported 31,287,340 liquidity; the periphery formula gives 31,245,331. At tick -800000 with a similarly narrow range, the former reports positive liquidity while the periphery gives zero. | Use the SDK's periphery-compatible rounding mode; zero-liquidity quotes are blocked. |
| Returning core token charges as desired deposit amounts loses liquidity when the manager calculates liquidity again. | For the first example above, passing those charges back into the manager's formula produces only 31,203,378 liquidity. Token1-driven quotes have the same problem. | Invert the periphery's rounded formula to produce desired deposit caps. Max and paired amounts now preserve the intended liquidity when recalculated. The actual amount charged can be smaller than the cap. |
| Floating-point logarithms shift the range center. | Exact tick -30 became -31 after sqrt-price → Number → logarithm. At spacing 60, the default range changed from [-60000, 60000] to [-60060, 59940]. | Pass the bigint square-root price into the shared range hook and use integer tick conversion. Both creation and management use it. |
| The narrowest preset can end up entirely on one side of the current price. | At tick 1 with a 1% fee (spacing 200), ×÷1.01 rounded both bounds to tick 0, then expanded to [-200, 0]. | Require at least one tick spacing on each side of the preset center, subject to protocol limits. |
| Valid token amounts can imply an invalid signed liquidity delta. | Two i128-max token amounts in a narrow range produce liquidity above i128-max. | Reject the dependent quote before enabling submission. |
| Direct SDK tick conversion does not match the deployed Stellar contracts. | The live manager's principal for position 4 at ledger 64682748 matches the older negative-tick floor, not current SDK rounding. At the current SDK's tick -60 boundary, the older manager requires a nonzero token1 amount; a token0-only quote would mint zero. | Reuse SDK TickMath with two small local forward/inverse corrections for negative boundaries. The minimum tick remains special-cased. Creation, management, displayed ranges, and paired amounts use the adapter. |
| A representable minimum can hide an overflowing candidate. | At price `sqrt(887270)-1`, range [887260,887270], desired token0=1 and token1=10^18, the token1-supported liquidity is 108 but the token0 candidate exceeds u128. Actual Rust periphery returns `U256ToU128ConversionFailed` before taking the minimum. | Validate both candidates using SDK arithmetic on the final submitted pair, including the unchanged user-entered amount. Do not validate the internal unlimited-side sentinel as if it were submitted. |

## Independent calculations

Let `Q = 2^96`, `a` and `b` be the lower/upper square-root prices, and `p` be the current square-root price clamped to `[a, b]`. All arithmetic below uses integers:

- Token0-supported liquidity: `floor(amount0 * floor(p*b/Q) / (b-p))` when `p < b`.
- Token1-supported liquidity: `floor(amount1 * Q / (p-a))` when `p > a`.
- Below/at the lower boundary, only token0 matters. Above/at the upper boundary, only token1 matters. Inside the range, take the smaller liquidity.
- For a chosen liquidity `L`, the minimum token0 **desired cap** is `ceil(L*(b-p) / floor(p*b/Q))`; token1's is `ceil(L*(p-a)/Q)`. An inactive side or zero liquidity has a zero cap.
- The core's token0 **charge** is `ceil(L*Q*(b-p)/(p*b))`. This distinction from the desired cap matters because the manager rounds the intermediate product down.

These caps cannot exceed the budgets used to calculate `L`: `L <= floor(budget0*intermediate/(b-p))` implies `ceil(L*(b-p)/intermediate) <= budget0`, and similarly for token1. Each cap supports at least `L`; since neither exceeds its original budget, the manager's minimum of the two supported liquidities remains exactly `L`. This proof concerns the arithmetic; contract integer limits and state-dependent limits still apply.

For human price `h = token1/token0`, the raw ratio is `h * 10^(decimals1-decimals0)`. Starting prices encode the integer floor of `sqrt(raw ratio) * Q`; inverted quotes first invert the human ratio. Tests verify the exact bounding inequality `s^2*d <= n*Q^2 < (s+1)^2*d`, independently of the SDK's price and square-root helpers.

## Evidence

- **5,000 deterministic cases** compare liquidity against an independent bigint translation of the periphery formula, verify recalculation preserves liquidity, and verify actual mint charges <= desired caps <= balances. Cases cover all three fee spacings, wide/narrow ranges, prices outside and exactly at both boundaries, prices one square-root unit from a boundary, and varying large amounts.
- **160 price cases** verify exact square-root rounding across 0/6/7/18 token decimals, very small/large prices, and both quote directions.
- **All 1,774,545 valid ticks** were compared against an independent Python translation of the older core source after adding the local adapter: zero differences. **26,751 inverse boundary checks** also passed. An earlier exhaustive comparison confirmed the unmodified SDK matches current core; live deployment evidence established that this newer behavior is not what the configured manager and factory default pool use. These exhaustive checks were temporary verification runs, not added CI workloads.
- **Actual Rust source execution** used the periphery's `liquidity_amounts.rs`, its locked core dependency, current core tick conversion for comparison, and the periphery's checked-in dependency versions in an isolated harness. It reproduced the exact-negative-boundary mismatch, the u128 overflow above, and the early-division liquidity result of 31,245,331. No contract repository was edited.
- **Read-only live verification** matched a discriminating manager principal query to older rounding and matched active pool/default-pool WASM hashes to the first-party June build record. The fixed manager result is now a regression test; see [contract compatibility](stellar-contract-compatibility.md#active-deployment-evidence) for addresses, hashes and values.
- **Deployed mint execution** now also passes: four unsigned mainnet `mint_with_hints` simulations match frontend liquidity, exact charges, sender debits, pool credits, NFT ownership and stored position liquidity. A local Soroban host executes the downloaded factory, manager and pool binaries through creation, initialization and minting across 88 cases, including 42 explicit minimum-width range cases. See [results and rerun commands](stellar-e2e-simulation.md).
- Regression tests reproduce the numerical failures above, including presets at every supported fee tier. The tests use the real arithmetic and range components; wallet/network operations in component tests remain mocked.
- Final validation: formatting, lint, and type checking passed; the full web unit suite passed 841 tests (1 existing skip). The focused math/form suite passed 46 tests, with 15 added during the math and source audits. See the [implementation report](pr-2166-reimplementation.md).

Runnable regression and independent calculation checks:

```sh
pnpm --filter web exec vitest run liquidity-amounts.test.ts pool-position-form.test.tsx
```

## Source revisions and limits

The supplied repositories’ current heads differ from the active deployed builds. See the [deployment identity report](stellar-deployment-verification.md). The new simulations test deployed mint behavior directly, without needing to establish which source revision produced the binaries. They are behavioral checks for the recorded cases, not independently reproduced builds or a complete contract audit.

Primary sources inspected:

- [Stellar periphery liquidity formulas, c5985292](https://github.com/sushi-labs/sushi-stellar-periphery/blob/c5985292b3b62abb95d6287d1ac0d0e96c3cacf8/contracts/libraries/src/liquidity_amounts.rs).
- [Position manager calling those formulas before minting, c5985292](https://github.com/sushi-labs/sushi-stellar-periphery/blob/c5985292b3b62abb95d6287d1ac0d0e96c3cacf8/contracts/manager/src/nonfungible_position_manager.rs#L634).
- [Core token-delta rounding, 21ab5ae3](https://github.com/sushi-labs/sushi-stellar/blob/21ab5ae31600cc86ccf676bfd706b716d31c847a/contracts/amm-math/src/sqrt_price_math.rs#L217).
- [Core tick conversion, 21ab5ae3](https://github.com/sushi-labs/sushi-stellar/blob/21ab5ae31600cc86ccf676bfd706b716d31c847a/contracts/amm-math/src/tick_math.rs).
- [Core signed mint limit, 21ab5ae3](https://github.com/sushi-labs/sushi-stellar/blob/21ab5ae31600cc86ccf676bfd706b716d31c847a/contracts/dex-pool/src/mint.rs#L64).

**The deployed rounding question is now resolved for the configured manager and factory default pool at the recorded ledgers.** The periphery's checked-in [Cargo.lock](https://github.com/sushi-labs/sushi-stellar-periphery/blob/c5985292b3b62abb95d6287d1ac0d0e96c3cacf8/Cargo.lock#L26) pins older core `a606b31c`; its negative-tick rounding differs by one square-root unit from current core/SDK. A live manager simulation confirmed the older behavior. The factory default and sampled XLM/USDC pool hashes match the June build, whose tick source is identical to that locked revision. The local adapter targets this verified behavior. This is not a reproduction of the complete manager binary or an audit of every existing pool. Recheck compatibility when deployed executable hashes change. No signed transaction was used.

Pool-specific available liquidity capacity, per-tick limits, token transfer rules, and price movement between quote and simulation remain contract-state checks. The existing service's zero minimum-amount/slippage settings are unchanged.
