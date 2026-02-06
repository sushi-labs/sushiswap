import { useId } from 'react'
import type { NakedNetworkIconComponent } from '../../../types'

export const XLayerNaked: NakedNetworkIconComponent = ({
  circle,
  ...props
}) => {
  const id = useId()

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="40" height="40" rx={circle ? '20' : undefined} fill="#000" />
      <g clipPath={`url(#${id}_a)`}>
        <mask
          id={`${id}_b`}
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="29"
          y="9"
          width="5"
          height="8"
        >
          <path d="M29.328 9.717h3.899v6.89h-3.899z" fill="#000" />
        </mask>
        <g mask={`url(#${id}_b)`}>
          <path
            d="M32.763 9.717h-5.972a.46.46 0 0 0-.459.46v5.971c0 .254.206.46.46.46h5.971a.46.46 0 0 0 .46-.46v-5.972a.46.46 0 0 0-.46-.46"
            fill="#fff"
            fillOpacity=".5"
          />
        </g>
        <mask
          id={`${id}_c`}
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="29"
          y="23"
          width="5"
          height="8"
        >
          <path d="M29.328 23.503h3.899v6.89h-3.899z" fill="#000" />
        </mask>
        <g mask={`url(#${id}_c)`}>
          <path
            d="M32.765 23.504h-5.972a.46.46 0 0 0-.459.46v5.971c0 .254.206.46.46.46h5.971a.46.46 0 0 0 .46-.46v-5.972a.46.46 0 0 0-.46-.46"
            fill="#fff"
            fillOpacity=".5"
          />
        </g>
        <path
          d="M19.992 16.627H14.05a.456.456 0 0 0-.457.454v5.901c0 .25.204.454.457.454h5.943a.456.456 0 0 0 .458-.454v-5.901a.456.456 0 0 0-.458-.454m-6.88-6.908H7.14a.46.46 0 0 0-.46.46v5.971c0 .254.206.46.46.46h5.972a.46.46 0 0 0 .46-.46v-5.972a.46.46 0 0 0-.46-.46m13.78.001H20.92a.46.46 0 0 0-.46.46v5.971c0 .254.207.46.46.46h5.972a.46.46 0 0 0 .46-.46v-5.972a.46.46 0 0 0-.46-.46M13.113 23.495H7.14a.46.46 0 0 0-.46.459v5.972c0 .254.206.46.46.46h5.972a.46.46 0 0 0 .46-.46v-5.972a.46.46 0 0 0-.46-.46m13.78.001H20.92a.46.46 0 0 0-.46.459v5.972c0 .254.207.46.46.46h5.972a.46.46 0 0 0 .46-.46v-5.972a.46.46 0 0 0-.46-.46"
          fill="#fff"
        />
      </g>
      <defs>
        <clipPath id={`${id}_a`}>
          <path fill="#fff" d="M6.5 9.453h27v21.094h-27z" />
        </clipPath>
      </defs>
    </svg>
  )
}
