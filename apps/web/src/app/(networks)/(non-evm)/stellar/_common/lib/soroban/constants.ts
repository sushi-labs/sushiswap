import { Account } from '@stellar/stellar-sdk'

export const ZERO_ADDRESS =
  'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'

// Create a dummy account for simulation
export const SIMULATION_ACCOUNT = new Account(ZERO_ADDRESS, '0')

export const DEFAULT_TIMEOUT = 180

// Number of ledgers for auth entry signature validity (~1 minute at 5s/ledger)
export const VALID_UNTIL_LEDGER_BUMP = 12
