import React from 'react'

interface InfoCardProps {
  text: string
  number: string
}

export default function InfoCard({ text, number }: InfoCardProps) {
  return (
    <div className="w-full py-3 border px-9 border-dark-900 rounded shadow-md bg-[rgba(0,0,0,0.12)]">
      <div className="whitespace-nowrap">{text}</div>
      <div className="text-2xl font-bold">{number}</div>
    </div>
  )
}
