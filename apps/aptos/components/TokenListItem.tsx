import React from 'react'
type PropType = {
  token: object
  handleChangeToken: (token: object) => void
}
export default function TokenListItem({ token, handleChangeToken }: PropType) {
  return (
    <div className="py-0.5 h-[64px]">
      <div
        className="flex items-center w-full h-full rounded-lg px-3 cursor-pointer hover:bg-white/[0.04]"
        onClick={() => handleChangeToken(token)}
      >
        <div className="flex items-center justify-between flex-grow gap-2 rounded">
          <div className="flex flex-row items-center flex-grow gap-4">
            <img src={token.logoURI} alt="" height={40} width={40} />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                {token.symbol}
              </span>
              <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                {token.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
