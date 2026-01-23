'use client'
import Image from 'next/image'

export const Hero = () => {
  return (
    <div className="flex relative">
      <div className="flex flex-col gap-2 z-[1]">
        <span className="gap-3 flex flex-wrap text-4xl sm:text-5xl font-bold max-w-md">
          <span>Earn by</span>
          <span className="text-[#CE2AF6]">Referring</span>
          <span>Traders to Sushi!</span>
        </span>
        <span className="text-xl max-w-[720px] font-medium text-muted-foreground">
          Refer frens and earn points on Sushi
        </span>
      </div>
      <Image
        src="/referral-hero.png"
        alt="Referral Hero"
        width={750}
        height={400}
        unoptimized
        priority
        className="absolute right-0 top-0 md:-top-1/2 z-[-1] opacity-30 md:opacity-100"
      />
    </div>
  )
}
