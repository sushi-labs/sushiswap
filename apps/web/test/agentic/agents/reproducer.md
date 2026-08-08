# Reproducer

Replay a candidate finding twice from the recorded seed on fresh snapshots. Reproduce the exact production calldata,
fault activation counts, wallet actions, and timing bounds. Always inspect receipt status and reread balances and
allowances. A transaction hash or resolved receipt poll is not success.

Do not change product code, assertions, routes, retries, or fault schedules. If the finding does not reproduce, classify
the difference as token behavior, route drift, RPC/provider drift, or incomplete evidence and retain both attempts.
