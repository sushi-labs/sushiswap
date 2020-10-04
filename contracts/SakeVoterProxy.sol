// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./sakeswap/interfaces/ISakeSwapPair.sol";
import "./SakeMaster.sol";
import "./SakeBar.sol";

struct IndexValue {
    uint256 keyIndex;
    uint256 value;
}
struct KeyFlag {
    uint256 key;
    bool deleted;
}
struct ItMap {
    mapping(uint256 => IndexValue) data;
    KeyFlag[] keys;
    uint256 size;
}

library IterableMapping {
    function insert(
        ItMap storage self,
        uint256 key,
        uint256 value
    ) internal returns (bool replaced) {
        uint256 keyIndex = self.data[key].keyIndex;
        self.data[key].value = value;
        if (keyIndex > 0) return true;
        else {
            keyIndex = self.keys.length;
            self.keys.push();
            self.data[key].keyIndex = keyIndex + 1;
            self.keys[keyIndex].key = key;
            self.size++;
            return false;
        }
    }

    function remove(ItMap storage self, uint256 key) internal returns (bool success) {
        uint256 keyIndex = self.data[key].keyIndex;
        if (keyIndex == 0) return false;
        delete self.data[key];
        self.keys[keyIndex - 1].deleted = true;
        self.size--;
    }

    function contains(ItMap storage self, uint256 key) internal view returns (bool) {
        return self.data[key].keyIndex > 0;
    }

    function iterateStart(ItMap storage self) internal view returns (uint256 keyIndex) {
        return iterateNext(self, uint256(-1));
    }

    function iterateValid(ItMap storage self, uint256 keyIndex) internal view returns (bool) {
        return keyIndex < self.keys.length;
    }

    function iterateNext(ItMap storage self, uint256 keyIndex) internal view returns (uint256 rkeyIndex) {
        keyIndex++;
        while (keyIndex < self.keys.length && self.keys[keyIndex].deleted) keyIndex++;
        return keyIndex;
    }

    function iterateGet(ItMap storage self, uint256 keyIndex) internal view returns (uint256 key, uint256 value) {
        key = self.keys[keyIndex].key;
        value = self.data[key].value;
    }
}

