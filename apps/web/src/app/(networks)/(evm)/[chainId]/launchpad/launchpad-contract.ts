import type { EvmAddress } from 'sushi/evm'
import { parseAbi } from 'viem'

export const LAUNCHPAD_ADDRESS =
  '0x30DD6230EAD9312D5d00AD58EF6eF6A0093B0554' satisfies EvmAddress

export const LAUNCHPAD_ABI = parseAbi([
  'function launch((string name, string symbol) tokenConfig, address quoteToken, (int24 startTick, int24 endTick, uint256 amount)[] ranges, uint64 deadline) payable returns (address token, address pool, uint256[] positionIds)',
  'function launchFee() view returns (uint256)',
  'function protocolReserveBps() view returns (uint16)',
  'function defaultSushiFeeBps() view returns (uint16)',
  'event TokenLaunched(address indexed creator, address indexed token, address indexed pool, address quoteToken, string name, string symbol, uint8 decimals, uint256 totalSupply, uint16 reserveBps, uint256 reserveAmount, uint64 reserveUnlockAt, uint16 initialSushiFeeBps, uint256 positionCount)',
  'error ZeroAddress()',
  'error InvalidQuoteToken(address quoteToken)',
  'error EmptyName()',
  'error EmptySymbol()',
  'error NameTooLong(uint256 length)',
  'error SymbolTooLong(uint256 length)',
  'error InsufficientLaunchFee(uint256 required, uint256 supplied)',
  'error DeadlineExpired(uint64 deadline)',
  'error EmptyRanges()',
  'error TooManyRanges(uint256 supplied, uint256 maximum)',
  'error ZeroRangeAmount(uint256 index)',
  'error InvalidRangeOrder(uint256 index, int24 startTick, int24 endTick)',
  'error InvalidTickSpacingAt(uint256 index, int24 tick)',
  'error InvalidTickBounds(uint256 index, int24 tick)',
  'error NonContiguousRanges(uint256 index, int24 previousEndTick, int24 startTick)',
  'error RangeAmountOverflow(uint256 index)',
  'error RangeAmountsExceedAllocation(uint256 supplied, uint256 allocation)',
  'error NoCleanTokenAddress()',
  'error UnexpectedExistingPool(address token, address pool)',
  'error PoolCreationMismatch(address expected, address actual)',
  'error PoolConfigurationMismatch(address pool)',
  'error PoolInitializationMismatch(uint160 expected, uint160 actual)',
  'error ZeroLiquidity(uint256 index)',
  'error NonzeroQuoteTokenUsed(uint256 index, uint256 amount)',
  'error ExcessTokenConsumption(uint256 index, uint256 used, uint256 desired)',
  'error PositionConfigurationMismatch(uint256 positionId)',
  'error SupplyReconciliationFailure(uint256 expected, uint256 accounted)',
])
