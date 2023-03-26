import JSBI from 'jsbi'

// exports for external consumption
// export type BigintIsh = JSBI | bigint | string
type BigintIsh = JSBI | number | string | bigint

export default BigintIsh
