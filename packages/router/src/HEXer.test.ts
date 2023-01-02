import { HEXer } from './HEXer'

describe('HEXer', () => {
  const hexer = new HEXer()

  describe('constructor', () => {
    it('instanciates', () => {
      expect(hexer).toBeInstanceOf(HEXer)
      expect(hexer.toString()).toEqual('')
    })
  })

  describe('#address', () => {
    it('throws when address is RouteProcessor', () => {
      const address = 'RouteProcessor'
      expect(() => hexer.address(address)).toThrow('Wrong address: ' + address)
    })
    it('throws when address has a length more than 42', () => {
      // 43 characters
      const address = '0x00000000000000000000000000000000000000000'
      expect(() => hexer.address(address)).toThrow('Wrong address: ' + address)
    })
  })
})
