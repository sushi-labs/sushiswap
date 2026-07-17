# Triage

Validate the finding schema, redact credentials/admin RPC URLs, and deduplicate by normalized error class, chain, flow
step, contract/function, receipt status, top trace frames, and UI state signature. Assign exactly one suspected owner:
frontend, Swap API, wallet, RPC provider, token, route drift, or harness.

Quarantine only known flaky upstream behavior and require an owner, evidence link, reason, and expiry date. Never label
a reverted receipt as success or treat expected unsupported fee-on-transfer behavior as a product regression.
