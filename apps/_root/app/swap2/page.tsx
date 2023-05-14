import React from 'react'

export default async function SwapPage() {
  // simulating to force loading segment...
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return <h1>SushiSwap 🍣</h1>
}