contract SakeVoterProxy {
    using SafeMath for uint256;
    ItMap public votePoolMap;
    // Apply library functions to the data type.
    using IterableMapping for ItMap;

    IERC20 public votes;
    SakeMaster public chef;
    address public owner;
    SakeBar public bar;
    uint256 public lpPow;
    uint256 public balancePow;
    uint256 public stakePow;
    bool public sqrtEnable;

    modifier onlyOwner() {
        require(owner == msg.sender, "Not Owner");
        _;
    }

    constructor(
        address _tokenAddr,
        address _masterAddr,
        address _barAddr
    ) public {
        votes = IERC20(_tokenAddr);
        chef = SakeMaster(_masterAddr);
        bar = SakeBar(_barAddr);
        owner = msg.sender;
        votePoolMap.insert(votePoolMap.size, uint256(0));
        votePoolMap.insert(votePoolMap.size, uint256(32));
        votePoolMap.insert(votePoolMap.size, uint256(33));
        votePoolMap.insert(votePoolMap.size, uint256(34));
        votePoolMap.insert(votePoolMap.size, uint256(36));
        votePoolMap.insert(votePoolMap.size, uint256(42));
        lpPow = 2;
        balancePow = 1;
        stakePow = 1;
        sqrtEnable = true;
    }

    function decimals() external pure returns (uint8) {
        return uint8(18);
    }

    function name() external pure returns (string memory) {
        return "SakeToken";
    }

    function symbol() external pure returns (string memory) {
        return "SAKE";
    }

    function sqrt(uint256 x) public pure returns (uint256 y) {
        uint256 z = x.add(1).div(2);
        y = x;
        while (z < y) {
            y = z;
            z = x.div(z).add(z).div(2);
        }
    }

    function totalSupply() external view returns (uint256) {
        uint256 voterTotal = 0;
        uint256 _vCtSakes = 0;
        uint256 _vTmpPoolId = 0;
        IERC20 _vLpToken;
        for (uint256 i = votePoolMap.iterateStart(); votePoolMap.iterateValid(i); i = votePoolMap.iterateNext(i)) {
            //count lp contract sakenums
            (, _vTmpPoolId) = votePoolMap.iterateGet(i);
            if (chef.poolLength() > _vTmpPoolId) {
                (_vLpToken, , , ) = chef.poolInfo(_vTmpPoolId);
                _vCtSakes = _vCtSakes.add(votes.balanceOf(address(_vLpToken)));
            }
        }
        voterTotal = votes.totalSupply().sub(bar.totalSupply()).sub(_vCtSakes).mul(balancePow) + _vCtSakes.mul(lpPow) + bar.totalSupply().mul(stakePow);
        if (sqrtEnable == true) {
            return sqrt(voterTotal);
        }
        return voterTotal;
    }

    //sum user deposit sakenum
    function balanceOf(address _voter) external view returns (uint256) {
        uint256 _votes = 0;
        uint256 _vCtLpTotal;
        uint256 _vUserLp;
        uint256 _vCtSakeNum;
        uint256 _vUserSakeNum;
        uint256 _vTmpPoolId;
        IERC20 _vLpToken;
        for (uint256 i = votePoolMap.iterateStart(); votePoolMap.iterateValid(i); i = votePoolMap.iterateNext(i)) {
            //user deposit sakenum = user_lptoken*contract_sakenum/contract_lptokens
            (, _vTmpPoolId) = votePoolMap.iterateGet(i);
            if (chef.poolLength() > _vTmpPoolId) {
                (_vLpToken, , , ) = chef.poolInfo(_vTmpPoolId);
                _vCtLpTotal = ISakeSwapPair(address(_vLpToken)).totalSupply();
                if (_vCtLpTotal == 0) {
                    continue;
                }
                (_vUserLp, ) = chef.userInfo(_vTmpPoolId, _voter);
                _vCtSakeNum = votes.balanceOf(address(_vLpToken));
                _vUserSakeNum = _vUserLp.mul(_vCtSakeNum).div(_vCtLpTotal);
                _votes = _votes.add(_vUserSakeNum);
            }
        }
        _votes = _votes.mul(lpPow) + votes.balanceOf(_voter).mul(balancePow) + bar.balanceOf(_voter).mul(stakePow);
        if (sqrtEnable == true) {
            return sqrt(_votes);
        }
        return _votes;
    }

    function addVotePool(uint256 newPoolId) public onlyOwner {
        uint256 _vTmpPoolId;
        for (uint256 i = votePoolMap.iterateStart(); votePoolMap.iterateValid(i); i = votePoolMap.iterateNext(i)) {
            (, _vTmpPoolId) = votePoolMap.iterateGet(i);
            require(_vTmpPoolId != newPoolId, "newPoolId already exist");
        }
        votePoolMap.insert(votePoolMap.size, newPoolId);
    }

    function delVotePool(uint256 newPoolId) public onlyOwner {
        uint256 _vTmpPoolId;
        for (uint256 i = votePoolMap.iterateStart(); votePoolMap.iterateValid(i); i = votePoolMap.iterateNext(i)) {
            (, _vTmpPoolId) = votePoolMap.iterateGet(i);
            if (_vTmpPoolId == newPoolId) {
                votePoolMap.remove(i);
                return;
            }
        }
    }

    function setSqrtEnable(bool enable) public onlyOwner {
        if (sqrtEnable != enable) {
            sqrtEnable = enable;
        }
    }

    function setPow(
        uint256 lPow,
        uint256 bPow,
        uint256 sPow
    ) public onlyOwner {
        //no need to check pow ?= 0
        if (lPow != lpPow) {
            lpPow = lPow;
        }
        if (bPow != balancePow) {
            balancePow = bPow;
        }
        if (sPow != stakePow) {
            stakePow = sPow;
        }
    }
}
