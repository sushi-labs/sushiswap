# Stellar source versus deployment verification

Checked on 2026-09-29. **The current `main` sources supplied by the user are not identical to the active contracts.** The earlier math investigation established selected deployed behavior, not a complete reproducible source-to-binary match. In particular, the active manager lacks public functions present in current periphery source, and the active factory embeds a different SDK version from the current core build configuration.

## Scope and active contracts

The app's configured manager and factory were read directly from Stellar mainnet contract-instance ledger entries. Their referenced WASM bytes were downloaded and independently SHA-256 hashed. The manager's stored factory address matches the app's factory, and the sampled XLM/USDC pool stores that same factory. At ledger **64683030**, the results were:

| Contract | Address | Active WASM SHA-256 |
| --- | --- | --- |
| Position manager | `CARTUL5AWDZYBSN7HUUJZSKCAKCIAKM7M54Z76G6KRYCK4XPR3OHUQZ4` | `be969de545da89a04508e4952e94a53a77e76ecfa67d74b23fd56e0be42290d4` |
| Factory | `CD3KRKGDRVWPXVB3VXLUMQKMX6XZ6Q2H334IVZD4XXNAMKSRVQL5GLYF` | `9f94c577ea24c2f71cbb0c964c9c9d321e02448d1fe946020afb18974b1c2602` |
| XLM/USDC 0.3% pool | `CCR2CH4GQVCZHG7CHFVMNANCK45CU5DVKXZIIITDZQAU3CEJZ7RQH2MQ` | `003710b383f9da7d650a7f719a7be479110266427817ebbed61d924505fcd7c7` |

The factory's selected WASM hash for new pools is also `003710b383f9da7d650a7f719a7be479110266427817ebbed61d924505fcd7c7`. Raw evidence and the reproducing read script are `/tmp/stellar-contract-sources/active-contracts.json` and `active-wasm.cjs`. Binary exports and custom-section metadata are recorded in `/tmp/stellar-contract-sources/wasm-metadata.json`. These observations identify active binaries; they do not themselves identify all source inputs used to build them.

The GitHub API confirmed the source heads still resolve to:

