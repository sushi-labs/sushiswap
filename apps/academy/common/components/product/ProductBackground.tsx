import { FC } from 'react'

interface ProductBackground {
  color: string
}

export const ProductBackground: FC<ProductBackground> = ({ color }) => {
  return (
    <>
      <div
        className="absolute w-[120vw] md:w-full aspect-[1/1] opacity-20 -right-[35%] -top-[50vw] -z-[1]"
        style={{
          backgroundImage: `radial-gradient(50% 50% at 55% 45%, ${color} 0%, #0f172a 100%)`,
        }}
      />
      <div
        className="bg-orb absolute w-[120vw] md:w-full aspect-[1/1] opacity-10 -left-[40%] bottom-0 -z-[1]"
        style={{
          backgroundImage: `radial-gradient(50% 50% at 55% 45%, ${color} 0%, #0f172a 100%)`,
        }}
      />
    </>
  )
}
