# Stellar pool creation: PR #2166 requirements and replacement

Source: [PR #2166](https://github.com/sushi-labs/sushiswap/pull/2166), head `4b320ef20cdd0ddcfdaa731787f57e836a4704f9` (14 commits, July 11–12, 2026). Replacement starts from current master `bc7c4020ed`. The original PR has no description or tests; this inventory is extracted from its diff, not a claim that every behavior worked.

## Behavior intended by the original PR

1. **Pool setup.** Reorganize `/stellar/pool/add` into Tokens, Fee Tier, Range, and Liquidity sections. Select two different Stellar tokens with icons. Offer 0.05%, 0.3%, and 1% fee tiers, defaulting to 0.3%. Reset position inputs when either token or the fee changes.
2. **Pool discovery.** Find the selected pair/fee pool and distinguish an initialized pool, an uninitialized pool, and no pool. Use on-chain token ordering for existing pools and decoded contract-address byte ordering otherwise. Reuse existing initialized pools.
3. **Explicit initial price.** Stop inferring a new pool's price from the deposit ratio. Require a separate positive starting price for a new or uninitialized pool. Convert human token prices (including different token decimals) into canonical Q96 square-root prices. Explain the additional initialization transaction.
4. **Price orientation.** Let users quote either token in terms of the other. Invert the displayed starting price and range while preserving canonical pool token order. Existing pool prices come from chain state.
5. **Range controls.** Provide min/max price cards, one-tick-spacing step buttons, and Full Range, ×÷2, ×÷1.2, and ×÷1.01 presets. Align prices to fee-tier tick spacing. Show 0/infinity at protocol limits, reject reversed ranges, account for token decimals, and invert both bound order and stepping direction when switching quote orientation. Retain the compact selector in pool management.
6. **Deposit amounts.** Reuse currency inputs with balances, prices, and Max. Derive the paired amount from the initial price for new pools or the current price for initialized pools and the chosen tick range. Consolidate the duplicate paired/dependent amount hooks. Include tokens and proposed price in query keys. The old proposal only permits token0 input and blocks all above-range deposits.
7. **Maximum deposits and precision.** Account for both available balances when deriving maximum paired amounts. Replace floating-point string-to-amount conversion with exact unit parsing in dependent amounts, maximum amounts, liquidity submission, and zap submission.
8. **Trustlines.** Accept StellarToken objects in trustline hooks. Resolve issuers even when token metadata lacks them. Add a reusable batch checker that waits for checks and creates missing trustlines. Update pool management and swap callers.
9. **Submission guards.** Require a wallet, distinct tokens, enough balance, trustlines, initial price when needed, a valid aligned range, and a usable paired amount. Show separate creating/initializing and adding-liquidity states; prevent duplicate submissions.
10. **Transaction sequence.** Create/initialize if necessary, then add liquidity through the existing service. Clear deposit inputs after success. Show a success dialog linking the confirmed transaction and pool position instead of immediately navigating away.
11. **Presentation and reuse.** Widen/re-space the creation layout, share price-card inputs with EVM, and generalize the existing token selector widget for Stellar. Split the monolithic page into focused components.
12. **Incidental changes.** Update sushi 6.6.11→7.0.0 and viem 2.44.4→2.55.0; use a public development RPC; replace local price parsing with Price.tryFromHuman; fix unrelated TWAP checker, cookie button, portal width, wallet props, chip input typing, dialog transaction types, and UI tsconfig.

## Replacement decisions

- Rebuild against current APIs and components. No old commits are cherry-picked.
- Preserve the setup, explicit price, orientation, ranges, trustlines, and success flow. Support editing either deposit token and valid single-sided deposits on either side of the range.
- Keep amounts in bigint units through calculation and submission. Reject malformed, negative, excessive-precision, and out-of-bounds input at transaction boundaries.
- Treat loading/error states as unavailable, not as an absent pool or a successful trustline check. Keep a confirmed pool address available after partial success so adding liquidity can be retried.
- Keep Full Range fixed at protocol limits when the current price changes. Share range behavior between creation and management without duplicating a second selector implementation.
- Resolve trustline requirements from the on-chain contract executable, and verify classic asset code/issuer against its derived contract ID. Do not assume an unknown asset needs no trustline. RPC failures remain retryable errors. See [Stellar asset contract documentation](https://developers.stellar.org/docs/tokens/stellar-asset-contract).
- Use the shared XLM reserve policy when using Max, including when deriving a paired amount from the other token. Balances at or below the buffer have no spendable XLM. This remains a fixed buffer, not a calculation of each account’s reserve liabilities.
- Reuse current currency inputs and existing wallet/transaction hooks. Avoid layers of wrapper components and nested guards solely to split files.
- Omit unrelated dependency, RPC, portal, cookie, TWAP, and wallet/UI cleanup. Current master already has newer dependencies and several of those fixes. Preserve current public component contracts when sharing controls.

## Math audit follow-up

A separate [math verification](stellar-liquidity-math-verification.md) found and fixed contract-rounding, deposit-cap, exact-tick, narrow-preset, and signed-liquidity issues. It records independent formula checks. The subsequent [contract-source and live-deployment audit](stellar-contract-compatibility.md) confirmed that the active manager and factory default pool use older negative-tick rounding; a small monorepo adapter now handles that difference while reusing SDK arithmetic. Intermediate u128 overflow is also checked, and the unused local square-root implementation was removed. No SDK or contract-repository changes were made.

## Reuse follow-up

Pool management (including zap) and the swap button now reuse the same `Trustlines`/`Trustline` checker as pool creation. Removed their duplicate loading/error/retry branches, issuer lists and trustline-creation buttons. The checker renders the submit action only after the required trustlines are verified.

Removed unused `useHasTrustline`, `useUserTrustlines`, `useNeedsTrustline`, `getUserTrustlines`, `getAssetInfo`, the duplicate Horizon asset type, unused result fields and obsolete query invalidations. Repository-wide reference checks confirmed these were internal and unused after switching the consumers. This follow-up removes 293 production lines without adding dependencies. Two checker tests cover blocked loading/error/missing-trustline states, retry, successful resolution and the single-output-token swap case.

The XLM Max regression now verifies the shared reserve policy in integer units rather than duplicating its numeric configuration. It preserves the pre-existing staged reserve value of 5,000,000 stroops (0.5 XLM); only its incorrect comment was corrected.

## EVM v3 UI alignment

Creation now follows the EVM v3 form layout: compact token selectors, fee cards, quote toggles, an interactive liquidity chart for existing pools, range presets and price cards, and stacked deposit inputs with a lock over the unused asset. The balance button reuses the existing paired Max calculation. Only Stellar's three fee tiers are offered; initialization messaging and trustline handling remain specific to Stellar.

EVM and Stellar now import the same `SelectTokensWidget`, `FeeTierCard`, and `LiquidityDepositInput`/`LiquidityDepositDivider` from `src/lib/components`. The token selector uses `CurrencyFor<TChainId>` and also serves the existing EVM v2 and incentive pages. EVM fee statistics, analytics, native-token selection, and transaction state remain in their callers; Stellar retains its range math, paired Max calculation, and submission flow. This extraction removes 70 production lines overall. Shared-component regressions cover controlled/disabled fee selection, pool badges, and locked deposits for EVM and Stellar currencies.

The shared Stellar chart presents human prices with token-decimal scaling and supports inverted quotes while keeping its callbacks in canonical token order. Management uses the same chart API. Single Sided Left/Right presets select valid aligned boundaries against the exact square-root price and remain fixed when that price changes. Tests cover all three fee tiers, both quote directions, and prices immediately below, at, and above an aligned negative tick, plus protocol limits. Separate regressions cover chart decimals/inversion and the shared Max button's default behavior.

## Validation

Implementation is on branch `feat/stellar-pool-creation-v2`, in the isolated `stellar-pool-creation` worktree.

| Check | Result |
| --- | --- |
| `pnpm format` | Passed. |
| `pnpm lint` | Passed. |
| `pnpm --filter web check` | Passed. |
| `pnpm --filter web test:unit` | 867 tests passed; 1 existing test skipped. |
| Initial targeted Stellar and native-reserve tests | 72 tests passed, including 40 new tests. |
| Independent math audit and form regressions | 46 tests passed, including 15 added during the math and source audits; 5,000 arithmetic cases and 160 price cases are checked inside these tests. |
| Dependency builds (`turbo run build --filter='web^...'`) | Passed for 12 workspace dependencies. |
| `pnpm --filter web build` | Compilation and TypeScript passed. Prerendering fails in the existing cross-chain-swap page because the Vercel Edge Config connection string is not configured. |
| `PORT=3106 pnpm --filter web test` | Latest rerun cannot start the production server because the incomplete local Next.js build lacks `.next/prerender-manifest.json`. The earlier attempt also exposed global-setup prerequisites: Anvil 1.8.1 is required (installed 1.5.1), and `ANVIL_FORK_URL` is absent. This suite contains 18 EVM fork tests, no Stellar flow tests. |
| Real-browser checks against live Stellar reads | Passed on desktop and 390px mobile viewport. Verified existing XLM/USDC 0.3% pool discovery; absent/uninitialized 1% pool starting-price flow; either deposit field; paired recalculation; fee-change resets; Full Range and narrower presets; reciprocal starting price and bounds without changing deposits; duplicate-token rejection; accessible deposit labels. |
| EVM v3 UI alignment browser checks | Desktop and 390px mobile: selected fee cards, chart dragging in both quote directions, full-range 0/∞ labels, single-sided asset locking, starting-price inversion preserving deposits, and no horizontal overflow or browser errors. |
| Shared presentation browser checks | EVM v3 and Stellar: token selection, fee selection, full-range paired deposits, single-sided input/Max locking, and 390px mobile layout without horizontal overflow. EVM fee selection and token changes still update URL state and show pool-share badges. Changing to ETH/USDT 1% produced an existing data-service `no source` error; the form displayed its initialization state. |
| `git diff --check` | Passed. |

The new tests cover exact large amounts, precision and protocol limits, token-decimal conversion, inverted initial prices, both single-sided boundaries, liquidity dust, maximum amounts respecting both balances, XLM reserve protection, contract identity and failed trustline reads, deposit validation before signing, discovery failures, creation followed by a failed deposit and successful retry, duplicate submissions, and an unmounted flow not starting its next transaction. Component tests mock wallet, network, and transaction hooks; the arithmetic tests exercise the actual helpers.

### Standards review

Independent review against root and web AGENTS.md: no remaining findings. Fixed missing exported return types and trustline errors that otherwise looked like perpetual loading.

### Spec review

Independent review against this inventory and the original PR: no remaining findings. Fixed the unknown-issuer trustline fallback and prevented a failed factory refresh from blocking a deposit retry after confirmed pool creation.

### Remaining validation limits

No funded wallet was connected and no transaction was signed or broadcast. Create/initialize, trustline creation, and add-liquidity sequencing are covered by mocked integration tests, not a live funded-wallet run. The existing service’s zero minimum-amount/slippage settings are unchanged; this replacement does not add slippage controls.

Subsequent [contract-level end-to-end simulations](stellar-e2e-simulation.md) passed four live mainnet mints and 88 local creation/mint cases using the actual deployed WASM binaries. They validate the math and contract state changes without wallet signing. The live resource fee estimates exceeded the current 0.5 XLM Max buffer; that separate fee-buffer limitation is documented in the simulation report.
