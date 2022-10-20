const { ADDRESS_ZERO, prepare } = require("./utilities")
const { expect } = require("chai")
const { BoringOwnable } = require("./utilities/BoringOwnable")

describe("BoringOwnable", function () {
    before(async function () {
        await prepare(this, ["BoringOwnable"])
    })

    beforeEach(async function () {
        this.ownable = await new BoringOwnable(this).deploy()
    })

    describe("Deployment", function () {
        it("Assigns owner", async function () {
            expect(await this.ownable.owner()).to.equal(this.alice.address)
        })
    })

    describe("Renounce Ownership", function () {
        it("Prevents non-owners from renouncement", async function () {
            await expect(this.ownable.as(this.bob).renounceOwnership()).to.be.revertedWith("Ownable: caller is not the owner")
        })

        it("Assigns owner to address zero", async function () {
            await expect(this.ownable.renounceOwnership())
                .to.emit(this.ownable.contract, "OwnershipTransferred")
                .withArgs(this.alice.address, ADDRESS_ZERO)

            expect(await this.ownable.owner()).to.equal(ADDRESS_ZERO)
        })
    })

    describe("Transfer Ownership", function () {
        it("Prevents non-owners from transferring", async function () {
            await expect(this.ownable.as(this.bob).transferOwnership(this.bob)).to.be.revertedWith("Ownable: caller is not the owner")
        })

        it("Changes pending owner after transfer", async function () {
            await this.ownable.transferOwnership(this.bob.address)

            expect(await this.ownable.pendingOwner()).to.equal(this.bob.address)
        })
    })

    describe("Transfer Ownership Direct", function () {
        it("Reverts given a zero address as newOwner argument", async function () {
            await expect(this.ownable.assignOwnership(ADDRESS_ZERO)).to.be.revertedWith("Ownable: zero address")
        })

        it("Mutates owner", async function () {
            await this.ownable.assignOwnership(this.bob)

            expect(await this.ownable.owner()).to.equal(this.bob.address)
        })

        it("Emit OwnershipTransferred event with expected arguments", async function () {
            await expect(this.ownable.assignOwnership(this.bob))
                .to.emit(this.ownable.contract, "OwnershipTransferred")
                .withArgs(this.alice.address, this.bob.address)
        })
    })

    describe("Claim Ownership", function () {
        it("Mutates owner", async function () {
            await this.ownable.transferOwnership(this.bob)
            await this.ownable.as(this.bob).claimOwnership()

            expect(await this.ownable.owner()).to.equal(this.bob.address)
        })

        it("Assigns previous owner to address zero", async function () {
            await this.ownable.transferOwnership(this.bob)
            await this.ownable.as(this.bob).claimOwnership()

            expect(await this.ownable.pendingOwner()).to.equal(ADDRESS_ZERO)
        })

        it("Prevents anybody but pending owner from claiming ownership", async function () {
            await expect(this.ownable.as(this.bob).claimOwnership()).to.be.revertedWith("Ownable: caller != pending owner")
        })

        it("Emit OwnershipTransferred event with expected arguments", async function () {
            await this.ownable.transferOwnership(this.bob)

            await expect(this.ownable.as(this.bob).claimOwnership())
                .to.emit(this.ownable.contract, "OwnershipTransferred")
                .withArgs(this.alice.address, this.bob.address)
        })
    })
})
