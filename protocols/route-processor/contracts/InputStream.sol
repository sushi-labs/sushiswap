// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

library InputStream {
  function createStream(bytes memory data) internal pure returns (uint256 stream) {
    assembly {
      stream := mload(0x40)
      mstore(0x40, add(stream, 64))
      mstore(stream, data)
      let length := mload(data)
      mstore(add(stream, 32), add(data, length))
    }
  }

  function isNotEmpty(uint256 stream) internal pure returns (bool) {
    uint256 pos;
    uint256 finish;
    assembly {
      pos := mload(stream)
      finish := mload(add(stream, 32))
    }
    return pos < finish;
  }

  function readUint8(uint256 stream) internal pure returns (uint8 res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 1)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readUint16(uint256 stream) internal pure returns (uint16 res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 2)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readUint24(uint256 stream) internal pure returns (uint24 res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 3)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readUint32(uint256 stream) internal pure returns (uint32 res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 4)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readUint(uint256 stream) internal pure returns (uint256 res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 32)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readBytes32(uint256 stream) internal pure returns (bytes32 res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 32)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readAddress(uint256 stream) internal pure returns (address res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 20)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readBytes(uint256 stream) internal pure returns (bytes memory res) {
    assembly {
      let pos := mload(stream)
      res := add(pos, 32)
      let length := mload(res)
      mstore(stream, add(res, length))
    }
  }
}
