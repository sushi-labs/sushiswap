// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from "../libraries/LibDiamond.sol";
import {IERC165} from "../interfaces/IERC165.sol";

contract DiamondERC165Init {
    /// @notice set or unset ERC165 using DiamondStorage.supportedInterfaces
    /// @param interfaceIds list of interface id to set as supported
    /// @param interfaceIdsToRemove list of interface id to unset as supported.
    /// Technically, you can remove support of ERC165 by having the IERC165 id itself being part of that array.
    function setERC165(bytes4[] calldata interfaceIds, bytes4[] calldata interfaceIdsToRemove) external {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        ds.supportedInterfaces[type(IERC165).interfaceId] = true;

        for (uint256 i = 0; i < interfaceIds.length; i++) {
            ds.supportedInterfaces[interfaceIds[i]] = true;
        }

        for (uint256 i = 0; i < interfaceIdsToRemove.length; i++) {
            ds.supportedInterfaces[interfaceIdsToRemove[i]] = false;
        }
    }
}
