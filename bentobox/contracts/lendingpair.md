# LendingPair

{% hint style="info" %}
Docmumentation is a work in progress. Feedback and help is appreciated. [@Boring\_Crypto](https://twitter.com/Boring_Crypto)
{% endhint %}

LendingPair is a masterContract for BentoBox that provides functionality for supplying an asset, borrowing that asset by supplying collateral and links to an oracle for the exchange rate.

## Concepts

### Supplying Assets

### Supplying Collateral and Borrowing

### Elastic Interest Rate

### Many Oracle Options

### Boost \(short\) and Unwind

### Liquidity Tokens

As you provide assets to the LendingPair, it will mint liquidity tokens in return. These tokens represent your share of the asset pool. As interest is paid by borrowers, these tokens will return more of the asset when you remove your liquidity.

LendingPair allows supplying assets and borrowing the same asset, but because the asset does NOT count as collateral it's just silly \(as you lose funds\) and no UI should allow this.

### TVL vs Fees

The LendingPair contract is actually designed to minimize TVL and maximize fees and therefore maximize capital efficiency. This is done though the elastic interest rates, which will optimize each pair to have between 70% and 80% utilization, so most assets will be borrowed. If there is no demand for an asset, it will be counterproductive to supply it, as this will make the interest rate very low.

## Functions



