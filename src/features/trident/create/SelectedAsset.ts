import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { tryParseAmount } from 'app/functions'
import { v4 } from 'uuid'

export enum SpendSource {
  WALLET,
  BENTO_BOX,
}

interface SelectedAssetProps {
  id?: string
  currency?: Currency
  amount?: string
  spendFromSource?: SpendSource
  error?: string
  amountInteractedWith?: boolean
}

export class SelectedAsset {
  readonly id: string
  readonly currency?: Currency
  readonly amount?: string
  readonly amountInteractedWith: boolean
  readonly spendFromSource: SpendSource
  readonly error?: string

  constructor({
    id = v4(),
    currency,
    amount = '',
    spendFromSource = SpendSource.WALLET,
    error,
    amountInteractedWith = false,
  }: SelectedAssetProps) {
    this.id = id
    this.currency = currency
    this.amount = amount
    this.spendFromSource = spendFromSource
    this.error = error
    this.amountInteractedWith = amountInteractedWith
  }

  get parsedAmount(): CurrencyAmount<Currency> | undefined {
    return tryParseAmount(this.amount, this.currency)
  }

  oppositeToggle(): SpendSource {
    return this.spendFromSource === SpendSource.WALLET ? SpendSource.BENTO_BOX : SpendSource.WALLET
  }

  serialize(): string {
    return `${this.id}-${this.currency?.isNative}-${this.currency?.wrapped.address}-${this.amount}-${this.spendFromSource}-${this.error}`
  }
}
