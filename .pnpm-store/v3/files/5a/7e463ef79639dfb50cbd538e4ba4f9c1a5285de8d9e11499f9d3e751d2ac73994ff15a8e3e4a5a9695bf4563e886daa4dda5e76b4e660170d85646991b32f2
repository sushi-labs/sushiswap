# WalletConnect Client

Client for WalletConnect

For more details, read the [documentation](https://docs.walletconnect.org)

## Install

```bash
yarn add @walletconnect/client
# OR

npm install --save @walletconnect/client
```

## Initiate Connection

```javascript
import WalletConnect from "@walletconnect/client";

// Create a connector
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
});

connector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get updated accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

connector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Delete connector
});

const { accounts, chainId } = await connector.connect();
```

## Send Transaction \(eth_sendTransaction\)

```javascript
// Draft transaction
const tx = {
  from: "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3", // Required
  to: "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359", // Required (for non contract deployments)
  data: "0x", // Required
  gasPrice: "0x02540be400", // Optional
  gasLimit: "0x9c40", // Optional
  value: "0x00", // Optional
  nonce: "0x0114", // Optional
};

// Send transaction
connector
  .sendTransaction(tx)
  .then(result => {
    // Returns transaction id (hash)
    console.log(result);
  })
  .catch(error => {
    // Error returned when rejected
    console.error(error);
  });
```

## Sign Transaction \(eth_signTransaction\)

```javascript
// Draft transaction
const tx = {
  from: "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3", // Required
  to: "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359", // Required (for non contract deployments)
  data: "0x", // Required
  gasPrice: "0x02540be400", // Optional
  gasLimit: "0x9c40", // Optional
  value: "0x00", // Optional
  nonce: "0x0114", // Optional
};

// Sign transaction
connector
  .signTransaction(tx)
  .then(result => {
    // Returns signed transaction
    console.log(result);
  })
  .catch(error => {
    // Error returned when rejected
    console.error(error);
  });
```

## Sign Personal Message \(personal_sign\)

```javascript

// Draft Message Parameters
const message = "My email is john@doe.com - 1537836206101"

const msgParams = [
  convertUtf8ToHex(message)                                                 // Required
  "0xbc28ea04101f03ea7a94c1379bc3ab32e65e62d3",                             // Required
];


// Sign personal message
connector
  .signPersonalMessage(msgParams)
  .then((result) => {
    // Returns signature.
    console.log(result)
  })
  .catch(error => {
    // Error returned when rejected
    console.error(error);
  })
```

## Sign Message \(eth_sign\)

```javascript

// Draft Message Parameters
const message = "My email is john@doe.com - 1537836206101";

const msgParams = [
  "0xbc28ea04101f03ea7a94c1379bc3ab32e65e62d3",                            // Required
  keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))    // Required
];


// Sign message
connector
  .signMessage(msgParams)
  .then((result) => {
    // Returns signature.
    console.log(result)
  })
  .catch(error => {
    // Error returned when rejected
    console.error(error);
  })
```

## Sign Typed Data \(eth_signTypedData\)

```javascript
// Draft Message Parameters
const typedData = {
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    Person: [
      { name: "name", type: "string" },
      { name: "account", type: "address" },
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "string" },
    ],
  },
  primaryType: "Mail",
  domain: {
    name: "Example Dapp",
    version: "1.0.0-beta",
    chainId: 1,
    verifyingContract: "0x0000000000000000000000000000000000000000",
  },
  message: {
    from: {
      name: "Alice",
      account: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    to: {
      name: "Bob",
      account: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    },
    contents: "Hey, Bob!",
  },
};

const msgParams = [
  "0xbc28ea04101f03ea7a94c1379bc3ab32e65e62d3", // Required
  typedData, // Required
];

// Sign Typed Data
connector
  .signTypedData(msgParams)
  .then(result => {
    // Returns signature.
    console.log(result);
  })
  .catch(error => {
    // Error returned when rejected
    console.error(error);
  });
```

## Send Custom Request

```javascript
// Draft Custom Request
const customRequest = {
  id: 1337,
  jsonrpc: "2.0",
  method: "eth_signTransaction",
  params: [
    {
      from: "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3",
      to: "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359",
      data: "0x",
      gasPrice: "0x02540be400",
      gasLimit: "0x9c40",
      value: "0x00",
      nonce: "0x0114",
    },
  ],
};

// Send Custom Request
connector
  .sendCustomRequest(customRequest)
  .then(result => {
    // Returns request result
    console.log(result);
  })
  .catch(error => {
    // Error returned when rejected
    console.error(error);
  });
```

## Create Instant Request

```js
import WalletConnect from "@walletconnect/browser";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";

// Create a connector
const connector = new WalletConnect();

// Draft Instant Request
const instantRequest = {
  id: 1,
  jsonrpc: "2.0",
  method: "eth_signTransaction",
  params: [
    {
      from: "0xbc28ea04101f03ea7a94c1379bc3ab32e65e62d3",
      to: "0x0000000000000000000000000000000000000000",
      nonce: 1,
      gas: 100000,
      value: 0,
      data: "0x0",
    },
  ],
};

// Create Instant Request
connector
  .createInstantRequest(instantRequest)
  .then(result => {
    // Get Instant Request Result
    console.log(result);
  })
  .catch(error => {
    // Handle Error or Rejection
    console.error(error);
  });
```
