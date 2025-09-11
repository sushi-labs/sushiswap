import type { NakedNetworkIconComponent } from '../../../types'

export const EthereumNaked: NakedNetworkIconComponent = (props) => (
  <svg
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-700 dark:text-white"
    {...props}
  >
    {props.circle}
    <path
      d="M63.993 24v29.573l24.99 11.169L63.993 24Z"
      fill="currentColor"
      fillOpacity={0.602}
    />
    <path d="M63.993 24 39 64.742l24.993-11.17V24Z" fill="currentColor" />
    <path
      d="M63.993 83.906V104L89 69.396l-25.007 14.51Z"
      fill="currentColor"
      fillOpacity={0.602}
    />
    <path d="M63.993 104V83.902L39 69.396 63.993 104Z" fill="currentColor" />
    <path
      d="m63.993 79.255 24.99-14.513-24.99-11.162v25.675Z"
      fill="currentColor"
      fillOpacity={0.2}
    />
    <path
      d="m39 64.742 24.993 14.513V53.58L39 64.742Z"
      fill="currentColor"
      fillOpacity={0.602}
    />
  </svg>
)
