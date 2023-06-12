import Link from 'next/link'
import React from 'react'

export const ThunderCoreBanner = () => {
  return (
    <Link href="https://www.sushi.com/blog/trading-competition-details" target="_blank">
      <div className="rounded-[10px] py-4 px-6 bg-gradient-to-r from-[#2d68af] to-[#479dbb] space-y-3 mt-4 text-white dark:text-white">
        <div className="space-y-1">
          <div className="-skew-x-[8deg] text-sm font-bold">Join the ThunderCore Trading Competition</div>
          <div className="-skew-x-[8deg] text-lg font-black">Grab a Share of $5,500 in Token Airdrop!</div>
        </div>
        <div className="font-medium text-[9px] ">Campaign Period: 6/13 08:00 (UTC) — 6/21 08:00 (UTC)</div>
      </div>
    </Link>
  )
}
