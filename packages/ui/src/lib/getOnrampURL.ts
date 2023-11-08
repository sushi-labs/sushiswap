export enum OnRampProvider {
  Transak = 'Transak',
}

const TRANSAK_NETWORKS = [
  'ethereum',
  'arbitrum',
  'optimism',
  'bsc',
  'polygon',
  'avaxcchain',
  'celo',
  'fantom',
  'moonriver',
]

export const getOnrampURL = (provider: OnRampProvider, address: string) => {
  switch (provider) {
    default: {
      const params = new URLSearchParams()
      params.append('apiKey', '5baa5495-64a5-4bcb-af71-febf3e54b07e')
      if (address) {
        params.append('walletAddress', address)
      }
      params.append('networks', TRANSAK_NETWORKS.join(','))
      params.append('redirectURL', 'https://www.sushi.com/swap')
      params.append('isAutoFillUserData', 'true')
      params.append('hideMenu', 'true')
      params.append('isFeeCalculationHidden', 'true')
      // params.append('themeColor', '#3B82F6')
      return `https://global.transak.com/?${params.toString()}`
    }
  }
}
