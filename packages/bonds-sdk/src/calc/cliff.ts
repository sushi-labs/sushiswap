import { VestingType } from '..'

interface GetCliffTimestamp {
  vestingLength: number
  vestingType: VestingType
}

/**
 *
 * @param vestingType type of vesting
 * @param vestingLength length of vesting
 *
 * @returns cliff timestamp in seconds
 */
export function getCliffTimestamp({
  vestingType,
  vestingLength,
}: GetCliffTimestamp) {
  switch (vestingType) {
    case VestingType['Fixed-Term']: {
      return vestingLength + Math.floor(Date.now() / 1000)
    }
  }
}
