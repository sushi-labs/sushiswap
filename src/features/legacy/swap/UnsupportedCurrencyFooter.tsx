import { ExternalLinkIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import ExternalLink from 'app/components/ExternalLink'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { shortenAddress } from 'app/functions'
import { getExplorerLink } from 'app/functions/explorer'
import { useUnsupportedTokens } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useState } from 'react'

interface UnsupportedCurrencyFooter {
  currencies: (Currency | undefined)[]
}

const UnsupportedCurrencyFooter: FC<UnsupportedCurrencyFooter> = ({ currencies }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const [showDetails, setShowDetails] = useState(false)
  const unsupportedTokens = useUnsupportedTokens()

  const tokens =
    chainId && currencies
      ? currencies.map((currency) => {
          return currency?.wrapped
        })
      : []

  return (
    <>
      <HeadlessUiModal.Controlled isOpen={showDetails} onDismiss={() => setShowDetails(false)} maxWidth="sm">
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header header={i18n._(t`Unsupported Asset`)} onClose={() => setShowDetails(false)} />
          <HeadlessUiModal.BorderedContent className="flex flex-col gap-4">
            {tokens.map((token) => {
              return (
                token &&
                unsupportedTokens &&
                Object.keys(unsupportedTokens).includes(token.address) && (
                  <div key={token.address?.concat('not-supported')}>
                    <div className="flex items-center gap-3">
                      <CurrencyLogo currency={token} size={32} />
                      <div className="flex flex-col">
                        <Typography variant="lg" weight={700}>
                          {token.symbol}
                        </Typography>
                        {chainId && (
                          <ExternalLink href={getExplorerLink(chainId, token.address, 'address')}>
                            <div className="flex gap-2">
                              <Typography variant="xs" weight={700} className="text-blue">
                                {shortenAddress(token.address)}
                              </Typography>
                              <ExternalLinkIcon width={12} className="text-blue" />
                            </div>
                          </ExternalLink>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )
            })}
            <Typography variant="sm" weight={700}>
              {i18n._(t`Some assets are not available through this interface because they may not work well with our smart
            contract or we are unable to allow trading for legal reasons.`)}
            </Typography>
          </HeadlessUiModal.BorderedContent>
        </div>
      </HeadlessUiModal.Controlled>
      <Typography
        role="button"
        onClick={() => setShowDetails(true)}
        variant="xs"
        weight={700}
        className="text-blue/80 hover:text-blue text-center"
      >
        {i18n._(t`What does this mean?`)}
      </Typography>
    </>
  )
}

export default UnsupportedCurrencyFooter
