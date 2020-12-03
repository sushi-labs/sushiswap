# BentoBox \(Vault\)



{% hint style="info" %}
Docmumentation is a work in progress. Feedback and help is appreciated. [@Boring\_Crypto](https://twitter.com/Boring_Crypto)
{% endhint %}

The BentoBox is the main vault that holds all funds, not only for the lending contracts, but also for any future extensions. Anyone can build extensions that use the BentoBox as vault with these benefits:

* Once a token is approved for the Vault, any protocol built using BentoBox doesn't need per token approval anymore.
* Low flat costs of internal token transfers and advanced transfers such as one-to-many transfers.
* Earn passive income on all funds through flashloans.
* Support for rebasing tokens. When a rebasing token calls sync on the BentoBox, all funds within automatically rebase correctly.
* Funds of users and protocols are safely separated internally. Only protocols that the user approves can access the user's funds.

## Concepts

### Multiple protocols and Master Contracts

Any protocol can use BentoBox as it's storage of funds. The contract just needs to implement the setBentoBox function and the init function.

The setBentoBox function is called on each clone

### Approval of protocols \(master contracts\) not tokens

For every new master contract, each user manually approves the protocol. Once approved, functions of the protocol contract have access to all funds of the user that are not in other protocols.

## Functions

### View Functions

The `toShare` and `toAmount` functions translate between share and amount.

### Approval Function

The `setMasterContractApproval` function allows users to approve all clones of a masterContract to manage their funds.

### Deposit and Withdrawal Functions

Deposit and withdraw functions are used to add and remove funds from the BentoBox. Are range of different variants are available. Support for ERC721 permits is also included.

When depositing ETH, use the WETH9 address \(0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2\) and set the amount correctly. ETH will be converted to WETH9 when depositing and back to ETH when withdrawn. There is no way to deposit WETH9 directly. Setting a lower amount will cause a loss of ETH. This is not protected to support batch deposits through the batch function.

Once a user approves a masterContract, all clones of that contract can withdraw and deposit for that user.

### Transfer Functions

Transfer functions are used to transfer funds from one account to another within the BentoBox. Once a user approves a masterContract, all clones of that contract can access the user's funds in the BentoBox and transfer them.

There are several versions of the transfer function transferring either denoted in amount or share and one-to-one or one-to-many.

### Skim Functions

After depositing directly into the BentoBox, you can skim the funds into a BentoBox account in the **same** transaction.

### Rebasing Functions

To support rebasing tokens, the token or team needs to call `sync` on the BentoBox for the token in the same transaction that the rebase happens. When a token support rebasing in BentoBox, all tokens in the BentoBox are rebased. So this works for **all** lendingpairs for that token as well as any other protocols that use this token through BentoBox.

### Flashloan Functions

All assets in the BentoBox can be used for flashloans for a fee of 0.05%. This fee will directly benefit the owners of the funds in the BentoBox. To use flashloans, implement the `IFlashloan` interface and call `flashloan` or `flashloanMultiple.`

### Batch Function

The batch function allows for executing multiple actions on the BentoBox contract in a single transaction.

