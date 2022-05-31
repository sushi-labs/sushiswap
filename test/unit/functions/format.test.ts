import { shortenAddress } from 'app/functions/format'

describe('#shortenAddress', () => {
  it('throws on invalid address', () => {
    expect(() => shortenAddress('abc')).toThrow("Invalid 'address'")
  })

  it('truncates middle characters', () => {
    expect(shortenAddress('0xf164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe('0xf164...b92a')
  })

  it('truncates middle characters even without prefix', () => {
    expect(shortenAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe('0xf164...b92a')
  })

  it('renders checksummed address', () => {
    expect(shortenAddress('0x2E1b342132A67Ea578e4E3B814bae2107dc254CC'.toLowerCase())).toBe('0x2E1b...54CC')
  })
})
