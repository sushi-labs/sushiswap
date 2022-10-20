const { ADDRESS_ZERO, prepare } = require("./utilities")
const { expect } = require("chai")
const Max32 = 4294967295
const Max64 = "18446744073709551615"
const Max128 = "340282366920938463463374607431768211455"
const Max256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

describe("BoringMath", function () {
    before(async function () {
        await prepare(this, ["MockBoringMath"])
        this.contract = await this.MockBoringMath.deploy()
        await this.contract.deployed()
    })

    describe("uint256", function () {
        it("Calculates simple add correctly for uint256", async function () {
            expect(await this.contract.add(1, 2)).to.equal(3)
            expect(await this.contract.add(2, 1)).to.equal(3)
            expect(await this.contract.add(100, 100)).to.equal(200)
            expect(await this.contract.add(0, 0)).to.equal(0)
            expect(await this.contract.add(0, 10)).to.equal(10)
            expect(await this.contract.add(10, 0)).to.equal(10)
            expect(await this.contract.add(Max256, 0)).to.equal(Max256)
        })

        it("Calculates simple sub correctly for uint256", async function () {
            expect(await this.contract.sub(2, 1)).to.equal(1)
            expect(await this.contract.sub(2, 0)).to.equal(2)
            expect(await this.contract.sub(100, 100)).to.equal(0)
            expect(await this.contract.sub(0, 0)).to.equal(0)
            expect(await this.contract.sub(Max256, Max256)).to.equal(0)
        })

        it("Calculates simple mul correctly for uint256", async function () {
            expect(await this.contract.mul(2, 1)).to.equal(2)
            expect(await this.contract.mul(2, 0)).to.equal(0)
            expect(await this.contract.mul(0, 2)).to.equal(0)
            expect(await this.contract.mul(100, 100)).to.equal(10000)
            expect(await this.contract.mul(0, 0)).to.equal(0)
            expect(await this.contract.mul(Max256, 1)).to.equal(Max256)
        })

        it("Converts uint256 to uint128", async function () {
            expect(await this.contract.to128(10)).to.equal(10)
            expect(await this.contract.to128(0)).to.equal(0)
            expect(await this.contract.to128(Max128)).to.equal(Max128)
        })

        it("Converts uint256 to uint64", async function () {
            expect(await this.contract.to64(10)).to.equal(10)
            expect(await this.contract.to64(0)).to.equal(0)
            expect(await this.contract.to64(Max64)).to.equal(Max64)
        })

        it("Converts uint256 to uint32", async function () {
            expect(await this.contract.to32(10)).to.equal(10)
            expect(await this.contract.to32(0)).to.equal(0)
            expect(await this.contract.to32(Max32)).to.equal(Max32)
        })

        it("Reverts on add overflow for uint256", async function () {
            await expect(this.contract.add(Max256, 1)).to.be.revertedWith("BoringMath: Add Overflow")
        })

        it("Reverts on sub underflow for uint256", async function () {
            await expect(this.contract.sub(1, 2)).to.be.revertedWith("BoringMath: Underflow")
        })

        it("Reverts on mul overflow for uint256", async function () {
            await expect(this.contract.mul(Max256, 2)).to.be.revertedWith("BoringMath: Mul Overflow")
        })

        it("Reverts on overflow in to128", async function () {
            await expect(this.contract.to128(Max256)).to.be.revertedWith("BoringMath: uint128 Overflow")
        })

        it("Reverts on overflow in to64", async function () {
            await expect(this.contract.to64(Max256)).to.be.revertedWith("BoringMath: uint64 Overflow")
        })

        it("Reverts on overflow in to32", async function () {
            await expect(this.contract.to32(Max256)).to.be.revertedWith("BoringMath: uint32 Overflow")
        })
    })

    describe("uint128", function () {
        it("Calculates simple add correctly for uint128", async function () {
            expect(await this.contract.add128(1, 2)).to.equal(3)
            expect(await this.contract.add128(2, 1)).to.equal(3)
            expect(await this.contract.add128(100, 100)).to.equal(200)
            expect(await this.contract.add128(0, 0)).to.equal(0)
            expect(await this.contract.add128(0, 10)).to.equal(10)
            expect(await this.contract.add128(10, 0)).to.equal(10)
            expect(await this.contract.add128(Max128, 0)).to.equal(Max128)
        })

        it("Calculates simple sub correctly for uint128", async function () {
            expect(await this.contract.sub128(2, 1)).to.equal(1)
            expect(await this.contract.sub128(2, 0)).to.equal(2)
            expect(await this.contract.sub128(100, 100)).to.equal(0)
            expect(await this.contract.sub128(0, 0)).to.equal(0)
            expect(await this.contract.sub128(Max128, Max128)).to.equal(0)
        })

        it("Reverts on add overflow for uint128", async function () {
            await expect(this.contract.add128(Max128, 1)).to.be.revertedWith("BoringMath: Add Overflow")
        })

        it("Reverts on sub underflow for uint128", async function () {
            await expect(this.contract.sub128(1, 2)).to.be.revertedWith("BoringMath: Underflow")
        })
    })

    describe("uint64", function () {
        it("Calculates simple add correctly for uint64", async function () {
            expect(await this.contract.add64(1, 2)).to.equal(3)
            expect(await this.contract.add64(2, 1)).to.equal(3)
            expect(await this.contract.add64(100, 100)).to.equal(200)
            expect(await this.contract.add64(0, 0)).to.equal(0)
            expect(await this.contract.add64(0, 10)).to.equal(10)
            expect(await this.contract.add64(10, 0)).to.equal(10)
            expect(await this.contract.add64(Max64, 0)).to.equal(Max64)
        })

        it("Calculates simple sub correctly for uint64", async function () {
            expect(await this.contract.sub64(2, 1)).to.equal(1)
            expect(await this.contract.sub64(2, 0)).to.equal(2)
            expect(await this.contract.sub64(100, 100)).to.equal(0)
            expect(await this.contract.sub64(0, 0)).to.equal(0)
            expect(await this.contract.sub64(Max64, Max64)).to.equal(0)
        })

        it("Reverts on add overflow for uint64", async function () {
            await expect(this.contract.add64(Max64, 1)).to.be.revertedWith("BoringMath: Add Overflow")
        })

        it("Reverts on sub underflow for uint64", async function () {
            await expect(this.contract.sub64(1, 2)).to.be.revertedWith("BoringMath: Underflow")
        })
    })

    describe("uint32", function () {
        it("Calculates simple add correctly for uint32", async function () {
            expect(await this.contract.add32(1, 2)).to.equal(3)
            expect(await this.contract.add32(2, 1)).to.equal(3)
            expect(await this.contract.add32(100, 100)).to.equal(200)
            expect(await this.contract.add32(0, 0)).to.equal(0)
            expect(await this.contract.add32(0, 10)).to.equal(10)
            expect(await this.contract.add32(10, 0)).to.equal(10)
            expect(await this.contract.add32(Max32, 0)).to.equal(Max32)
        })

        it("Calculates simple sub correctly for uint32", async function () {
            expect(await this.contract.sub32(2, 1)).to.equal(1)
            expect(await this.contract.sub32(2, 0)).to.equal(2)
            expect(await this.contract.sub32(100, 100)).to.equal(0)
            expect(await this.contract.sub32(0, 0)).to.equal(0)
            expect(await this.contract.sub32(Max32, Max32)).to.equal(0)
        })

        it("Reverts on add overflow for uint32", async function () {
            await expect(this.contract.add32(Max32, 1)).to.be.revertedWith("BoringMath: Add Overflow")
        })

        it("Reverts on sub underflow for uint32", async function () {
            await expect(this.contract.sub32(1, 2)).to.be.revertedWith("BoringMath: Underflow")
        })
    })
})
