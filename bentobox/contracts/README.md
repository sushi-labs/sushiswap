# Contracts

### Deployments

These are for testing and reference only at this point. They contain a known exploit left in intentionally to be found during audit.

#### Ropsten

This is a deployment on Ropsten for testing. Not the final version.

BentoBox.sol - 0x42192Cc25e0feb6debbd5fB32180Ee706c80F322  
LendingPair.sol \(master\) - 0xDaE20Fa3487e3Fe47dE1e7EA973FC42B6cfe4737  
SushiSwapSwapper.sol - 0xc870551cbfE40D7Bb272273D156123E18924Bc68  
PeggedOracle.sol - 0xb5C8A2d1C8d393Dace7b3C1D98f35d645A1cD1fc  
CompoundOracle.sol - 0xf1EFAf821B7FE3CCdFA1dC2b7c553B08BC53d707  
BentoHelper.sol - 0x0a503755021447B82037292EBc38d63c2FfBfEf7  
  
WETH9 &gt; SUSHI \(PeggedOracle\) LendingPair - 0x5F9A19B1a8CEb48570A4EF7D7290Fa927b598Eaa

WETH9 - 0xcBBDe19C1a79c18F07576792E96a912EAb8C4060  
UniswapV2 Factory - 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f  
UniswapAnchoredView - 0xBEf4E076A995c784be6094a432b9CA99b7431A3f  
  


### Units of Value - Amount / Share / Fraction

Throughout the code, not all values are simply token amounts, do to rebasing and accrual of fees and interest. In the BentoBox you will find Amount and Share used. In LendingPair you'll also find Fraction.

#### Amount

This is the amount of actual token units. This unit of value is what you use when interacting directly with the ERC20 token contract functions such as balanceOf, totalSupply and transfer.

#### Share

This represents a share of the tokens in the BentoBox. When a token rebases, the total amount that the BentoBox holds changes, but all the shares stay the same. The BentoBox contract has utility functions to translate amounts to and from shares called toShare and toAmount.

#### Fraction

Any masterContract interacting with BentBox will use shares and not amounts. If the contract has it's own amount to share layer, because for instance, interest is accruing, the new "shares" layer is called fractions.

By sticking to this terminology, units are tracked and named consistantly across the BentoBox and the masterContracts.



BentoBox is in BETA, the contracts are UNAUDITED and probably have security issues and bugs. They are deployed on Mainnet for testing only \(because some parts are almost impossible to test on Ropsten\). These contracts will not be used in the future. New audited and fixed versions will be deployed at a later date.

BentoBox

LendingPair \(Medium Risk\)

The first masterContract released is a LendingPair for medium risk assets, with the following parameters set:

| Parameter | Value |
| :--- | :--- |
| Collaterization Rate | 75% |
| Collaterization Rate \(open\) | 77% |
| Target utilization | 70%-80% |
| Minimum Interest Rate | approx 0.25% APR |
| Maximum Interest Rate | approx 1000% APR |
| Liquidation Bonus | 12% |
| Protocol Fee | 9% |
| Developer Fee | 1% |
| Borrow Opening Fee | 0.05% |

