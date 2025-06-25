import { Button, Dots } from "@sushiswap/ui";
import type { TwapSupportedChainId } from "src/config";
import { type TwapOrder } from "src/lib/hooks/react-query/twap";
import { useCancelOrder } from "src/lib/hooks/react-query/twap/useCancelOrder";

export const TwapCancelOrderButton = ({
  chainId,
  order,
}: {
  chainId: TwapSupportedChainId;
  order: TwapOrder;
}) => {
  const {
    write,
    isWritePending,
    isTxLoading,
    isTxError,
    isEstGasError,
    disabled,
  } = useCancelOrder(chainId, order);
  return (
    <Button
      fullWidth
      size="xl"
      loading={!write && !isEstGasError}
      onClick={() => write?.()}
      disabled={disabled}
      testId="cancel-order"
    >
      {isEstGasError || isTxError ? (
        "Shoot! Something went wrong :("
      ) : isWritePending || isTxLoading ? (
        <Dots>Cancel Order</Dots>
      ) : (
        "Cancel Order"
      )}
    </Button>
  );
};
