import { t } from '@lingui/macro'
import { Trans, useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import NavLink from 'app/components/NavLink'
import Typography from 'app/components/Typography'
import features from 'app/config/features'
import { NETWORK_ICON, NETWORK_LABEL } from 'app/config/networks'
import { Feature } from 'app/enums'
import { SUPPORTED_NETWORKS } from 'app/modals/NetworkModal'
import { useActiveWeb3React } from 'app/services/web3'
// @ts-ignore TYPE NEEDS FIXING
import cookie from 'cookie-cutter'
import Image from 'next/image'
import React, { FC, Fragment } from 'react'

interface NetworkGuardProps {
  feature: Feature
  asModal?: boolean
}

const Component: FC<NetworkGuardProps> = ({ children, feature, asModal = true }) => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()

  const link = (
    <NavLink href="/swap">
      <a className="text-blue focus:outline-none">{i18n._(t`home page`)}</a>
    </NavLink>
  )

  const supportedNetworks = Object.entries(features).reduce<string[]>((acc, [k, v]) => {
    if (v.includes(feature)) {
      acc.push(k)
    }

    return acc
  }, [])

  const content = (
    <div className="flex justify-center lg:mt-[200px]">
      <div className="flex flex-col gap-5 justify-center p-4 mt-10 lg:mt-0">
        <Typography variant="h1" className="max-w-2xl text-white text-center" weight={700}>
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          {i18n._(t`This feature is not yet supported on the ${NETWORK_LABEL[chainId]} network`)}
        </Typography>
        <Typography className="text-center max-w-[248px] mx-auto">
          <Trans id="Either return to the {link}" values={{ link }} components={Fragment} />{' '}
          {i18n._(t`or change to an available network`)}
        </Typography>
        <Typography variant="sm" className="uppercase text-center tracking-[.2rem] mt-10 mb-5" weight={700}>
          {i18n._(t`Available Networks`)}
        </Typography>
        <div className="grid grid-cols-[repeat(2,_100px)] md:grid-cols-[repeat(4,_100px)] gap-y-10 justify-center">
          {supportedNetworks.map((key: string, idx: number) => (
            <button
              className="text-primary hover:text-white flex items-center flex-col gap-2 justify-center"
              key={idx}
              onClick={() => {
                // @ts-ignore TYPE NEEDS FIXING
                const params = SUPPORTED_NETWORKS[key]
                cookie.set('chainId', key)
                if (key === ChainId.ETHEREUM.toString()) {
                  library?.send('wallet_switchEthereumChain', [{ chainId: '0x1' }, account])
                } else if (key === ChainId.KOVAN.toString()) {
                  library?.send('wallet_switchEthereumChain', [{ chainId: '0x2A' }, account])
                } else {
                  library?.send('wallet_addEthereumChain', [params, account])
                }
              }}
            >
              <div className="w-[40px] h-[40px]">
                <Image
                  // @ts-ignore TYPE NEEDS FIXING
                  src={NETWORK_ICON[key]}
                  alt="Switch Network"
                  className="rounded-md filter drop-shadow-currencyLogo"
                  width="40px"
                  height="40px"
                />
              </div>
              <Typography variant="sm" weight={700} className="text-white">
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                {NETWORK_LABEL[key]}
              </Typography>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  if (!asModal) {
    // @ts-ignore TYPE NEEDS FIXING
    if (!!account && !features[chainId].includes(feature)) {
      return content
    }

    return <>{children}</>
  }

  return (
    <>
      <HeadlessUIModal.Controlled
        // @ts-ignore TYPE NEEDS FIXING
        isOpen={!!account && !features[chainId]?.includes(feature)}
        onDismiss={() => null}
        transparent={true}
      >
        {content}
      </HeadlessUIModal.Controlled>
      {children}
    </>
  )
}

type NetworkGuard = (feature: Feature, renderChildren?: boolean) => FC
const NetworkGuard: NetworkGuard = (feature: Feature, renderChildren = true) => {
  if (!renderChildren) {
    return ({ children }) => (
      <Component feature={feature} asModal={false}>
        {children}
      </Component>
    )
  }

  return ({ children }) => <Component feature={feature}>{children}</Component>
}

export default NetworkGuard
