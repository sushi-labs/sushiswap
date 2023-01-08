import React from 'react'

export const CheckMarkIcon = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg {...props} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
      <circle
        className="animate-[dash_1.5s_ease-in_forwards] text-blue"
        fill="none"
        strokeDasharray={1000}
        strokeDashoffset={0}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        cx="65.1"
        cy="65.1"
        r="60.1"
      />
      <polyline
        strokeDasharray={1000}
        strokeDashoffset={-100}
        className="animate-[dash-check_2s_0.5s_ease-in_forwards] text-blue"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="100.2,40.2 51.5,88.8 29.8,67.5 "
      />
    </svg>
  )
}
