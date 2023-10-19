import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Currency } from '@sushiswap/ui/components/currency'
import { Loader } from '@sushiswap/ui/components/loader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@sushiswap/ui/components/select'
import stringify from 'fast-json-stable-stringify'
import Image from 'next/legacy/image'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { Token as TokenEntity } from 'sushi/currency'
import useSWR from 'swr'

import { Token, TokenLogo, getTokenLogos } from '../lib'

interface TokenAdder {
  token: Token
  hasIcon: boolean
}

export const TokenAdder: FC<TokenAdder> = ({ token, hasIcon }) => {
  const [selectedLogoURI, setSelectedLogoURI] = useState<string>()
  const [addState, setAddState] = useState<'ready' | 'submitting' | 'error'>(
    'ready',
  )

  const { data: tokenLogos } = useSWR<TokenLogo[]>('tokenLogos', () =>
    getTokenLogos(),
  )

  const _token = useMemo(
    () =>
      new TokenEntity({
        address: token.id.split(':')[1],
        decimals: token.decimals,
        chainId: token.chainId,
        symbol: token.symbol,
      }),
    [token.chainId, token.decimals, token.id, token.symbol],
  )

  const submitToken = useCallback(
    async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
      setAddState('submitting')
      try {
        if (!selectedLogoURI) throw new Error('No logo URI')
        const logo = await fetch(selectedLogoURI)
          .then((response) => response.blob())
          .then((blob) => {
            return new Promise((resolve) => {
              const reader = new FileReader()
              reader.onload = function () {
                resolve(this.result)
              } // <--- `this.result` contains a base64 data URI
              reader.readAsDataURL(blob)
            })
          })

        // ! Won't reflect dev changes
        const result = await fetch(
          'https://www.sushi.com/api/partner/submitToken',
          {
            headers: {
              Accept: '*/*',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: stringify({
              tokenAddress: token.id.split(':')[1],
              tokenData: {
                name: token.name,
                symbol: token.symbol,
                decimals: token.decimals,
              },
              tokenIcon: logo,
              chainId: token.chainId,
              listType: 'default-token-list',
            }),
          },
        )

        const { listPr } = await result.json()
        if (listPr) {
          setAddState('ready')
          window.open(listPr, '_blank')
        } else {
          throw new Error('An unexpected error has occured.')
        }
      } catch (e) {
        console.error(e)
        setAddState('error')
      }
    },
    [selectedLogoURI, token],
  )

  return (
    <Select value={selectedLogoURI} onValueChange={setSelectedLogoURI}>
      <SelectTrigger placeholder="Select logo">
        {selectedLogoURI ? (
          <>
            <Image
              src={selectedLogoURI}
              height={24}
              width={24}
              alt="img"
              className="rounded-full"
            />
            <div
              onClick={(e) => submitToken(e)}
              className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-700"
            >
              {addState === 'ready' && (
                <CheckIcon className="text-white" width={24} height={24} />
              )}
              {addState === 'submitting' && <Loader width={24} height={24} />}
              {addState === 'error' && (
                <XMarkIcon className="text-red" width={24} height={24} />
              )}
            </div>
          </>
        ) : hasIcon ? (
          <Currency.Icon disableLink currency={_token} width={24} height={24} />
        ) : (
          <svg
            width={24}
            height={24}
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="30"
              height="30"
              rx="15"
              fill="url(#paint0_linear_13084_19043)"
            />
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
      </SelectTrigger>
      <SelectContent>
        {tokenLogos?.map((logo) => (
          <SelectItem key={logo.name} value={logo.url}>
            {logo.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
