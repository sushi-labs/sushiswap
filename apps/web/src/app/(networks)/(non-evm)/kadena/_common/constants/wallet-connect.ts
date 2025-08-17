export const kadenaNamespace = {
  kadena: {
    methods: ['kadena_getAccounts_v1', 'kadena_sign_v1', 'kadena_quicksign_v1'],
    chains: ['kadena:mainnet01', 'kadena:testnet04'],
    events: [],
    rpcMap: {
      'kadena:mainnet01': 'https://api.chainweb.com',
      'kadena:testnet04': 'https://api.testnet.chainweb.com',
    },
  },
}
