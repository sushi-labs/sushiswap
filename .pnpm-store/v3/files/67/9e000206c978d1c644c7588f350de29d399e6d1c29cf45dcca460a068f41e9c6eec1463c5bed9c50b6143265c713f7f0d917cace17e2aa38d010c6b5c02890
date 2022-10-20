# Safe Apps wagmi connector

[![npm](https://img.shields.io/npm/v/@gnosis.pm/safe-apps-wagmi)](https://www.npmjs.com/package/@gnosis.pm/safe-apps-wagmi)

A connector to be used with wagmi library

## Installation

```bash
yarn add @gnosis.pm/safe-apps-wagmi @wagmi/core

npm install @gnosis.pm/safe-apps-wagmi @wagmi/core
```

## Integration steps

1. Configure wagmi client
```js
import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi';

const chains = ...

const client = createClient({
    connectors: [
        new SafeConnector({ chains }),
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
            chains,
            options: {
                qrcode: true,
            },
        }),
        new InjectedConnector({
            chains,
            options: {
                name: 'Injected',
                shimDisconnect: true,
            },
        }),
    ],
    ...
});
```

Make sure to omit the `autoConnect` property or set it to false. Wagmi library automatically connects to the last used provider, but instead we want to automatically connect to the Safe if the app is loaded in the Safe Context. Autoconnect logic may be implemented via a separate hook.

2. Create an autoconnect hook

```ts
import { useConnect } from 'wagmi';
import { useEffect } from 'react';

const AUTOCONNECTED_CONNECTOR_IDS = ['safe'];

function useAutoConnect() {
  const { connect, connectors } = useConnect();

  useEffect(() => {
    AUTOCONNECTED_CONNECTOR_IDS.forEach((connector) => {
      const connectorInstance = connectors.find((c) => c.id === connector && c.ready);

      if (connectorInstance) {
        connect(connectorInstance);
      }
    });
  }, [connect, connectors]);
}

export { useAutoConnect };
```

This hook tries to connect to the Safe wallet automatically on the app load. The hook can be extended with other connectors that use a similar iframe approach (e.g., Ledger Live). It can also be extended with fallback logic such as the last used wallet if the connection to the Safe doesn't succeed.

## Example
An example application can be found [here](/examples/wagmi)

## More scenarios

For the SDK overview documentation, please refer to the [safe-apps-sdk](https://github.com/gnosis/safe-apps-sdk/) documentation
