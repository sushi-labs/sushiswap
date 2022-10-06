import { Token as TokenEntity } from '@sushiswap/currency'
import { Currency, Menu, Typography } from '@sushiswap/ui'
import { Token, TokenLogo } from 'lib'
import Image from 'next/image'
import { FC, useMemo, useState } from 'react'
import useSWR from 'swr'

interface TokenAdder {
  token: Token
  hasIcon: boolean
}

export const TokenAdder: FC<TokenAdder> = ({ token, hasIcon }) => {
  const [selectedLogoURI, setSelectedLogoURI] = useState<string>()

  const { data: tokenLogos } = useSWR<TokenLogo[]>(!hasIcon ? 'tokenLogos' : null, () =>
    fetch('/internal/api/tokens/tokenLogos').then((data) => data.json())
  )

  const _token = useMemo(
    () =>
      new TokenEntity({
        address: token.id.split(':')[1],
        decimals: token.decimals,
        chainId: token.chainId,
        symbol: token.symbol,
      }),
    [token.chainId, token.decimals, token.id, token.symbol]
  )

  if (hasIcon) return <Currency.Icon currency={_token} width={24} height={24} />

  return (
    <Menu
      button={
        <Menu.Button variant="empty" className="px-0">
          {selectedLogoURI ? (
            <Image src={selectedLogoURI} height={24} width={24} alt="img" className="rounded-full" />
          ) : (
            <svg width={24} height={24} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="30" rx="15" fill="url(#paint0_linear_13084_19043)" />
              <defs>
                <linearGradient
                  id="paint0_linear_13084_19043"
                  x1="-2.30769"
                  y1="4.25715e-07"
                  x2="35.0955"
                  y2="9.13387"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0993EC" />
                  <stop offset="1" stopColor="#F338C3" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </Menu.Button>
      }
    >
      <Menu.Items className="scroll max-h-[200px]">
        {tokenLogos?.map((logo) => (
          <Menu.Item
            key={logo.name}
            value={logo.name}
            onClick={() => setSelectedLogoURI(logo.url)}
            className="flex items-center"
          >
            <Typography variant="sm">{logo.name}</Typography>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
}
