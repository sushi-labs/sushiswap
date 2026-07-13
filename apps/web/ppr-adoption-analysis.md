# Partial prerendering adoption analysis

## Executive summary

Sushi should adopt Partial Prerendering (PPR), but not as a single global
configuration change. On the version used by this repository, Next.js 16.2.6,
PPR is delivered by **Cache Components** and enabled with top-level
`cacheComponents: true`. Enabling it changes the caching model for the whole App
Router application and turns uncached or request-time work outside an explicit
boundary into a build error.

The clean rollout is:

1. Migrate the public CMS, legal, partner, and pricing routes.
2. Split the shared network request context from the reusable public shell.
3. Migrate public explore, token, and pool-detail routes.
4. Add fast shells to swaps, liquidity management, positions, claims, staking,
   and perps without pretending that PPR reduces their client-side hydration
   cost.

The highest-return routes are CMS articles and indexes, explore tables, token
pages, pool detail pages, and legal pages. The lowest-return routes are
test/disabled routes and pages whose useful content is entirely wallet-specific.

The developer portal is explicitly excluded from this plan because it is
currently unused. Its 15 physical page files should not receive PPR migration
work unless the product is reactivated.

The largest cross-cutting blocker is `src/app/(networks)/layout.tsx`. It reads
the request cookie with `headers()` and passes it into `WagmiProvider`, which
wraps every network page. If this whole subtree is placed behind Suspense, PPR
technically works but almost none of the network UI enters the static shell. A
useful implementation must either isolate the cookie-dependent wallet bootstrap
or explicitly accept that the wallet subtree is the streamed portion.

## What PPR means in this repository

Next.js 16 removed the old `experimental.ppr` and route-level
`experimental_ppr` controls. The supported entry point is:

```js
const nextConfig = {
  cacheComponents: true,
}
```

With Cache Components enabled, Next.js prerenders every deterministic part of a
route. Work that cannot finish during prerendering must be handled in one of two
ways:

- Cache it with `'use cache'`, optionally using `cacheLife()` and `cacheTag()`,
  so its output can be included in the shell.
- Put it behind `<Suspense>` so the fallback is included in the shell and the
  fresh result streams at request time.

This is an explicit-caching model. Route segment exports such as `revalidate`,
`dynamic`, and `fetchCache` are replaced by `use cache` and `cacheLife`. Runtime
request APIs such as `cookies()`, `headers()`, and request-only `params` cannot
be called inside a shared cache scope.

Official references:

