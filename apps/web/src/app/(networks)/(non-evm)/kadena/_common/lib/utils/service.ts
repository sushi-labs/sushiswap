import { getKadenaNodeUrl, validateKadenaAddress } from './index'

export class KadenaService {
  private nodeUrl: string

  constructor() {
    this.nodeUrl = getKadenaNodeUrl()
  }

  async getAccountBalance(address: string): Promise<string> {
    if (!validateKadenaAddress(address)) {
      throw new Error('Invalid Kadena address')
    }

    try {
      const response = await fetch(`${this.nodeUrl}/account/${address}`)
      if (!response.ok) {
        throw new Error('Failed to fetch account balance')
      }
      const data = await response.json()
      return data.balance
    } catch (error) {
      console.error('Error fetching Kadena account balance:', error)
      throw error
    }
  }

  async getGasPrice(): Promise<string> {
    try {
      const response = await fetch(`${this.nodeUrl}/gas-price`)
      if (!response.ok) {
        throw new Error('Failed to fetch gas price')
      }
      const data = await response.json()
      return data.price
    } catch (error) {
      console.error('Error fetching Kadena gas price:', error)
      throw error
    }
  }

  async estimateGas(transaction: any): Promise<string> {
    try {
      const response = await fetch(`${this.nodeUrl}/estimate-gas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      })
      if (!response.ok) {
        throw new Error('Failed to estimate gas')
      }
      const data = await response.json()
      return data.estimatedGas
    } catch (error) {
      console.error('Error estimating Kadena gas:', error)
      throw error
    }
  }
}

export const kadenaService = new KadenaService()
