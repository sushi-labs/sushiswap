# Entities

Entities define the GraphQL schema and should be thought of simply as "objects containing data".

### Factory

...

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | factory address |
| pairs | \[Pairs\] | an array of pair ids |
| volumeUSD | BigDecimal | all-time volume across pairs stored as a derived amount of USD |
| volumeETH | BigDecimal | all-time volume across pairs stored as a derived amount of ETH |
| untrackedVolumeUSD | BigDecimal | all-time untracked volume across pairs stored as a derived amount of USD |
| liquidityUSD | BigDecimal | all-time liquidity across pairs stored as a derived amount of USD |
| liquidityETH | BigDecimal | all-time liquidity across pairs stored as a derived amount of ETH |
| txCount | BigInt | all-time transaction count |
| tokenCount | BigInt | token count |
| pairCount | BigInt | pair count |

### Token

Token entity data.

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | token address |
| symbol | String | token symbol |
| name | String | token name |
| decimals | BigInt | token decimals |
| volume | BigDecimal | amount of token traded all-time across pairs |
| volumeUSD | BigDecimal | amount of token traded all-time across pairs stored as a derived amount of USD |
| txCount | BigInt | all-time transaction count of token across pairs |
| liquidity | BigDecimal | amount of token provided as liquidity across pairs |
| derivedETH | BigDecimal | ETH per token |

### Pair

Pair entity data.

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | pair address |
| token0 | Token | reference of token0 stored in pair contract |
| token1 | Token | reference of token1 stored in pair contract |
| reserve0 | BigDecimal | reserve of token0 |
| reserve1 | BigDecimal | reserve of token1 |
| totalSupply | BigDecimal | total supply of liquidity token distributed to liquidity providers |
| reserveETH | BigDecimal | total liquidity in pair stored as an amount of ETH |
| reserveUSD | BigDecimal | total liquidity in pair stored as an amount of USD |
| trackedReserveETH | BigDecimal | ... |
| token0Price | BigDecimal | token0 per token1 |
| token1Price | BigDecimal | token1 per token0 |
| volumeToken0 | BigDecimal | amount of token0 swapped on this pair |
| volumeToken1 | BigDecimal | amount of token1 swapped on this pair |
| volumeUSD | BigDecimal | all-time volume on this pair stored as a derived amount of USD |
| txCount | BigInt | all-time transaction count on this pair |
| createdAtTimestamp | BigInt | timestamp contract was created |
| createdAtBlock | BigInt | block contract was created |
| liquidityProviderCount | BigInt | liquidity provider count for this pair |

### User

A user entity is created for any unknown address that provides liquidity to a pool on SushiSwap. It can be used to track active liquidity positions and all-time value in USD of swaps performed by the user.

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | user address |
| liquidityPositions | \[LiquidityPosition\] | an array of active liquidity positions |

### LiquidityPosition

...

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | user address concatenated with pair address |
| user | User | user reference |
| pair | Pair | pair reference |
| liquidityTokenBalance | BigDecimal | amount of liquidity token |
| historicalSnapshots | \[LiquidityPositionSnapshot\] | an array of liquidity position snapshots |

### LiquidityPositionSnapshot

...

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | ... |
| liquidityPosition | LiquidityPosition | ... |
| timestamp | Int | ... |
| block | Int | ... |
| user | User | ... |
| pair | Pair | ... |
| token0PriceUSD | BigDecimal | ... |
| token1PriceUSD | BigDecimal | ... |
| reserve0 | BigDecimal | ... |
| reserve1 | BigDecimal | ... |
| reserveUSD | BigDecimal | ... |
| liquidityTokenTotalSupply | BigDecimal | ... |
| liquidityTokenBalance | BigDecimal | ... |

### Transaction

...

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | transaction hash |
| blockNumber | BigInt | block transaction was mined |
| timestamp | BigInt | timestamp transaction was created |
| mints | \[Mint\] | an array of Mint events |
| burns | \[Burn\] | an array of Burn events |
| swaps | \[Swap\] | an array of Swap events |

### Mint

