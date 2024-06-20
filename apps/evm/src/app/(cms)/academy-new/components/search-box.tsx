'use client'

import { TextField } from '@sushiswap/ui'
import { useState } from 'react'

export function SearchBox() {
  const [value, setValue] = useState<string>()

  return (
    <>
      <TextField
        type="text"
        variant="outline"
        value={value}
        onValueChange={(value) => setValue(value)}
        placeholder="Search for the product/topic you want to learn about"
      />
    </>
  )
}
