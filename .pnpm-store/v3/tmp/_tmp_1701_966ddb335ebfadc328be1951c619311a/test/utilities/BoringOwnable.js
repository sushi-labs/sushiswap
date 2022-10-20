const { ADDRESS_ZERO, addr } = require(".")

class BoringOwnable {
    constructor(hardhat) {
        this.BoringOwnable = hardhat.BoringOwnable
    }

    async deploy() {
        this.contract = await this.BoringOwnable.deploy()
        await this.contract.deployed()
        this.do = this.contract
        return this
    }

    as(from) {
        this.do = this.contract.connect(from)
        return this
    }

    owner() {
        return this.do.owner()
    }

    pendingOwner() {
        return this.do.pendingOwner()
    }

    pendingOwner() {
        return this.do.pendingOwner()
    }

    renounceOwnership() {
        return this.do.transferOwnership(ADDRESS_ZERO, true, true)
    }

    assignOwnership(newOwner) {
        return this.do.transferOwnership(addr(newOwner), true, false)
    }

    transferOwnership(newOwner) {
        return this.do.transferOwnership(addr(newOwner), false, false)
    }

    claimOwnership() {
        return this.do.claimOwnership()
    }
}

module.exports = {
    BoringOwnable,
}
