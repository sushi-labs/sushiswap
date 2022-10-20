# Safe Apps Provider

[![npm](https://img.shields.io/npm/v/@gnosis.pm/safe-apps-provider)](https://www.npmjs.com/package/@gnosis.pm/safe-apps-provider)

This is a provider that follows common standards (e.g. [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)) and can be used with various Web3 libraries (e.g. web3.js or Ethers)

### How to use

- Add npm package

```bash
yarn add @gnosis.pm/safe-apps-provider

npm i @gnosis.pm/safe-apps-provider
```

### SafeAppProvider

The provider can be used with the [safe-apps-react-sdk](https://github.com/gnosis/safe-apps-sdk/tree/master/packages/safe-apps-react-sdk) and common web3 libraries.

#### With Ethers.js

- [Ethers.js](https://docs.ethers.io/v5/api/providers/other/#Web3Provider)

```js
import React, { useMemo } from 'react';
import { ethers } from 'ethers';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';

const App = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const web3Provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe]);

  // use provider with contracts

  return;
};

export default App;
```

#### With web3.js

- [web3.js](https://web3js.readthedocs.io/en/v1.5.2/web3.html)

```js
import React, { useMemo } from 'react';
import Web3 from 'web3';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';

const App = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const web3Provider = useMemo(() => new Web3(new SafeAppProvider(safe, sdk)), [sdk, safe]);

  // use provider with contracts

  return;
};

export default App;
```

#### More scenarios

For the SDK overview documentation, please refer to the [safe-apps-sdk](https://github.com/gnosis/safe-apps-sdk/) documentation
