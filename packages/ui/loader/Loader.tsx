import { FC } from 'react'

import { LoaderProps } from './types'

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export const Loader: FC<LoaderProps> = ({ size = 16 }) => {
  return (
    <div className="flex items-center text-slate-200 transition-[color] duration-[250ms] ease-in">
      <div
        style={{ width: size - 4, height: size - 4, minHeight: size - 4, minWidth: size - 4 }}
        className="rounded-full relative bg-black bg-opacity-[0.32] transition-[background-color] duration-[250ms] ease-in"
      >
        <div
          style={{ width: size + 3, height: size + 3 }}
          className="inset-0 animate-rotate left-[-4px] top-[-3px] border-t border-t-transparent border-r border-r-transparent border-b border-l-2 border-l-slate-200 bg-transparent rounded-full relative transition-[border-color] duration-[250ms] ease"
        />
      </div>
    </div>
  )
}
