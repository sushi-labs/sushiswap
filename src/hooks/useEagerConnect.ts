import { IS_IN_IFRAME } from 'app/constants'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useWeb3React } from 'web3-react-core'

import { injected } from '../config/wallets'

export function useEagerConnect() {
  const { activate, active } = useWeb3React()
  const [tried, setTried] = useState(false)

  // gnosisSafe.isSafeApp() races a timeout against postMessage, so it delays pageload if we are not in a safe app;
  // if we are not embedded in an iframe, it is not worth checking
  const [triedSafe, setTriedSafe] = useState(!IS_IN_IFRAME)

  // first, try connecting to a gnosis safe
  useEffect(() => {
    if (!triedSafe) {
      import('@gnosis.pm/safe-apps-web3-react')
        .then(({ SafeAppConnector }) => new SafeAppConnector())
        .then((gnosisSafe) =>
          gnosisSafe.isSafeApp().then((loadedInSafe) => {
            if (loadedInSafe) {
              activate(gnosisSafe, undefined, true).catch(() => {
                setTriedSafe(true)
              })
            } else {
              setTriedSafe(true)
            }
          })
        )
    }
  }, [activate, setTriedSafe, triedSafe])

  // then, if that fails, try connecting to an injected connector
  useEffect(() => {
    if (!active && triedSafe) {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          if (isMobile && window.ethereum) {
            activate(injected, undefined, true).catch(() => {
              setTried(true)
            })
          } else {
            setTried(true)
          }
        }
      })
    }
  }, [activate, active, triedSafe])

  // wait until we get confirmation of a connection to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

export default useEagerConnect
