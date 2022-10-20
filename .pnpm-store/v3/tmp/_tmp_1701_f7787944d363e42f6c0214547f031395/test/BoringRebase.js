const { ADDRESS_ZERO, prepare } = require("./utilities")
const { expect } = require("chai")

describe("BoringRebase", function () {
    before(async function () {
        await prepare(this, ["MockBoringRebase"])
        this.contract = await this.MockBoringRebase.deploy()
        await this.contract.deployed()
    })

    it("Calculates first toShare correctly", async function () {
        expect(await this.contract.toBase(100, false)).to.equal(100)
    })

    it("Calculates first toElastic correctly", async function () {
        expect(await this.contract.toElastic(100, false)).to.equal(100)
    })

    it("Sets elastic and base", async function () {
        this.contract.set(1000, 500)
    })

    it("Calculates toShare correctly", async function () {
        expect(await this.contract.toBase(100, false)).to.equal(50)
        expect(await this.contract.toBase(100, true)).to.equal(50)
        expect(await this.contract.toBase(1, false)).to.equal(0)
        expect(await this.contract.toBase(1, true)).to.equal(1)
        expect(await this.contract.toBase(0, false)).to.equal(0)
        expect(await this.contract.toBase(0, true)).to.equal(0)
    })

    it("Calculates toElastic correctly", async function () {
        expect(await this.contract.toElastic(100, false)).to.equal(200)
        expect(await this.contract.toElastic(100, true)).to.equal(200)
        expect(await this.contract.toElastic(1, false)).to.equal(2)
        expect(await this.contract.toElastic(1, true)).to.equal(2)
        expect(await this.contract.toElastic(0, false)).to.equal(0)
        expect(await this.contract.toElastic(0, true)).to.equal(0)
    })

    it("Adds elastic correctly", async function () {
        await this.contract.add(100, false)
        const total = await this.contract.total()
        expect(total.elastic).to.equal(1100)
        expect(total.base).to.equal(550)
    })

    it("Removes base correctly", async function () {
        await this.contract.sub(50, false)
        const total = await this.contract.total()
        expect(total.elastic).to.equal(1000)
        expect(total.base).to.equal(500)
    })

    it("Add both correctly", async function () {
        await this.contract.add2(189, 12)
        const total = await this.contract.total()
        expect(total.elastic).to.equal(1189)
        expect(total.base).to.equal(512)
    })

    it("Calculates toShare correctly (complex)", async function () {
        expect(await this.contract.toBase(100, false)).to.equal(43)
        expect(await this.contract.toBase(100, true)).to.equal(44)
        expect(await this.contract.toBase(1, false)).to.equal(0)
        expect(await this.contract.toBase(1, true)).to.equal(1)
        expect(await this.contract.toBase(0, false)).to.equal(0)
        expect(await this.contract.toBase(0, true)).to.equal(0)
    })

    it("Calculates toElastic correctly (complex)", async function () {
        expect(await this.contract.toElastic(100, false)).to.equal(232)
        expect(await this.contract.toElastic(100, true)).to.equal(233)
        expect(await this.contract.toElastic(1, false)).to.equal(2)
        expect(await this.contract.toElastic(1, true)).to.equal(3)
        expect(await this.contract.toElastic(0, false)).to.equal(0)
        expect(await this.contract.toElastic(0, true)).to.equal(0)
    })

    it("Remove both correctly", async function () {
        await this.contract.sub2(1189, 512)
        const total = await this.contract.total()
        expect(total.elastic).to.equal(0)
        expect(total.base).to.equal(0)
    })

    it("Removes base correctly when empty", async function () {
        this.contract = await this.MockBoringRebase.deploy()
        await this.contract.deployed()

        await this.contract.sub(0, false)
        const total = await this.contract.total()
        expect(total.elastic).to.equal(0)
        expect(total.base).to.equal(0)
    })

    it("Adds elastic correctly when empty", async function () {
        await this.contract.add(100, false)
        const total = await this.contract.total()
        expect(total.elastic).to.equal(100)
        expect(total.base).to.equal(100)
    })

    it("Adds just elastic correctly when empty", async function () {
        await this.contract.addElastic(50)
        const total = await this.contract.total()
        expect(total.elastic).to.equal(150)
        expect(total.base).to.equal(100)
    })

    it("Remove just elastic correctly when empty", async function () {
        await this.contract.subElastic(40)
        const total = await this.contract.total()
        expect(total.elastic).to.equal(110)
        expect(total.base).to.equal(100)
    })
})
