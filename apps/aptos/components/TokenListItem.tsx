import React from 'react'
import { Token } from 'utils/tokenType'
type PropType = {
  token: Token
  handleChangeToken: (token: Token) => void
  selected: Token[]
}
export default function TokenListItem({ token, handleChangeToken, selected }: PropType) {
  return (
    <div className="py-0.5 h-[64px]">
      <div
        className={`group flex items-center w-full active:bg-black/[0.06] dark:active:bg-white/[0.06] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] h-full rounded-lg px-3 token-$TRDL cursor-pointer`}
        onClick={() => handleChangeToken(token)}
      >
        <div className="flex items-center justify-between flex-grow gap-2 rounded">
          <div className="flex flex-row items-center flex-grow gap-4">
            <img src={token?.logoURI} alt="" height={40} width={40} />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                {token?.symbol}
              </span>
              <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                {token?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