- [Cache Components overview](https://nextjs.org/docs/app/getting-started/partial-prerendering)
- [Next.js 16 upgrade and PPR changes](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components)
- [`use cache` reference](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [`cacheComponents` configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)

PPR improves time to first byte, first contentful paint, and navigation
prefetchability when a meaningful shell exists. It does **not** reduce the size
or hydration cost of client components. That distinction matters for Sushi:
many trade, perps, Aptos, Stellar, and token-list pages are client-heavy.

## Repository baseline

The static audit found:

| Item | Current count | PPR implication |
| --- | ---: | --- |
| In-scope physical `page.tsx` files | 70 | Excludes 15 unused developer portal pages |
| Page files with `'use client'` | 19 | PPR can emit their initial HTML, but hydration remains |
| Existing `loading.tsx` files | 16 | Useful fallback designs, but coverage is incomplete |
| Pages/layouts using legacy segment cache exports | 13 | Excludes the unused portal pricing page |
| Layouts reading `headers()` or `cookies()` | 8 | Must be isolated behind Suspense or redesigned |
| App files using `unstable_cache` | 9 | Candidates for narrow `use cache` functions |
| Active Edge route handlers | 3 | Must be tested or moved to Node; Cache Components does not support Edge runtime segments |
| Pages with `generateStaticParams` | 1 | Dynamic params otherwise need a boundary or representative prerender params |

This is a code-shape assessment, not a measured production-performance report.
The repository has no installed dependencies in this worktree, and no traffic
or Web Vitals dataset was provided, so gain is ranked qualitatively. Before and
after measurements are part of the rollout criteria below.

## Scoring

**Gain** estimates how much useful, non-personalized UI can arrive immediately:

- **High**: most above-the-fold content can be in the shell or shared cache.
- **Medium**: stable chrome and a useful skeleton can arrive immediately, but
  the primary interaction remains client- or wallet-dependent.
- **Low**: almost all useful content is authenticated, wallet-specific,
  request-specific, disabled, or test-only.

**Complexity** estimates migration risk:

- **Low**: deterministic page or one cache conversion.
- **Medium**: dynamic params, data/cache decomposition, or several boundaries.
- **High**: shared provider/auth architecture, request headers, on-chain state,
  or many nested client providers.

## Page-by-page recommendation

Route groups below expand to all 70 in-scope physical pages. Parenthesized route
groups in the filesystem are omitted from public URLs. The 15 developer portal
pages are intentionally excluded.

### Content and public marketing

| Route/page | Gain | Complexity | Recommended treatment |
| --- | --- | --- | --- |
| `/academy` | High | Low | Cache article data with `use cache`; replace 300-second segment revalidation with `cacheLife`; keep search/filter controls client-side. |
| `/academy/explore` | High | Medium | Cache the article corpus; place URL/search-driven filters behind a focused Suspense boundary. |
| `/academy/article-list` | High | Low | Cache the scraper-oriented list for an hour. |
| `/academy/[article-slug]` | High | Medium | Cache article and Ghost body by slug; tag by article; add representative static params or a content boundary. |
| `/blog` | High | Low | Preserve the existing Suspense decomposition and cache hero/category/article queries individually. |
| `/blog/article-list` | High | Low | Cache the scraper-oriented list for an hour. |
| `/blog/[article-slug]` | High | Medium | Cache article, body, and related articles by slug; do not let related-content latency block the article shell. |
| `/faq` | High | Low | Cache category/product/most-searched blocks independently; give existing Suspense a visible fallback. |
| `/faq/[category-slug]` | High | Medium | Replace 900-second route exports with a tagged cached lookup; prerender known categories. |
| `/faq/[category-slug]/[answer-group-slug]/[answer-slug]` | High | Medium | Cache answer metadata and Ghost body; prerender known FAQ slugs or stream only the body. |
| `/` landing page | Low | Low | It is currently superseded by the permanent `/ -> /swap` redirect. Do not invest until the route is made reachable. If restored, split the all-client page so static hero/copy are Server Components. |
| `/partner` | High | Low | Already deterministic; it should fall wholly into the static shell. Remove the unnecessary `async`. |
| `/legal/[slug]` | High | Low | Excellent pilot: finite static params already exist. Convert `unstable_cache`/`revalidate` to `use cache` plus a one-day lifetime and remove `fetchCache`. |

The CMS layout currently exports `fetchCache = 'default-no-store'`. That broad
override should be removed. Cache each Strapi/Ghost operation at the data or
component boundary instead. This prevents one slow or intentionally fresh block
from making the whole content tree request-bound.

### EVM discovery and public market data

| Route/page | Gain | Complexity | Recommended treatment |
| --- | --- | --- | --- |
| `/[chainId]/explore/pools` | High | Medium | Prerender navigation, stats fallback, filters, table headings, and first-page skeleton. Cache public pool pages by chain/filter; keep search state dynamic. |
| `/[chainId]/explore/tokens` | High | Medium | Same pattern as pools: cached public first page, dynamic filter/search results. |
| `/[chainId]/explore/blade-pools` | High | Medium | Cache `getBladePools` by chain and tag; retain a table fallback for refreshes. |
| `/[chainId]/token/[address]` | High | Medium | Strong target. Cache token metadata/market summary by chain and address; keep the deferred swap widget and live balances outside that cached scope. |
| `/[chainId]/pool/v2/[address]` | High | Medium | Cache pool identity and public reserves/summary; stream changing on-chain stats and wallet position. Remove request `referer` from the critical layout path. |
| `/[chainId]/pool/v3/[address]` | High | Medium | Cache pool identity and public metadata; stream live ticks, charts, and wallet position. Remove request `referer` from the critical layout path. |
| `/[chainId]/pool/blade/[address]` | High | Medium | Cache Blade pool identity/assets; stream on-chain and wallet state. Existing loading UI can become the dynamic fallback. |
| `/[chainId]/pool/v3/[address]/smart` | High | High | Cache pool/vault definitions and public overview separately. The current layout reads `headers()` and pages use `unstable_cache`; both need decomposition. |
| `/[chainId]/pool/v3/[address]/smart/[vault]` | High | High | Cache vault identity/config by address and tag; stream live vault performance and user state. |
| `/[chainId]/pool/v3/fees` | Medium | Medium | Cache fee-tier/reference data; stream any live estimates. Convert `unstable_cache`. |

For finite `[chainId]` segments, add `generateStaticParams()` using the existing
supported-chain configuration. This lets Next prerender representative route
trees rather than treating every parameter read as request-only. For unbounded
addresses, seed only a small set of high-traffic pools/tokens if production
analytics justify it; cached parameterized components still handle the long
tail at runtime.

The pool layouts read `headers().get('referer')` only to choose a back URL. That
small convenience currently makes an otherwise public layout request-specific.
Prefer a stable canonical back link, or a client-only back button using router
history with a canonical fallback. It is not worth sacrificing the public shell
for the referer.

### EVM trading and liquidity actions

| Route/page | Gain | Complexity | Recommended treatment |
| --- | --- | --- | --- |
| `/[chainId]/swap` | Medium | High | Prerender header, page frame, widget card, token-input skeleton, and banner placeholder. Stream cookie-dependent banner state and hydrate the widget. |
| `/[chainId]/cross-chain-swap` | Medium | High | Same shell pattern; cache supported-chain/config data and keep quote/routing state live. |
| `/[chainId]/dca` | Medium | High | Page is fully client-side. Move container/title/help copy to a Server Component and keep the Orbs widget as the hydrated island. |
| `/[chainId]/limit` | Medium | High | Same as DCA. |
| `/[chainId]/stop-loss` | Medium | High | Same as DCA. |
| `/[chainId]/take-profit` | Medium | High | Same as DCA. |
| `/[chainId]/pool/v2/add` | Medium | High | Static creation frame and guidance in shell; wallet balances, token choices, quote, approval, and submission stay live. |
| `/[chainId]/pool/v3/add` | Medium | High | Same pattern; do not cache mutable position inputs. |
| `/[chainId]/pool/v2/[address]/add` | Medium | High | Cache pool identity/header; stream wallet position and transaction form. Remove referer dependency. |
| `/[chainId]/pool/v2/[address]/remove` | Medium | High | Cache pool identity/header; stream wallet position and transaction form. |
| `/[chainId]/pool/v2/[address]/migrate` | Medium | High | Cache pool identity/header; stream migration eligibility and wallet state. |
| `/[chainId]/pool/v3/[address]/create` | Medium | High | Cache pool header; keep range inputs, balances, allowance, and submission live. |
| `/[chainId]/pool/v3/[address]/positions` | Medium | High | Cache pool header; stream the connected account's positions. |
| `/[chainId]/pool/v3/[address]/[position]` | Medium | High | Cache pool identity; stream position ownership/state and controls. |
| `/[chainId]/pool/incentivize` | Medium | Medium | Static instructions/frame in shell; dynamic incentive configuration and transaction flow stay client-side. |
| `/[chainId]/migrate` | Medium | Medium | Static migration explanation and frame in shell; eligibility and execution stay wallet-dependent. |

These pages should be judged by shell completeness, not by whether the widget is
server-rendered. A stable card with accurate dimensions and controls skeletons
prevents layout shift and makes navigation feel immediate. Bundle splitting and
client-provider reduction remain separate performance work.

### Positions, claims, staking, and perps

| Route/page | Gain | Complexity | Recommended treatment |
| --- | --- | --- | --- |
| `/[chainId]/pool` positions | Medium | High | Prerender navigation/filter frame and empty/loading state; connected-wallet positions stream. |
| `/claim` fees | Low-Medium | High | Prerender claim page chrome and disconnected state only; claimable data is wallet-specific. |
| `/claim/rewards` | Low-Medium | High | Same as fees. |
| `/stake` | Medium | High | Cache public protocol/chart history if suitable; stream balances, voting power, and management actions. |
| `/perps` | Medium | High | Prerender market frame and deterministic navigation; live order book, account state, and trading remain client/live. |
| `/perps/leaderboard` | High | Medium | Cache public leaderboard snapshots briefly; stream the viewer's rank if personalized. |
| `/perps/points` | Medium | Medium | Cache program copy/rules; stream account points. |
| `/perps/portfolio` | Medium | High | Static layout and skeleton cards in shell; account charts/stats/tables stream. Preserve the recent route-local chart imports. |
| `/perps/referrals` | Medium | High | Cache program copy; stream referral/account state. |
| `/perps/vaults` | High | Medium | Cache public vault list briefly and tag it; wallet overlays remain dynamic. |
| `/perps/vaults/[address]` | High | Medium | Cache vault definition and public summary; stream current metrics and user position. |
| `/perps/invite/[code]` | Low-Medium | Medium | Static invite frame; validate code and account eligibility at request time. Do not cache personalized acceptance state. |

Perps has 99 client-boundary files in its subtree, so PPR will not by itself fix
JavaScript cost. It is still useful for navigation, market/vault discovery, and
stable skeletons. Continue the branch's existing direction of keeping expensive
features route-local and dynamically loaded.

### Aptos, Stellar, Solana, and test routes

| Route/page | Gain | Complexity | Recommended treatment |
| --- | --- | --- | --- |
| `/aptos/explore/pools` | High | Medium | Static discovery frame and cached public pool list if the data source supports safe shared caching. |
| `/aptos/pool` positions | Low-Medium | High | Static filter/empty shell; positions remain wallet-specific. |
| `/aptos/pool/[address]` | Medium | High | Move public pool identity/summary to a server/cacheable component; keep farm, stake, reward, and account hooks in a client island. Remove referer dependency from layout. |
| `/aptos/pool/add` | Medium | High | Static form shell; wallet/network/token-pair state remains client-side. |
| `/aptos/swap` | Medium | High | Static widget shell; Aptos wallet and quote logic hydrate/stream. |
| `/stellar/explore/pools` | High | Medium | Static discovery frame and cacheable public pool list where safe. |
| `/stellar/pool` positions | Low-Medium | High | Static filter/empty shell; wallet positions remain live. |
| `/stellar/legacy-positions` | Low-Medium | High | Static explanation/frame; connected account data remains live. |
| `/stellar/pool/[address]` | Medium | High | Split public pool data from the current all-client page. Remove referer dependency from layout. |
| `/stellar/pool/add` | Medium | High | Static form shell; trustline, balance, pool, and transaction hooks remain live. |
| `/stellar/swap` | Medium | High | Static widget shell; wallet and quote logic remain client-side. |
| `/solana/swap` | None | Low | Currently renders not-found. Do not migrate beyond ensuring the not-found shell behaves. |
| `/test` | None | Low | Test-only; no production investment. |
| `/test/swap` | None | Low | Test-only; no production investment. |

### Token-list request flow

| Route/page | Gain | Complexity | Recommended treatment |
| --- | --- | --- | --- |
| `/tokenlist-request` | Medium | High | Static form frame/help text in shell; wallet, validation, and submission remain client-side. |
| `/tokenlist-request/pending` | Medium | High | Static status frame; request/account status remains live. |
| `/tokenlist-request/approved` | Medium | High | Static status frame; request/account status remains live. |

The token-list layout repeats the network layout's request-cookie pattern and
passes it into a provider around the entire subtree. Reuse the same wallet
bootstrap solution rather than creating a second PPR-specific architecture.

## Cross-cutting implementation design

### 1. Use small cache boundaries

Prefer cacheable data/component functions close to the external read:

```tsx
import { cacheLife, cacheTag } from 'next/cache'

async function CachedTokenSummary({ chainId, address }: Props) {
  'use cache'
  cacheLife('minutes')
  cacheTag(`token:${chainId}:${address}`)

  const data = await getTokenData(chainId, address)
  return <TokenSummary data={data} />
}
```

Do not put `'use cache'` at the entire network layout. Large scopes make
invalidation coarse and make it easy to capture non-serializable provider values
or request-specific data.

Suggested cache domains:

| Domain | Starting lifetime | Invalidation |
| --- | --- | --- |
| Legal/CMS article body | 1-24 hours | CMS webhook tag |
| CMS lists/categories | 5-60 minutes | CMS webhook tag |
| Token/pool identity metadata | 15-60 minutes | Data pipeline tag or time |
| Explore first-page market data | 30-120 seconds | Time-based; tag when pipeline supports it |
| Public vault/leaderboard snapshots | 15-60 seconds | Time-based |
| Supported-chain/config data | Hours/max | Deploy or explicit config tag |
| Wallet/account data | Never shared | Request-time Suspense/client query |

These are starting values, not promises about data freshness. Confirm them with
each upstream owner's SLA and current client polling behavior.

### 2. Isolate request context

There are two remaining request-context cases:

1. The root cookie dialog already follows the correct pattern: a narrow
   `cookies()` reader is inside Suspense.
2. Pool layouts use `referer` for navigation. Remove that server request
   dependency in favor of canonical links/client history.

The initial Wagmi preparation is implemented on this branch:

- The network and token-list layouts no longer read request headers.
- The shared Wagmi provider no longer receives server-derived initial state.
- Active provider trees use one app-facing `WalletProvider` facade. Internally it
  preserves the required `PrivyProvider -> WagmiProvider -> wallet state` order,
  ensuring the namespace layer consumes one existing Wagmi context. Redundant
  Solana and Stellar route-level wallet providers have been removed.
- Wagmi retains `ssr: true` and cookie storage, so persisted connections restore
  after hydration without making the layout request-specific.
- The unified wallet context exposes global and per-namespace restoration.
  Connect controls render a disabled restoring state, and a wallet-derived EVM
  network selector renders a stable skeleton until Wagmi/Privy restoration has
  settled. Route-selected networks remain immediately visible because they are
  not derived from the wallet.
- Restoration fails open after ten seconds so an unavailable wallet SDK cannot
  leave every transaction surface permanently disabled. The timeout is logged
  with the namespaces that did not settle.

The remaining Wagmi work is browser-level verification of injected,
WalletConnect, and Privy embedded-wallet reconnection. Transaction actions now
remain disabled until their relevant namespace restoration settles.

### 3. Treat params deliberately

With Cache Components, dynamic params are request-time unless representative
values are supplied. Generate every supported finite chain ID. Generate known
CMS/legal slugs. For unbounded token, pool, vault, and invite IDs, keep
validation and personalized reads behind boundaries; do not attempt to prebuild
the full space.

### 4. Provide real fallbacks

Several existing Suspense boundaries have no fallback. For PPR, an empty
fallback means an incomplete shell. Reuse the 16 existing `loading.tsx` designs
at component granularity and add skeletons for:

- explore table rows and charts;
- token/pool summary metrics;
- wallet/account cards;
- swap/liquidity widget inputs.

Fallbacks must reserve the final dimensions to avoid cumulative layout shift,
remain accessible, and not display fake actionable values.

### 5. Resolve global migration blockers

Before turning on `cacheComponents`:

- Replace all 13 in-scope page/layout `revalidate` and `fetchCache` exports.
- Audit the 9 `unstable_cache` call sites and convert suitable ones to narrow
  `use cache` functions with `cacheLife`/`cacheTag`.
- Remove or move the 8 remaining layout-level request API reads behind
  boundaries.
- Validate the three active `runtime = 'edge'` config route handlers. The
  official migration guide says Cache Components requires Node runtime, so the
  conservative plan is to move these small handlers to Node before rollout.
- Add parameter generation for supported chains and finite CMS/legal content.
- Add visible fallbacks to important Suspense boundaries.

## Rollout plan

### Phase 0: measurement and build spike

- Record p50/p75/p95 TTFB, FCP, LCP, INP, CLS, RSC transfer size, JS transfer,
  server duration, cache hit rate, and upstream request count by route family.
- Select one production-like URL for each major family and one cold-cache run.
- Enable `cacheComponents` in a short-lived spike and use build errors as the
  exhaustive uncached/request-data inventory.
- Confirm deployment-platform support and Node runtime behavior.

Exit criterion: the build is green and the team has a route-level baseline,
not merely a Lighthouse score from one warm local run.

### Phase 1: public low-risk routes

Migrate legal, partner, and CMS routes. Add CMS tags/webhook invalidation if
available.

Exit criterion: unchanged content freshness and SEO output; lower or equal p75
TTFB/LCP; no increase in upstream CMS traffic.

### Phase 2: provider and parameter architecture

Verify the consolidated wallet provider and restoration states, remove referer
reads from pool layouts, and generate supported chain params.

Exit criterion: the network header/page frame is visibly present in the
prerendered response, and wallet reconnect behavior passes end-to-end tests.

### Phase 3: public DeFi data

Migrate explore tables, token pages, V2/V3/Blade pool details, smart pools,
vault lists/details, and leaderboard pages.

Exit criterion: cached public data has explicit freshness ownership; invalid
addresses still 404 correctly; no cross-chain cache-key collisions; meaningful
shell improves p75 LCP.

### Phase 4: transactional shells

Migrate swaps, Orbs orders, add/remove/migrate liquidity, positions, claims,
staking, perps portfolio/trading, and non-EVM transaction pages.

Exit criterion: no wallet/network flash, no enabled-looking fake actions in
fallbacks, no transaction regression, and CLS does not regress.

## Validation matrix

Every migrated family should cover:

- `pnpm --filter web check`
- targeted unit tests for cache keys, lifetimes, tags, and param validation;
- production `next build` with Cache Components enabled;
- direct-load and client-navigation tests for cached and uncached params;
- JavaScript-disabled inspection of the static shell;
- wallet disconnected, reconnecting, connected, wrong-network, and sanctioned
  states;
- CMS publish/update invalidation;
- invalid pool/token/vault/invite slugs and not-found behavior;
- Core Web Vitals comparison under cold and warm caches.

## Risks and guardrails

| Risk | Guardrail |
| --- | --- |
| Stale prices or transaction inputs | Never cache quotes, balances, allowances, nonces, or execution state; label snapshot data where appropriate. |
| Account data leakage | No shared `use cache` around cookies, wallet addresses, balances, positions, or transaction state. |
| Cache explosion from arbitrary addresses | Validate before lookup, normalize address casing, use narrow keys/lifetimes, and observe cardinality. |
| Whole-route Suspense produces a blank shell | Inspect generated HTML and require route-specific shell-completeness thresholds. |
| Hydration remains slow | Track JS and INP separately; continue route-local imports and client-boundary reduction. |
| Build time grows from too many params | Prebuild finite chains/content and only a measured top set of unbounded addresses. |
| Data freshness changes silently | Give every cache domain an owner, lifetime, invalidation mechanism, and test. |
| Provider behavior flashes or reconnects | E2E wallet/session coverage before and after the provider split. |

## Final recommendation

Adopt Cache Components/PPR, starting with public cacheable content and discovery
surfaces. Do not begin by adding `cacheComponents: true` to the main branch and
then wrapping every error in a large Suspense boundary; that would satisfy the
framework while leaving most of Sushi's useful UI out of the shell.

The decisive architectural work is to make request-specific wallet/session
bootstrap smaller than the page. Once that is done, Sushi's route structure is
well suited to PPR: it has substantial stable navigation and page chrome,
public market/content data with natural cache windows, and clearly dynamic
wallet/account islands. The public CMS/legal pilot proves the caching model, and
the network provider split unlocks the largest product gains.
