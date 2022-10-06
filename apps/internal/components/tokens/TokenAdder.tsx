import { Select } from '@sushiswap/ui'
import { Token, TokenLogo } from 'lib'
import { useState } from 'react'
import useSWR from 'swr'

interface TokenAdder {
  token: Token
}

export function TokenAdder({ token }: TokenAdder) {
  const [selectedLogo, setSelectedLogo] = useState<string>('1inch')

  const { data: tokenLogos } = useSWR<TokenLogo[]>('tokenLogos', () =>
    fetch('/internal/api/tokens/tokenLogos').then((data) => data.json())
  )

  return (
    <div>
      <Select button={<Select.Button>{selectedLogo}</Select.Button>} value={selectedLogo} onChange={setSelectedLogo}>
        <Select.Options>
          {tokenLogos?.map((logo) => (
            <Select.Option key={logo.name} value={logo.name} className="z-50">
              {logo.name}
            </Select.Option>
          ))}
        </Select.Options>
      </Select>
    </div>
  )
}
