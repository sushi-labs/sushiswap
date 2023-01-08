import React from 'react'

export const FailedMarkIcon = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg {...props} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
      <circle
        className="animate-[dash_1.5s_ease-in_forwards] text-red"
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
      <line
        className="animate-[dash_1.5s_ease-in_forwards] text-red"
        strokeDasharray={1000}
        strokeDashoffset={1000}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        x1="38.4"
        y1="41.9"
        x2="91.8"
        y2="88.3"
      />
      <line
        className="animate-[dash_1.5s_ease-in_forwards] text-red"
        strokeDasharray={1000}
        strokeDashoffset={1000}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        x1="91.8"
        y1="41.9"
        x2="38.4"
        y2="88.3"
      />
    </svg>
  )
}
