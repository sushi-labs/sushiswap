const { ADDRESS_ZERO, prepare, getApprovalDigest } = require("./utilities")
const { expect } = require("chai")
const { ecsign } = require("ethereumjs-util")

describe("BoringBatchable", function () {
    before(async function () {
        await prepare(this, ["MockBoringBatchable"])
        this.contract = await this.MockBoringBatchable.deploy()
        await this.contract.deployed()
    })

    it("TotalSupply is set", async function () {
        expect(await this.contract.totalSupply()).to.equal(10000)
    })

    it("Batch of 2 transfers", async function () {
        await expect(
            this.contract.batch(
                [
                    this.contract.interface.encodeFunctionData("transfer", [this.bob.address, 100]),
                    this.contract.interface.encodeFunctionData("transfer", [this.carol.address, 200]),
                ],
                true
            )
        )
            .to.emit(this.contract, "Transfer")
            .withArgs(this.alice.address, this.bob.address, 100)
            .to.emit(this.contract, "Transfer")
            .withArgs(this.alice.address, this.carol.address, 200)
    })

    it("Batch of 2 transfers fails if one fails", async function () {
        await expect(
            this.contract.batch(
                [
                    this.contract.interface.encodeFunctionData("transfer", [this.bob.address, 100]),
                    this.contract.interface.encodeFunctionData("transfer", [this.carol.address, 20000]),
                ],
                true
            )
        ).to.revertedWith("ERC20: balance too low")
    })

    it("Batch of 2 transfers succeeds even though one tx fails", async function () {
        await expect(
            this.contract.batch(
                [
                    this.contract.interface.encodeFunctionData("transfer", [this.bob.address, 100]),
                    this.contract.interface.encodeFunctionData("transfer", [this.carol.address, 20000]),
                ],
                false
            )
        )
            .to.emit(this.contract, "Transfer")
            .withArgs(this.alice.address, this.bob.address, 100)
    })

    describe("Permit", function () {
        it("Successfully executes a permit", async function () {
            const nonce = await this.contract.nonces(this.alice.address)

            const deadline = (await this.bob.provider._internalBlockNumber).respTime + 10000

            const digest = await getApprovalDigest(
                this.contract,
                {
                    owner: this.alice.address,
                    spender: this.bob.address,
                    value: 1,
                },
                nonce,
                deadline,
                this.bob.provider._network.chainId
            )
            const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(this.alicePrivateKey.replace("0x", ""), "hex"))
            await this.contract.permitToken(this.contract.address, this.alice.address, this.bob.address, 1, deadline, v, r, s)
        })
    })
})