...

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | transaction hash, a hyphen, and the index in the transaction mint array concatenated |
| transaction | Transaction | reference to transaction |
| timestamp | BigInt | timestamp mint was created |
| pair | Pair | reference to pair |
| to | Bytes | address of recipient |
| liquidity | BigDecimal | amount of liquidity tokens minted |
| sender | Bytes | address of initiator |
| amount0 | BigDecimal | amount of token0 |
| amount1 | BigDecimal | amount of token1 |
| logIndex | BigInt | index in the transaction event was emitted |
| amountUSD | BigDecimal | value of token0 and token 1 in USD |
| feeTo | Bytes | address of fee recipient |
| feeLiquidity | BigDecimal | amount of liquidity sent to fee recipient |

### Burn

...

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | transaction hash-the index in the transaction burn array |
| transaction | Transaction | reference to transaction |
| timestamp | BigInt | timestamp burn was created |
| pair | Pair | reference to pair |
| to | Bytes | address of recipient |
| liquidity | BigDecimal | amount of liquidity tokens burned |
| sender | Bytes | address of initiator |
| amount0 | BigDecimal | amount of token0 burned |
| amount1 | BigDecimal | amount of token1 burned |
| logIndex | BigInt | index in the transaction event was emitted |
| amountUSD | BigDecimal | value of token0 and token 1 in USD |
| feeTo | Bytes | address of fee recipient |
| feeLiquidity | BigDecimal | amount of liquidity sent to fee recipient |

### Swap

...

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | transaction hash-the index in the transaction burn array |
| transaction | Transaction | reference to transaction |
| timestamp | BigInt | timestamp swap was created |
| pair | Pair | reference to pair |
| sender | Bytes | address of initiator |
| amount0In | BigDecimal | amount of token0 sold |
| amount1In | BigDecimal | amount of token1 sold |
| amount0Out | BigDecimal | amount of token0 received |
| amount1Out | BigDecimal | amount of token1 received |
| to | Bytes | address of recipient |
| logIndex | BigInt | index in the transaction event was emitted |
| amountUSD | BigDecimal | value of token0 and token 1 in USD |

### Bundle

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | bundle id |
| ethPrice | BigDecimal | derived price of ETH in USD based on stablecoin pairs |

### DayData

Combined pair data aggregated daily.

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | unix timestamp for the start of the day / 86400 |
| factory | Factory | factory |
| date | Int | unix timestamp for the start of the day |
| volumeETH | BigDecimal | the volume across all pairs stored as a derived amount of ETH |
| volumeUSD | BigDecimal | the volume across all pairs stored as a derived amount of USD |
| untrackedVolume | BigDecimal | the untracked volume across all pairs |
| liquidityETH | BigDecimal | total liquidity across all pairs stored as a derived amount of ETH |
| liquidityUSD | BigDecimal | total liquidity across all pairs stored as a derived amount of USD |

### PairDayData

Pair data aggregated daily.

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | pair address concatenated with day id \(unix timestamp for the start of the day / 86400\) |
| date | Int | unix timestamp for the start of the day |
| pairAddress | Bytes | pair address |
| token0 | Token | token0 reference |
| token1 | Token | token1 reference |
| reserveUSD | BigDecimal | reserve of token0 and token1 as the derived amount of USD |
| volumeToken0 | BigDecimal | amount of token0 swapped |
| volumeToken1 | BigDecimal | amount of token1 swapped |
| volumeUSD | BigDecimal | the volume of pair as the derived amount of USD |
| txCount | BigInt | amount of transactions on pair |

### TokenDayData

Token data across related pairs aggregated daily.

| Field | Type | Description |
| :--- | :--- | :--- |
| id | ID | token address concatenated with day id \(unix timestamp for the start of the day / 86400\) |
| date | Int | unix timestamp for the start of the day |
| token | Token | token reference |
| volumeToken | BigDecimal | amount of token swapped across related pairs |
| volumeETH | BigDecimal | amount of token swapped across related pairs stored as the derived amount of ETH |
| volumeUSD | BigDecimal | amount of token swapped across related pairs stored as the derived amount of USD |
| txCount | BigInt | amount of transactions with this token across related pairs |
| liquidityToken | BigDecimal | amount of tokens deposited across related pairs |
| liquidityTokenETH | BigDecimal | amount of tokens deposited across related pairs stored as ETH |
| liquidityTokenUSD | BigDecimal | amount of tokens deposited across related pairs stored as USD |
| priceUSD | BigDecimal | token price in USD |

   