- Core: [`21ab5ae31600cc86ccf676bfd706b716d31c847a`](https://github.com/sushi-labs/sushi-stellar/tree/21ab5ae31600cc86ccf676bfd706b716d31c847a), dated 2026-07-20.
- Periphery: [`c5985292b3b62abb95d6287d1ac0d0e96c3cacf8`](https://github.com/sushi-labs/sushi-stellar-periphery/tree/c5985292b3b62abb95d6287d1ac0d0e96c3cacf8), dated 2026-07-27.

## Position manager: current source is demonstrably different

The downloaded active manager WASM has no exports for these public functions in the current source:

- `approve_manager_wasm_hash`
- `revoke_manager_wasm_hash`
- `is_manager_wasm_hash_approved`
- `set_upgrade_frozen`
- `is_upgrade_frozen`
- `is_upgrade_permanently_disabled`
- `is_upgradeability_revoked`

The first six were added by the [current head's B16 upgrade-controls change](https://github.com/sushi-labs/sushi-stellar-periphery/commit/c5985292b3b62abb95d6287d1ac0d0e96c3cacf8). They are unconditional public `#[contractimpl]` methods in [the manager source](https://github.com/sushi-labs/sushi-stellar-periphery/blob/c5985292b3b62abb95d6287d1ac0d0e96c3cacf8/contracts/manager/src/nonfungible_position_manager.rs#L1913). Their absence from the active WASM export table proves that this is not the same contract implementation as current `main`, independent of any compiler-dependent byte differences.

The active manager embeds `rsver=1.88.0` and `rssdkver=23.0.2#a97daf8b07cdf24e9bd45e344db51a21b9ea77d3`. Those versions are compatible with the current periphery toolchain/dependency setup, but that compatibility does not identify the application-source revision. See the [toolchain](https://github.com/sushi-labs/sushi-stellar-periphery/blob/c5985292b3b62abb95d6287d1ac0d0e96c3cacf8/rust-toolchain.toml) and [workspace dependency](https://github.com/sushi-labs/sushi-stellar-periphery/blob/c5985292b3b62abb95d6287d1ac0d0e96c3cacf8/Cargo.toml#L14).

The previous read-only `position_principal` simulation identifies the manager's negative-tick rounding behavior. It does **not** prove its mint implementation, authorization logic, or every linked dependency matches a particular historical source revision. The exact manager source/build provenance remains unverified. The [May deployment-branch merge](https://github.com/sushi-labs/sushi-stellar-periphery/commit/fe10e412794b85137085ce679702c267118fc024) records historical mainnet-related code, but its name is not a hash-matched build attestation.

## Factory: current build configuration differs; exact source unknown

The active factory embeds `rsver=1.89.0` and `rssdkver=23.0.2#a97daf8b07cdf24e9bd45e344db51a21b9ea77d3`. Current core source requires [`soroban-sdk = "23.5.3"`](https://github.com/sushi-labs/sushi-stellar/blob/21ab5ae31600cc86ccf676bfd706b716d31c847a/Cargo.toml#L13), changed from 23.0.2 in [commit `018b5f27`](https://github.com/sushi-labs/sushi-stellar/commit/018b5f27baaf8a594b0a0c69ecf148955131c1e2). Thus the deployed factory was not built from the unmodified current dependency configuration.

Its exported entrypoint names match the inspected factory source. Matching names establish interface overlap, not function-body equivalence. No exact source revision or reproducible factory build was established.

## Pool: first-party historical provenance, not a reproduced build

The active pool hash and the factory's chosen new-pool hash match the hash in the core maintainers' [2026-06-05 build/upload record](https://github.com/sushi-labs/sushi-stellar/blob/21ab5ae31600cc86ccf676bfd706b716d31c847a/upgrade-artifacts/MAINNET_FLASH_REMEDIATION_HUMAN_READABLE_UPGRADE_LOG_2026-06-05.md#L117). That record identifies [source commit `956725a274eae4a79dfea68c99dd2c05dccc1e14`](https://github.com/sushi-labs/sushi-stellar/blob/21ab5ae31600cc86ccf676bfd706b716d31c847a/upgrade-artifacts/MAINNET_FLASH_REMEDIATION_HUMAN_READABLE_UPGRADE_LOG_2026-06-05.md#L37).

This is stronger provenance than a behavioral probe: the live executable hash matches an explicit first-party source/build record. It is still not an independent reproduction of that build. It also points to a historical revision, not current core `main`. The [July negative-tick rounding change](https://github.com/sushi-labs/sushi-stellar/commit/a3ecac324b85ddafdeec60527c32898c53e1ee0a) postdates that revision. Existing pools may have different executable hashes; this investigation sampled one pool and the factory's current default.

## Checked-in fixtures are different binaries

The current periphery repository's test fixtures do not match the active factory/pool binaries:

| Fixture | SHA-256 of checked-in file |
| --- | --- |
| `contracts/manager/test-fixtures/dex_factory.wasm` | `30c6b961351b502bf79d2d77fadb60cdfb5d56cb2f8de0dbbb09b24b5538faaf` |
| `contracts/manager/test-fixtures/dex_pool.wasm` | `444bcb66c2d0a8fe165c0fc12688e69d6e7ae68162e6e35c5f70075436ce9922` |

The fixture documentation only refers to [core's main branch](https://github.com/sushi-labs/sushi-stellar-periphery/blob/c5985292b3b62abb95d6287d1ac0d0e96c3cacf8/contracts/manager/test-fixtures/README.md#L11), without pinning the source commit. Passing tests using those fixtures does not establish parity with active mainnet contracts.

Authenticated GitHub API checks found no published releases or retained Actions artifacts in either repository, no GitHub deployment records for periphery, and no indexed first-party code record of the active manager/factory hashes. Those negative results limit the evidence available from these locations; they do not prove a record exists nowhere else. The relevant API endpoints were [`releases`](https://api.github.com/repos/sushi-labs/sushi-stellar-periphery/releases), [`actions/artifacts`](https://api.github.com/repos/sushi-labs/sushi-stellar-periphery/actions/artifacts), and [`deployments`](https://api.github.com/repos/sushi-labs/sushi-stellar-periphery/deployments), with the analogous core release/artifact endpoints also checked.

## Consequence for the frontend work

Keep the verified distinction explicit: local arithmetic tests and live rounding probes support the selected arithmetic behavior, while full deployed-contract source identity is not established. Current `main` must not be described as the deployed specification. Closing that gap requires source/build provenance for the active manager and factory hashes, plus matching rebuilds or equivalent verifiable first-party build artifacts. No production code change follows solely from finding that current source differs; any further adjustment must be grounded in the deployed behavior or verified historical implementation.

Subsequent [end-to-end simulations](stellar-e2e-simulation.md) execute the downloaded deployed binaries and the live manager's mint path directly. Their passing results strengthen the frontend math evidence without claiming source/build identity.
