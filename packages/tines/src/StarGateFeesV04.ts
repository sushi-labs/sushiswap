export interface BridgeState {
  currentAssetSD: bigint
  lpAsset: bigint
  eqFeePool: bigint
  idealBalance: bigint
  currentBalance: bigint
  allocPointIsPositive: boolean
}

export interface Fees {
  eqFee: bigint
  eqReward: bigint
  lpFee: bigint
  protocolFee: bigint
}

const ZERO = 0n
const E14 = 10n ** 14n
const E13 = 10n ** 13n
const E17 = 10n ** 17n
const DENOMINATOR = 10n ** 18n
const DELTA_1 = 6000n * E14
const DELTA_2 = 500n * E14
const LAMBDA_1 = 40n * E14
const LAMBDA_2 = 9960n * E14
const LP_FEE = 10n * E13
const PROTOCOL_FEE = 50n * E13
const PROTOCOL_SUBSIDY = 3n * E13
const FIFTY_PERCENT = 5n * E17
const SIXTY_PERCENT = 6n * E17

export function getStarGateFeesV04(
  state: BridgeState,
  whitelisted: boolean,
  amountSD: bigint,
): Fees {
  const eqReward = getEqReward(state, amountSD)

  // calculate the equilibrium fee
  const { eqFee, protocolSubsidy } = getEquilibriumFee(state, amountSD)

  // calculate protocol and lp fee
  const { protocolFee, lpFee } = whitelisted
    ? { protocolFee: ZERO, lpFee: ZERO }
    : getProtocolAndLpFee(state, amountSD, protocolSubsidy)

  return {
    eqFee,
    eqReward,
    lpFee,
    protocolFee,
  }
}

function getEqReward(state: BridgeState, amountSD: bigint): bigint {
  if (state.lpAsset <= state.currentAssetSD) {
    return ZERO
  }

  const poolDeficit = state.lpAsset - state.currentAssetSD
  // assets in pool are < 75% of liquidity provided & amount transferred > 2% of pool deficit
  if (
    (state.currentAssetSD * 100n) / state.lpAsset < 75n &&
    amountSD * 100n > poolDeficit * 2n
  ) {
    // reward capped at rewardPoolSize
    const eqReward = (state.eqFeePool * amountSD) / poolDeficit
    if (eqReward > state.eqFeePool) {
      return state.eqFeePool
    }
    return eqReward
  } else {
    return ZERO
  }
}

function getEquilibriumFee(
  state: BridgeState,
  amountSD: bigint,
): { eqFee: bigint; protocolSubsidy: bigint } {
  const beforeBalance = state.currentBalance
  const idealBalance = state.idealBalance
  const afterBalance = beforeBalance - amountSD
  const safeZoneMax = (idealBalance * DELTA_1) / DENOMINATOR
  const safeZoneMin = (idealBalance * DELTA_2) / DENOMINATOR

  let eqFee = ZERO
  let protocolSubsidy = ZERO
  if (afterBalance >= safeZoneMax) {
    // no fee zone, protocol subsidize it.
    eqFee = (amountSD * PROTOCOL_SUBSIDY) / DENOMINATOR
    protocolSubsidy = eqFee
  } else if (afterBalance >= safeZoneMin) {
    // safe zone
    const proxyBeforeBalance =
      beforeBalance < safeZoneMax ? beforeBalance : safeZoneMax
    eqFee = getTrapezoidArea(
      LAMBDA_1,
      ZERO,
      safeZoneMax,
      safeZoneMin,
      proxyBeforeBalance,
      afterBalance,
    )
  } else {
    // danger zone
    if (beforeBalance >= safeZoneMin) {
      // across 2 or 3 zones
      // part 1
      const proxyBeforeBalance =
        beforeBalance < safeZoneMax ? beforeBalance : safeZoneMax
      eqFee =
        eqFee +
        getTrapezoidArea(
          LAMBDA_1,
          ZERO,
          safeZoneMax,
          safeZoneMin,
          proxyBeforeBalance,
          safeZoneMin,
        )
      // part 2
      eqFee =
        eqFee +
        getTrapezoidArea(
          LAMBDA_2,
          LAMBDA_1,
          safeZoneMin,
          ZERO,
          safeZoneMin,
          afterBalance,
        )
    } else {
      // only in danger zone
      // part 2 only
      eqFee =
        eqFee +
        getTrapezoidArea(
          LAMBDA_2,
          LAMBDA_1,
          safeZoneMin,
          ZERO,
          beforeBalance,
          afterBalance,
        )
    }
  }
  return { eqFee, protocolSubsidy }
}

function getProtocolAndLpFee(
  state: BridgeState,
  amountSD: bigint,
  protocolSubsidy: bigint,
): { protocolFee: bigint; lpFee: bigint } {
  let protocolFee = (amountSD * PROTOCOL_FEE) / DENOMINATOR - protocolSubsidy
  let lpFee = (amountSD * LP_FEE) / DENOMINATOR

  // when there are active emissions, give the lp fee to the protocol
  if (state.allocPointIsPositive) {
    protocolFee = protocolFee + lpFee
    lpFee = ZERO
  }

  if (state.lpAsset === 0n) {
    return { protocolFee, lpFee }
  }

  const isAboveIdeal =
    state.currentBalance - amountSD >
    (state.idealBalance * SIXTY_PERCENT) / DENOMINATOR
  const currentAssetNumerated =
    (state.currentAssetSD * DENOMINATOR) / state.lpAsset
  if (currentAssetNumerated <= FIFTY_PERCENT && isAboveIdeal) {
    // x <= 50% => no fees
    protocolFee = ZERO
    lpFee = ZERO
  } else if (currentAssetNumerated < SIXTY_PERCENT && isAboveIdeal) {
    // 50% > x < 60% => scaled fees &&
    // the resulting transfer does not drain the pathway below 60% o`f the ideal balance,

    // reduce the protocol and lp fee linearly
    // Examples:
    // currentAsset == 101, lpAsset == 200 -> haircut == 5%
    // currentAsset == 115, lpAsset == 200 -> haircut == 75%
    // currentAsset == 119, lpAsset == 200 -> haircut == 95%
    const haircut = (currentAssetNumerated - FIFTY_PERCENT) * 10n // scale the percentage by 10
    protocolFee = (protocolFee * haircut) / DENOMINATOR
    lpFee = (lpFee * haircut) / DENOMINATOR
  }

  // x > 60% => full fees
  return { protocolFee, lpFee }
}

function getTrapezoidArea(
  lambda: bigint,
  yOffset: bigint,
  xUpperBound: bigint,
  xLowerBound: bigint,
  xStart: bigint,
  xEnd: bigint,
): bigint {
  const xBoundWidth = xUpperBound - xLowerBound

  // xStartDrift = xUpperBound.sub(xStart);
  const yStart = ((xUpperBound - xStart) * lambda) / xBoundWidth + yOffset

  // xEndDrift = xUpperBound.sub(xEnd)
  const yEnd = ((xUpperBound - xEnd) * lambda) / xBoundWidth + yOffset

  // compute the area
  const deltaX = xStart - xEnd
  return ((yStart + yEnd) * deltaX) / 2n / DENOMINATOR
}
