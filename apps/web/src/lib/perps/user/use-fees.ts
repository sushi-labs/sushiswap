import { useMemo } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { BUILDER_FEE_PERPS_BPS, BUILDER_FEE_SPOT_BPS } from '../config'
import { useUserFees } from '../info'

export const useFees = ({
  address,
  marketType,
}: {
  address: EvmAddress | undefined
  marketType: 'perp' | 'spot' | undefined
}) => {
  const { data: feeData } = useUserFees({ address })
  const { takerFee, makerFee } = useMemo(() => {
    if (!feeData || !marketType) return { takerFee: '0', makerFee: '0' }
    const discount = 1 - Number(feeData.activeReferralDiscount || '0')
    const baseTakerFee =
      marketType === 'perp'
        ? Number(feeData.userCrossRate) * discount
        : Number(feeData.userSpotCrossRate) * discount
    const baseMakerFee =
      marketType === 'perp'
        ? Number(feeData.userAddRate) * discount
        : Number(feeData.userSpotAddRate) * discount
    const takerFeeWithBuilderFee =
      baseTakerFee +
      (marketType === 'perp' ? BUILDER_FEE_PERPS_BPS : BUILDER_FEE_SPOT_BPS)
    const makerFeeWithBuilderFee =
      baseMakerFee +
      (marketType === 'perp' ? BUILDER_FEE_PERPS_BPS : BUILDER_FEE_SPOT_BPS)
    return {
      takerFee: takerFeeWithBuilderFee,
      makerFee: makerFeeWithBuilderFee,
    }
  }, [feeData, marketType])

  return { takerFee, makerFee }
}
