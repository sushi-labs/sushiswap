import * as React from 'react'

import classNames from 'classnames'
import type { NakedNetworkIconComponent } from '../../../types'

export const TelosNaked: NakedNetworkIconComponent = (props) => (
  <svg
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={classNames(props.className, 'text-[#5613FF]')}
  >
    {props.circle}
    <path
      clipRule="evenodd"
      d="M91.762 26.821a1.336 1.336 0 0 0-1.153-1.813L75.53 24.003a1.328 1.328 0 0 0-1.18.571l-3.995 5.784c-.25.362-.662.577-1.1.575l-26.54-.158a5.303 5.303 0 0 0-3.541 1.328L31.81 38.6a5.364 5.364 0 0 0-1.502 5.813l3.507 9.89a.161.161 0 0 1-.023.151 16.638 16.638 0 0 0-3.29 9.087l-.06 1.12a61.771 61.771 0 0 0 2.423 20.707l4.635 15.76a3.98 3.98 0 0 0 4.756 2.761c4.454-1.075 12.103-2.922 18.128-4.38a47.742 47.742 0 0 0 14.902-6.455l2.857-1.869a16.564 16.564 0 0 0 6.184-7.408.16.16 0 0 1 .119-.095l10.277-1.893a5.332 5.332 0 0 0 4.258-4.213l1.915-9.657a5.366 5.366 0 0 0-.626-3.746l-12.467-21.41a5.37 5.37 0 0 1-.374-4.62l4.332-11.32Z"
      stroke="currentColor"
      strokeWidth={5.5}
    />
  </svg>
)
