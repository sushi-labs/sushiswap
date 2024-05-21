'use client'

import { Button, ButtonProps } from '@sushiswap/ui'
import { AddSectionReviewModal } from 'components/Pool/AddSectionReviewModel'
import { FC, useMemo } from 'react'
import { Checker } from 'ui/common/checker'
import { usePoolState } from 'ui/pool/pool/add/pool-add-provider/pool-add-provider'

interface PoolAddDepositButtonProps {
  buttonProps?: ButtonProps
}

export const PoolAddDepositButton: FC<PoolAddDepositButtonProps> = ({
  buttonProps,
}) => {
  const { token0, token1, amount0, amount1 } = usePoolState()

  const checkerAmounts = useMemo(() => {
    const tokens = [token0, token1]
    const amounts = [amount0, amount1]

    return tokens.map((token, i) => ({
      currency: token.address,
      amount: Number(amounts[i] || 0) / 10 ** token.decimals,
    }))
  }, [token0, token1, amount0, amount1])

  return (
    <Checker.Connect {...buttonProps}>
      <Checker.Amounts amounts={checkerAmounts} {...buttonProps}>
        <AddSectionReviewModal>
          <Button {...buttonProps}>Add Liquidity</Button>
        </AddSectionReviewModal>
      </Checker.Amounts>
    </Checker.Connect>
  )
}
