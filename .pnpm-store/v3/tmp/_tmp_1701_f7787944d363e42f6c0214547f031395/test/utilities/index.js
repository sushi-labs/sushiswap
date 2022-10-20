const {
    BigNumber,
    utils: { keccak256, defaultAbiCoder, toUtf8Bytes, solidityPack },
} = require("ethers")
const { ecsign } = require("ethereumjs-util")

const { BN } = require("bn.js")

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

const BASE_TEN = 10

function roundBN(number) {
    return new BN(number.toString()).divRound(new BN("10000000000000000")).toString()
}

function encodePrice(reserve0, reserve1) {
    return [
        reserve1.mul(BigNumber.from(2).pow(BigNumber.from(112))).div(reserve0),
        reserve0.mul(BigNumber.from(2).pow(BigNumber.from(112))).div(reserve1),
    ]
}

const PERMIT_TYPEHASH = keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"))

function getDomainSeparator(tokenAddress, chainId) {
    return keccak256(
        defaultAbiCoder.encode(
            ["bytes32", "uint256", "address"],
            [keccak256(toUtf8Bytes("EIP712Domain(uint256 chainId,address verifyingContract)")), chainId, tokenAddress]
        )
    )
}

function getApprovalDigest(token, approve, nonce, deadline, chainId = 1) {
    const DOMAIN_SEPARATOR = getDomainSeparator(token.address, chainId)
    const msg = defaultAbiCoder.encode(
        ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
        [PERMIT_TYPEHASH, approve.owner, approve.spender, approve.value, nonce, deadline]
    )
    const pack = solidityPack(["bytes1", "bytes1", "bytes32", "bytes32"], ["0x19", "0x01", DOMAIN_SEPARATOR, keccak256(msg)])
    return keccak256(pack)
}

function getApprovalMsg(tokenAddress, approve, nonce, deadline) {
    const DOMAIN_SEPARATOR = getDomainSeparator(tokenAddress)
    const msg = defaultAbiCoder.encode(
        ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
        [PERMIT_TYPEHASH, approve.owner, approve.spender, approve.value, nonce, deadline]
    )
    const pack = solidityPack(["bytes1", "bytes1", "bytes32", "bytes32"], ["0x19", "0x01", DOMAIN_SEPARATOR, keccak256(msg)])
    return pack
}

const BENTOBOX_MASTER_APPROVAL_TYPEHASH = keccak256(
    toUtf8Bytes("SetMasterContractApproval(string warning,address user,address masterContract,bool approved,uint256 nonce)")
)

function getBentoBoxDomainSeparator(address, chainId) {
    return keccak256(
        defaultAbiCoder.encode(
            ["bytes32", "string", "uint256", "address"],
            [keccak256(toUtf8Bytes("EIP712Domain(string name,uint256 chainId,address verifyingContract)")), "BentoBox V1", chainId, address]
        )
    )
}

function getBentoBoxApprovalDigest(bentoBox, user, masterContractAddress, approved, nonce, chainId = 1) {
    const DOMAIN_SEPARATOR = getBentoBoxDomainSeparator(bentoBox.address, chainId)
    const msg = defaultAbiCoder.encode(
        ["bytes32", "string", "address", "address", "bool", "uint256"],
        [
            BENTOBOX_MASTER_APPROVAL_TYPEHASH,
            approved ? "Give FULL access to funds in (and approved to) BentoBox?" : "Revoke access to BentoBox?",
            user.address,
            masterContractAddress,
            approved,
            nonce,
        ]
    )
    const pack = solidityPack(["bytes1", "bytes1", "bytes32", "bytes32"], ["0x19", "0x01", DOMAIN_SEPARATOR, keccak256(msg)])
    return keccak256(pack)
}

async function setMasterContractApproval(bentoBox, user, privateKey, masterContractAddress, approved) {
    const nonce = await bentoBox.nonces(user.address)

    const digest = getBentoBoxApprovalDigest(bentoBox, user, masterContractAddress, approved, nonce, user.provider._network.chainId)
    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(privateKey.replace("0x", ""), "hex"))

    return await bentoBox.connect(user).setMasterContractApproval(user.address, masterContractAddress, approved, v, r, s)
}

async function setLendingPairContractApproval(bentoBox, user, privateKey, lendingPair, approved) {
    const nonce = await bentoBox.nonces(user.address)

    const digest = getBentoBoxApprovalDigest(bentoBox, user, lendingPair.address, approved, nonce, user.provider._network.chainId)
    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(privateKey.replace("0x", ""), "hex"))

    return await lendingPair.connect(user).setApproval(user.address, approved, v, r, s)
}

async function lendingPairPermit(bentoBox, token, user, privateKey, lendingPair, amount) {
    const nonce = await token.nonces(user.address)

    const deadline = (await user.provider._internalBlockNumber).respTime + 10000

    const digest = await getApprovalDigest(
        token,
        {
            owner: user.address,
            spender: bentoBox.address,
            value: amount,
        },
        nonce,
        deadline,
        user.provider._network.chainId
    )
    const { v, r, s } = ecsign(Buffer.from(digest.slice(2), "hex"), Buffer.from(privateKey.replace("0x", ""), "hex"))

    return await lendingPair.connect(user).permitToken(token.address, user.address, amount, deadline, v, r, s)
}

function sansBorrowFee(amount) {
    return amount.mul(BigNumber.from(2000)).div(BigNumber.from(2001))
}

async function advanceTimeAndBlock(time, ethers) {
    await advanceTime(time, ethers)
    await advanceBlock(ethers)
}

async function advanceTime(time, ethers) {
    await ethers.provider.send("evm_increaseTime", [time])
}

async function advanceBlock(ethers) {
    await ethers.provider.send("evm_mine")
}

// Defaults to e18 using amount * 10^18
function getBigNumber(amount, decimals = 18) {
    return BigNumber.from(amount).mul(BigNumber.from(BASE_TEN).pow(decimals))
}

async function prepare(thisObject, contracts) {
    for (let i in contracts) {
        let contract = contracts[i]
        thisObject[contract] = await ethers.getContractFactory(contract)
    }
    thisObject.signers = await ethers.getSigners()
    thisObject.alice = thisObject.signers[0]
    thisObject.bob = thisObject.signers[1]
    thisObject.carol = thisObject.signers[2]
    thisObject.alicePrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    thisObject.bobPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    thisObject.carolPrivateKey = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
}

async function deploy(thisObject, contracts) {
    for (let i in contracts) {
        let contract = contracts[i]
        thisObject[contract[0]] = await contract[1].deploy(...(contract[2] || []))
        await thisObject[contract[0]].deployed()
    }
}

function addr(address) {
    if (typeof address == "object" && address.address) {
        address = address.address
    }
    return address
}

module.exports = {
    ADDRESS_ZERO,
    getDomainSeparator,
    getApprovalDigest,
    getApprovalMsg,
    getBentoBoxDomainSeparator,
    getBentoBoxApprovalDigest,
    lendingPairPermit,
    setMasterContractApproval,
    setLendingPairContractApproval,
    sansBorrowFee,
    encodePrice,
    roundBN,
    advanceTime,
    advanceBlock,
    advanceTimeAndBlock,
    getBigNumber,
    prepare,
    deploy,
    addr,
}
