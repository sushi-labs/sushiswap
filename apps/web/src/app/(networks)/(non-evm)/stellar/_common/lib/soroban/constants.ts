import { Account } from '@stellar/stellar-sdk'

export const ZERO_ADDRESS =
  'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'

// Create a dummy account for simulation
export const SIMULATION_ACCOUNT = new Account(ZERO_ADDRESS, '0')

export const DEFAULT_TIMEOUT = 180
