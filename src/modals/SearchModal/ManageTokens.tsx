import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import ExternalLink from 'app/components/ExternalLink'
import { ExternalLinkIcon } from 'app/components/ExternalLinkIcon'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { classNames, getExplorerLink, isAddress } from 'app/functions'
import { useToken } from 'app/hooks/Tokens'
import { useCurrencyModalContext } from 'app/modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useRemoveUserAddedToken, useUserAddedTokens } from 'app/state/user/hooks'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { Trash } from 'react-feather'

import CurrencyModalView from './CurrencyModalView'
import ImportRow from './ImportRow'

const ManageTokens: FC = () => {
  const { i18n } = useLingui()
  const { setView, setImportToken } = useCurrencyModalContext()
  const { chainId } = useActiveWeb3React()
  const [searchQuery, setSearchQuery] = useState<string>('')

  // manage focus on modal show
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checkSum = isAddress(input)
    setSearchQuery(checkSum || input)
  }, [])

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  // all tokens for local list
  const userAddedTokens = useUserAddedTokens()
  const removeToken = useRemoveUserAddedToken()

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address)
      })
    }
  }, [removeToken, userAddedTokens, chainId])

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <div className="flex justify-between px-4 py-3 hover:bg-dark-800/40" key={token.address}>
          <div className="flex items-center gap-3">
            <CurrencyLogo currency={token} size={32} className="!rounded-full overflow-hidden" />
            <ExternalLink href={getExplorerLink(chainId, token.address, 'address')}>
              <Typography weight={700}>{token.symbol}</Typography>
            </ExternalLink>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center w-4 h-4 cursor-pointer hover:text-white"
              onClick={() => removeToken(chainId, token.address)}
            >
              <Trash width={20} />
            </div>
            <ExternalLinkIcon
              className="flex items-center cursor-pointer min-w-4 min-h-4 hover:text-white"
              href={getExplorerLink(chainId, token.address, 'address')}
            />
          </div>
        </div>
      ))
    )
  }, [userAddedTokens, chainId, removeToken])

  const handleImport = useCallback(() => {
    if (searchToken) {
      setImportToken(searchToken)
    }

    setView(CurrencyModalView.importToken)
  }, [searchToken, setImportToken, setView])

  return (
    <>
      <input
        id="token-search-input"
        type="text"
        placeholder="0x..."
        className={classNames(
          searchQuery !== '' && !isAddressSearch ? 'border-red' : 'border-dark-800 focus:border-blue',
          'w-full bg-[rgba(0,0,0,0.2)] border rounded placeholder-secondary font-bold text-base p-4 appearance-none'
        )}
        value={searchQuery}
        autoComplete="off"
        onChange={handleInput}
        autoCorrect="off"
      />
      {searchToken && <ImportRow token={searchToken} onClick={handleImport} />}
      <HeadlessUiModal.BorderedContent className="flex flex-col bg-[rgba(0,0,0,0.2)] !p-0">
        <div className="flex items-center justify-between p-4">
          <Typography variant="xs" weight={700} className="text-secondary">
            {userAddedTokens?.length} Custom {userAddedTokens.length === 1 ? 'Token' : 'Tokens'}
          </Typography>
          <Button variant="outlined" color="blue" size="xs" onClick={handleRemoveAll}>
            {i18n._(t`Clear all`)}
          </Button>
        </div>
        <div className="divide-y divide-dark-800">{tokenList}</div>
      </HeadlessUiModal.BorderedContent>
      <div className="flex flex-grow h-full" />
      <Typography variant="xs" weight={700} className="text-center text-secondary">
        {i18n._(t`Custom tokens are stored locally in your browser`)}
      </Typography>
    </>
  )
}

export default ManageTokens
