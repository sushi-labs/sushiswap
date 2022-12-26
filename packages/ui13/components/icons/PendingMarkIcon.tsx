import React from 'react'

export const PendingMarkIcon = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg {...props} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
      <circle
        className="animate-[dash_1.5s_ease-in_infinite] text-blue"
        fill="none"
        strokeDasharray={1000}
        strokeDashoffset={0}
        stroke="currentColor"
        strokeWidth="6"
        strokeMiterlimit="10"
        strokeLinecap="round"
        cx="65.1"
        cy="65.1"
        r="62.1"
      />
    </svg>
  )
}
