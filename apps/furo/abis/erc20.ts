import { Interface } from '@ethersproject/abi'

import ERC20_BYTES32_ABI from './erc20_bytes32.json'

const ERC20_BYTES32_INTERFACE = new Interface(ERC20_BYTES32_ABI)

export { ERC20_BYTES32_ABI, ERC20_BYTES32_INTERFACE }
