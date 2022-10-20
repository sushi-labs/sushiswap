// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract TridentERC721 is ERC721 {
    bytes32 public constant PERMIT_TYPEHASH = keccak256("Permit(address spender,uint256 tokenId,uint256 nonce,uint256 deadline)");

    bytes32 public constant PERMIT_ALL_TYPEHASH = keccak256("Permit(address owner,address spender,uint256 nonce,uint256 deadline)");

    bytes32 internal immutable _DOMAIN_SEPARATOR;

    uint256 internal immutable DOMAIN_SEPARATOR_CHAIN_ID;

    struct NFTCounter {
        uint128 minted;
        uint128 burned;
    }

    NFTCounter public nftCount;

    mapping(uint256 => uint256) public nonces;

    mapping(address => uint256) public noncesForAll;

    constructor() ERC721("TridentNFT", "tNFT") {
        DOMAIN_SEPARATOR_CHAIN_ID = block.chainid;
        _DOMAIN_SEPARATOR = _calculateDomainSeparator();
    }

    function _calculateDomainSeparator() internal view returns (bytes32 domainSeperator) {
        domainSeperator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("TridentNFT")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function DOMAIN_SEPARATOR() public view returns (bytes32 domainSeperator) {
        domainSeperator = block.chainid == DOMAIN_SEPARATOR_CHAIN_ID ? _DOMAIN_SEPARATOR : _calculateDomainSeparator();
    }

    function mint(address recipient) internal {
        _mint(recipient, nftCount.minted++);
    }

    function burn(uint256 tokenId) internal {
        nftCount.burned++;
        _burn(tokenId);
    }

    function totalSupply() public view returns (uint256) {
        return nftCount.minted - nftCount.burned;
    }

    function permit(
        address spender,
        uint256 tokenId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(deadline >= block.timestamp, "PERMIT_DEADLINE_EXPIRED");
        address owner = ownerOf(tokenId);
        /// @dev This is reasonably safe from overflow - incrementing `nonces` beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits.
        unchecked {
            bytes32 digest = keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR(),
                    keccak256(abi.encode(PERMIT_TYPEHASH, spender, tokenId, nonces[tokenId]++, deadline))
                )
            );
            address recoveredAddress = ecrecover(digest, v, r, s);
            require(recoveredAddress != address(0), "INVALID_PERMIT_SIGNATURE");
            require(recoveredAddress == owner || isApprovedForAll(owner, recoveredAddress), "INVALID_SIGNER");
        }
        _approve(spender, tokenId);
    }

    function permitAll(
        address owner,
        address operator,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(deadline >= block.timestamp, "PERMIT_DEADLINE_EXPIRED");
        /// @dev This is reasonably safe from overflow - incrementing `nonces` beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits.
        unchecked {
            bytes32 digest = keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR(),
                    keccak256(abi.encode(PERMIT_ALL_TYPEHASH, owner, operator, noncesForAll[owner]++, deadline))
                )
            );
            address recoveredAddress = ecrecover(digest, v, r, s);
            require(
                (recoveredAddress != address(0) && recoveredAddress == owner) || isApprovedForAll(owner, recoveredAddress),
                "INVALID_PERMIT_SIGNATURE"
            );
        }
        _setApprovalForAll(owner, operator, true);
    }
}
