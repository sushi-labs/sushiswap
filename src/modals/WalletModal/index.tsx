import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import AccountDetails from 'app/components/AccountDetails'
import Button from 'app/components/Button'
import ExternalLink from 'app/components/ExternalLink'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { injected, SUPPORTED_WALLETS } from 'app/config/wallets'
import { OVERLAY_READY } from 'app/entities/connectors/FortmaticConnector'
import { switchToNetwork } from 'app/functions/network'
import usePrevious from 'app/hooks/usePrevious'
import { useModalOpen, useWalletModalToggle } from 'app/state/application/hooks'
import { ApplicationModal } from 'app/state/application/reducer'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { UnsupportedChainIdError, useWeb3React } from 'web3-react-core'
import { WalletConnectConnector } from 'web3-react-walletconnect-connector'

import Option from './Option'
import PendingView from './PendingView'

enum WALLET_VIEWS {
  OPTIONS,
  ACCOUNT,
  PENDING,
}

interface WalletModal {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}

const WalletModal: FC<WalletModal> = ({ pendingTransactions, confirmedTransactions, ENSName }) => {
  const { active, account, connector, activate, error, deactivate } = useWeb3React()
  const { i18n } = useLingui()
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const [pendingWallet, setPendingWallet] = useState<{ connector?: AbstractConnector; id: string }>()
  const [pendingError, setPendingError] = useState<boolean>()
  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()
  const previousAccount = usePrevious(account)
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)

  const router = useRouter()
  const queryChainId = Number(router.query.chainId)
  const cookieChainId = Cookies.get('chain-id')
  const defaultChainId = cookieChainId ? Number(cookieChainId) : 1
  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) toggleWalletModal()
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  useEffect(() => {
    if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  // close wallet modal if Fortmatic modal is active
  useEffect(() => {
    if (connector?.constructor?.name === 'FormaticConnector') {
      connector.on(OVERLAY_READY, () => {
        toggleWalletModal()
      })
    }
  }, [toggleWalletModal, connector])

  const handleBack = useCallback(() => {
    setPendingError(undefined)
    setWalletView(WALLET_VIEWS.ACCOUNT)
  }, [])

  const handleDeactivate = useCallback(() => {
    deactivate()
    setWalletView(WALLET_VIEWS.ACCOUNT)
  }, [deactivate])

  const tryActivation = useCallback(
    async (connector: (() => Promise<AbstractConnector>) | AbstractConnector | undefined, id: string) => {
      let name = ''
      let conn = typeof connector === 'function' ? await connector() : connector

      Object.keys(SUPPORTED_WALLETS).map((key) => {
        if (connector === SUPPORTED_WALLETS[key].connector) {
          return (name = SUPPORTED_WALLETS[key].name)
        }
      })

      console.debug('Attempting activation of', name)

      // log selected wallet

      gtag('event', 'Change Wallet', {
        event_category: 'Wallet',
        event_label: name,
      })

      setPendingWallet({ connector: conn, id }) // set wallet for pending view
      setWalletView(WALLET_VIEWS.PENDING)

      // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
      if (conn instanceof WalletConnectConnector && conn.walletConnectProvider?.wc?.uri) {
        console.debug('Wallet connector already tried to connect, reset')
        conn.walletConnectProvider = undefined
      }

      if (conn) {
        console.debug('About to activate')
        activate(
          conn,
          (error) => {
            console.debug('Error activating connector ', name, error)
          },
          true
        )
          .then(async () => {
            console.debug('Activated, get provider')
            if (conn instanceof WalletConnectConnector) {
              const provider = await conn?.getProvider()
              const chainId = await conn?.getChainId()
              if (provider && chainId && defaultChainId && (chainId !== queryChainId || chainId !== defaultChainId)) {
                console.debug('Provider is wallet connect, attempt network switch')
                switchToNetwork({
                  provider,
                  chainId: defaultChainId !== 1 || !queryChainId ? defaultChainId : queryChainId,
                })
              }
            }
          })

          .catch((error) => {
            console.debug('Error activating', error)
            if (error instanceof UnsupportedChainIdError) {
              // @ts-ignore TYPE NEEDS FIXING
              activate(conn) // a little janky...can't use setError because the connector isn't set
            } else {
              setPendingError(true)
            }
          })
      }
    },
    [activate, defaultChainId, queryChainId]
  )

  // get wallets user can switch too, depending on device/browser
  const options = useMemo(() => {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]

      // check for mobile options
      if (isMobile) {
        // disable portis on mobile for now
        if (option.name === 'Portis') {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => tryActivation(option.connector, key)}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={'https://app.sushi.com' + '/images/wallets/' + option.iconName}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon="https://app.sushi.com/images/wallets/metamask.png"
              />
            )
          } else {
            return null // dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector, key)
            }}
            key={key}
            active={option.connector === connector}
            link={option.href}
            header={option.name}
            subheader={null} // use option.descriptio to bring back multi-line
            icon={'https://app.sushi.com' + '/images/wallets/' + option.iconName}
          />
        )
      )
    })
  }, [connector, tryActivation])

  return (
    <HeadlessUiModal.Controlled isOpen={walletModalOpen} onDismiss={toggleWalletModal} maxWidth="md">
      {error ? (
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header
            onClose={toggleWalletModal}
            header={error instanceof UnsupportedChainIdError ? i18n._(t`Wrong Network`) : i18n._(t`Error connecting`)}
          />
          <HeadlessUiModal.BorderedContent>
            <Typography variant="xs" weight={700}>
              {error instanceof UnsupportedChainIdError
                ? i18n._(t`Please connect to the appropriate Ethereum network.`)
                : i18n._(t`Error connecting. Try refreshing the page.`)}
            </Typography>
          </HeadlessUiModal.BorderedContent>
          <Button color="red" onClick={handleDeactivate}>
            {i18n._(t`Disconnect`)}
          </Button>
        </div>
      ) : account && walletView === WALLET_VIEWS.ACCOUNT ? (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      ) : (
        <div className="flex flex-col w-full space-y-4">
          <HeadlessUiModal.Header
            header={i18n._(t`Select a wallet`)}
            onClose={toggleWalletModal}
            {...(walletView !== WALLET_VIEWS.ACCOUNT && { onBack: handleBack })}
          />
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              // @ts-ignore TYPE NEEDS FIXING
              id={pendingWallet.id}
              // @ts-ignore TYPE NEEDS FIXING
              connector={pendingWallet.connector}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">{options}</div>
          )}
          <div className="flex justify-center">
            <Typography variant="xs" className="text-secondary" component="span">
              {i18n._(t`New to Ethereum?`)}{' '}
              <Typography variant="xs" className="text-blue" component="span">
                <ExternalLink href="https://ethereum.org/wallets/" color="blue">
                  {i18n._(t`Learn more about wallets`)}
                </ExternalLink>
              </Typography>
            </Typography>
          </div>
        </div>
      )}
    </HeadlessUiModal.Controlled>
  )
}

export default WalletModal
