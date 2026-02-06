import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LinkExternal,
  List,
} from '@sushiswap/ui'
import type React from 'react'
import { shortenAddress } from 'sushi'
import { type EvmChainId, getEvmChainById, shortenHash } from 'sushi/evm'
import type { Address } from 'viem'
import { CopyTokenAddress } from './copy-token-address'
import type { Erc20Deposit } from './team-balance-changes-table'

export function Erc20DepositDialog({
  children,
  erc20Deposit,
}: { children: React.ReactNode; erc20Deposit: Erc20Deposit }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!w-[400px]">
        <DialogHeader>
          <DialogTitle>ERC20 Deposit</DialogTitle>
          <DialogDescription>The details of your deposit</DialogDescription>
        </DialogHeader>
        <List>
          <List.Control>
            <List.KeyValue flex title="Date" className="whitespace-nowrap">
              {erc20Deposit.createdAt.toLocaleDateString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
              })}
            </List.KeyValue>
            <List.KeyValue flex title="Chain" className="whitespace-nowrap">
              {getEvmChainById(erc20Deposit.chainId as EvmChainId).name}
            </List.KeyValue>
            <List.KeyValue
              flex
              title="Transaction Hash"
              className="whitespace-nowrap"
            >
              <LinkExternal
                href={getEvmChainById(
                  erc20Deposit.chainId as EvmChainId,
                ).getTransactionUrl(erc20Deposit.txHash)}
              >
                {shortenHash(erc20Deposit.txHash)}
              </LinkExternal>
              <CopyTokenAddress address={erc20Deposit.txHash as Address} />
            </List.KeyValue>
            <List.KeyValue flex title="Token" className="whitespace-nowrap">
              {shortenAddress(erc20Deposit.token)}
              <CopyTokenAddress address={erc20Deposit.token as Address} />
            </List.KeyValue>
            <List.KeyValue flex title="Amount" className="whitespace-nowrap">
              <span className="text-green-500">
                +
                {erc20Deposit.amountUSD.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'USD',
                })}
              </span>
            </List.KeyValue>
          </List.Control>
        </List>
      </DialogContent>
    </Dialog>
  )
}
