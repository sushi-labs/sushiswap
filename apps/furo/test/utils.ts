import { JsonRpcProvider } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { expect, Page } from '@playwright/test'
// import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { ChainId, chainName } from '@sushiswap/chain'
import { Type, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { Contract, Wallet } from 'ethers'



// export const BENTOBOX_DEPOSIT_ABI = [
//   {
//     inputs: [
//       { internalType: 'contract IERC20', name: 'token_', type: 'address' },
//       { internalType: 'address', name: 'from', type: 'address' },
//       { internalType: 'address', name: 'to', type: 'address' },
//       { internalType: 'uint256', name: 'amount', type: 'uint256' },
//       { internalType: 'uint256', name: 'share', type: 'uint256' },
//     ],
//     name: 'deposit',
//     outputs: [
//       { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
//       { internalType: 'uint256', name: 'shareOut', type: 'uint256' },
//     ],
//     stateMutability: 'payable',
//     type: 'function',
//   },
// ]

export async function switchNetwork(page: Page, chainId: number) {
    await page.getByRole('button', { name: 'Ethereum' }).click()
    await page.locator(`[testdata-id=network-selector-${chainId}]`).click()
  }
  
export function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  
export interface Token {
  address: string
  symbol: string
}



export enum GradedVestingFrequency {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export interface VestingArgs {
  token: Type
  startInMonths: number
  recipient: string
  graded: {
    stepAmount: string
    steps: number
    frequency: GradedVestingFrequency
  }
  cliff?: {
    amount: string
    cliffEndsInMonths: number
  }
}

export async function selectDate(selector: string, months: number, page: Page) {
  await page.locator(selector).click()
  for (let i = 0; i < months; i++) {
    await page.locator(`[aria-label="Next Month"]`).click()
  }

  await page
    .locator(
      'div.react-datepicker__day.react-datepicker__day--001, div.react-datepicker__day.react-datepicker__day--001.react-datepicker__day--weekend'
    )
    .last()
    .click()

  await page.locator('li.react-datepicker__time-list-item').first().click()
}

// export async function depositToBento(amount: string, chainId: ChainId) {
//   const amountToSend = parseUnits(amount, 'ether').add(parseUnits('100.0', 'gwei')) //add 100 gwei so we actually get the amount asked as bentobox round down
//   const provider = new JsonRpcProvider('http://127.0.0.1:8545', chainId)
//   const signer = new Wallet(accounts[0].privateKey, provider)
//   const bentoContract = new Contract(BENTOBOX_ADDRESS[chainId] as string, BENTOBOX_DEPOSIT_ABI, signer)
//   await bentoContract.deposit(
//     '0x0000000000000000000000000000000000000000',
//     signer.address,
//     signer.address,
//     amountToSend,
//     0,
//     { value: amountToSend }
//   )
// }

// const WRAPPED_DEPOSIT_ABI = [
//   {
//     constant: false,
//     inputs: [],
//     name: 'deposit',
//     outputs: [],
//     payable: true,
//     stateMutability: 'payable',
//     type: 'function',
//   },
// ]

// export async function depositToWrapped(amount: string, chainId: ChainId) {
//   const amountToWrap = parseUnits(amount, 'ether')
//   const provider = new JsonRpcProvider('http://127.0.0.1:8545', chainId)
//   const signer = new Wallet(accounts[0].privateKey, provider)
//   const wrappedContract = new Contract(WNATIVE_ADDRESS[chainId], WRAPPED_DEPOSIT_ABI, signer)
//   await wrappedContract.deposit({ value: amountToWrap })
// }