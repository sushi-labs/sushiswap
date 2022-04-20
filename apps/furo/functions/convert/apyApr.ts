/**
 * @file apyApr
 * @note original implementation: https://gist.github.com/sterlu/4b44f59ea665819974ae684d7f564d9b
 */

/**
 * @const SECONDS_PER_YEAR
 * @summary
 *  A four-century period will be missing 3 of its 100 Julian leap years, leaving 97.
 *      So the average year has 365 + 97/400 = 365.2425 days
 *      ERROR RATE (Julian): -0.0078 = 365.25
 *      ERROR RATE (Gregorian): -0.0003 = 365.2425
 *      A Day = 24 * 60 * 60 sec = 86400 sec
 *      (Gregorian): 365.2425 * 86400 = 31556952.0
 * see https://github.com/yearn/yearn-vaults/blob/912e04db254c6c3b4ea420a97fe42495c4d5343a/contracts/Vault.vy#L235
 */

const SECONDS_PER_YEAR = 365.2425 * 86400 /** SECONDS_PER_YEAR = 31,556,952 */

/**
 * @const BLOCKS_IN_A_YEAR
 * @summary
 *   London / Berlin / Muir Glacier Block Speed
 *   AVERAGE: 13.2
 *   MEDIAN: 13.21475904
 *   Source: https://openmev.page.link/block-delta
 *
 * @NOTE: We round up due to an observed increase in block prop. from Muir Glacier <> Berlin vs. Berlin <> London
 *   Muir-Glacier <> Berlin sees ~13.15
 */

const BLOCKS_IN_A_YEAR = SECONDS_PER_YEAR / 13.25

/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param apy {Number} APY as percentage (ie. 6)
 * @param frequency {Number} Compounding frequency (times a year)
 * @returns {Number} APR as percentage (ie. 5.82 for APY of 6%)
 */
// @ts-ignore TYPE NEEDS FIXING
export const apyToApr = (apy, frequency = BLOCKS_IN_A_YEAR) =>
  ((1 + apy / 100) ** (1 / frequency) - 1) * frequency * 100

/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param apr {Number} APR as percentage (ie. 5.82)
 * @param frequency {Number} Compounding frequency (times a year)
 * @returns {Number} APY as percentage (ie. 6 for APR of 5.82%)
 */
// @ts-ignore TYPE NEEDS FIXING
export const aprToApy = (apr, frequency = BLOCKS_IN_A_YEAR) => ((1 + apr / 100 / frequency) ** frequency - 1) * 100
