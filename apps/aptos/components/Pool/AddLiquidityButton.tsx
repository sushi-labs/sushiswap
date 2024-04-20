import { Button } from '@sushiswap/ui'
import { Modal } from 'components/Modal/Modal'
import { usePoolState } from '../../ui/pool/pool/add/pool-add-provider/pool-add-provider'
import { Checker } from 'ui/common/checker'

interface Props {
  buttonError: string
  token1Value: string
}

export const AddLiquidityButton = ({ buttonError, token1Value }: Props) => {
  const { isPriceFetching, amount0, amount1 } = usePoolState()

  return (
    <Modal.Trigger tag="add-liquidity">
      {({ open }) => (
        <Checker.Connect>
          <Button
            fullWidth
            size="xl"
            type="button"
            disabled={Boolean(
              !!buttonError ||
                isPriceFetching ||
                buttonError ||
                Number(amount0) <= 0 ||
                Number(amount1) <= 0,
            )}
            onClick={() => {
              token1Value ? open() : {}
            }}
          >
            {buttonError ? (
              'Insufficient Balance'
            ) : Number(amount0) > 0 && Number(amount1) > 0 ? (
              <>Add Liquidity</>
            ) : (
              <>Enter Amount</>
            )}
          </Button>
        </Checker.Connect>
      )}
    </Modal.Trigger>
  )
}
