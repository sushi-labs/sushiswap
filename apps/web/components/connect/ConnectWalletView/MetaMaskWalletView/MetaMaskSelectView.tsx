import { FC } from "react";
import { CHAINS, URLS } from "../../../../chains";

interface MetasMaskSelectView {
  chainId: number;
  setChainId?(chainId: number): void;
}

const MetaMaskSelectView: FC<MetasMaskSelectView> = ({
  chainId,
  setChainId,
}) => {
  return (
    <label>
      Chain:{" "}
      <select
        value={`${chainId}`}
        onChange={
          setChainId
            ? (event) => {
                setChainId(Number(event.target.value));
              }
            : undefined
        }
        disabled={!setChainId}
      >
        <option value={-1}>Default</option>
        {Object.keys(URLS).map((chainId) => (
          <option key={chainId} value={chainId}>
            {CHAINS[Number(chainId)].name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default MetaMaskSelectView;
