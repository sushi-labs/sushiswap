'use client'

import { Button, classNames } from '@sushiswap/ui'
import React, { FC, useState } from 'react'
import { ChainId } from 'sushi/chain'

import { VaultV1 } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import { APPROVE_TAG_STEER, NativeAddress } from 'src/lib/constants'
import { useZap } from 'src/lib/hooks'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { defaultQuoteCurrency, isWNativeSupported } from 'sushi/config'
import { Type, tryParseAmount } from 'sushi/currency'
import { useAccount, useSendTransaction } from 'wagmi'

interface SteerPositionAddProps {
  vault: VaultV1
}

export const SteerPositionZap: FC<SteerPositionAddProps> = ({ vault }) => {
  const { address } = useAccount()
  const isMounted = useIsMounted()

  const [token, setToken] = useState<Type>(defaultQuoteCurrency[vault.chainId])
  const [inputAmount, setInputAmount] = useState<string>('')

  const parsedInputAmount = tryParseAmount(inputAmount, token)

  const { data: zapResponse } = useZap({
    chainId: vault.chainId,
    fromAddress: address,
    tokenIn: [token.isNative ? NativeAddress : token.address],
    amountIn: [parsedInputAmount?.quotient?.toString() ?? '0'],
    tokenOut: [vault.address],
  })

  console.log('zapResponse', zapResponse)

  const { sendTransactionAsync } = useSendTransaction()

  return (
    <CheckerProvider>
      <div
        className={classNames(
          // isLoading ? 'opacity-40 pointer-events-none' : '',
          'flex flex-col gap-4',
        )}
      >
        <Web3Input.Currency
          id="swap-from"
          type="INPUT"
          className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
          chainId={vault.chainId}
          onSelect={setToken}
          value={inputAmount}
          onChange={setInputAmount}
          currency={token}
          // loading={isLoading}
          // currencyLoading={isLoading}
          allowNative={isWNativeSupported(vault.chainId)}
        />

        {isMounted ? (
          <Checker.Guard
            guardWhen={vault.isDeprecated}
            guardText="Vault is deprecated"
          >
            <Checker.Connect testId="connect" fullWidth>
              <Checker.Network
                testId="switch-network"
                fullWidth
                chainId={vault.chainId as ChainId}
              >
                <Checker.Amounts
                  testId="check-amounts"
                  fullWidth
                  chainId={vault.chainId as ChainId}
                  amount={parsedInputAmount}
                >
                  <Checker.ApproveERC20
                    fullWidth
                    id="approve-erc20-0"
                    amount={parsedInputAmount}
                    contract={zapResponse?.tx.to}
                  >
                    <Checker.Success tag={APPROVE_TAG_STEER}>
                      <Button
                        fullWidth
                        size="xl"
                        testId="add-steer-liquidity-preview"
                        disabled={!zapResponse?.tx}
                        onClick={() =>
                          zapResponse?.tx &&
                          sendTransactionAsync({
                            ...zapResponse.tx,
                            value: BigInt(zapResponse.tx.value),
                          })
                        }
                      >
                        Zap
                      </Button>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connect>
          </Checker.Guard>
        ) : (
          <Button fullWidth size="xl">
            Connect
          </Button>
        )}
      </div>
    </CheckerProvider>
  )
}
