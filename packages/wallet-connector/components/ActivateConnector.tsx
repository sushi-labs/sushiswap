import { FC } from "react";
import { ConnectorToActivate } from "../connectors";

export const ActivateConnector: FC<ConnectorToActivate> = ({
  name,
  activateFn,
}) => {
  return (
    <div>
      <p>Connector name: {name}</p>
      <button onClick={() => activateFn()}>Connect</button>
    </div>
  );
};
