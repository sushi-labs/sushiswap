// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import './IBentoBoxV1.sol';
import './interfaces/IBoshiCallee.sol';
import './IBoshiFactory.sol';
import './interfaces/IMigrator.sol';
import './libraries/BoshiMath.sol';
import './BoshiERC20.sol';

contract BoshiPair is BoshiERC20 {
    using BoshiMath for uint256;
    using BoshiMath for uint224;
    
    IBentoBoxV1 private constant bento = IBentoBoxV1(0xF5BCE5077908a1b7370B9ae04AdC565EBd643966); // BentoBoxV1 vault
    uint256 public constant MINIMUM_LIQUIDITY = 10**3;

    address public factory;
    IERC20 public token0;
    IERC20 public token1;

    uint112 private reserve0;           // uses single storage slot, accessible via getReserves
    uint112 private reserve1;           // uses single storage slot, accessible via getReserves
    uint32  private blockTimestampLast; // uses single storage slot, accessible via getReserves

    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    uint256 public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event

    uint256 private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, 'Boshi: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    constructor() public {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(IERC20 _token0, IERC20 _token1) external {
        require(msg.sender == factory, 'Boshi: FORBIDDEN'); // sufficient check
        token0 = _token0;
        token1 = _token1;
    }

    // update reserves and, on the first call per block, price accumulators
    function _update(uint256 balance0, uint256 balance1, uint112 _reserve0, uint112 _reserve1) private {
        require(balance0 <= uint112(-1) && balance1 <= uint112(-1), 'Boshi: OVERFLOW');
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast += uint256(BoshiMath.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
            price1CumulativeLast += uint256(BoshiMath.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
        }
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }

    // if fee is on, mint liquidity equivalent to 1/6th of the growth in sqrt(k)
    function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
        address feeTo = IBoshiFactory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint256 _kLast = kLast; // gas savings
        if (feeOn) {
            if (_kLast != 0) {
                uint256 rootK = BoshiMath.sqrt(uint256(_reserve0).mul(_reserve1));
                uint256 rootKLast = BoshiMath.sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint256 numerator = totalSupply.mul(rootK.sub(rootKLast));
                    uint256 denominator = rootK.mul(5).add(rootKLast);
                    uint256 liquidity = numerator / denominator;
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }

    // this low-level function should be called from a contract which performs important safety checks
    function mint(address to) external lock returns (uint256 liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        uint256 balance0 = IBentoBoxV1(bento).balanceOf(token0, address(this));
        uint256 balance1 = IBentoBoxV1(bento).balanceOf(token1, address(this));
        uint256 amount0 = balance0.sub(_reserve0);
        uint256 amount1 = balance1.sub(_reserve1);

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint256 _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        if (_totalSupply == 0) {
            address migrator = IBoshiFactory(factory).migrator();
            if (msg.sender == migrator) {
                liquidity = IMigrator(migrator).desiredLiquidity();
                require(liquidity > 0 && liquidity != uint256(-1), "Bad desired liquidity");
            } else {
                require(migrator == address(0), "Must not have migrator");
                liquidity = BoshiMath.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
                _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
            }
        } else {
            liquidity = BoshiMath.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
        }
        require(liquidity > 0, 'Boshi: INSUFFICIENT_LIQUIDITY_MINTED');
        _mint(to, liquidity);

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint256(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
        emit Mint(msg.sender, amount0, amount1);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function burn(address to) external lock returns (uint256 amount0, uint256 amount1) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        IERC20 _token0 = token0;                                 // gas savings
        IERC20 _token1 = token1;                                 // gas savings
        uint256 balance0 = IBentoBoxV1(bento).balanceOf(_token0, address(this));
        uint256 balance1 = IBentoBoxV1(bento).balanceOf(_token1, address(this));
        uint256 liquidity = balanceOf[address(this)];

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint256 _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
        amount1 = liquidity.mul(balance1) / _totalSupply; // using balances ensures pro-rata distribution
        require(amount0 > 0 && amount1 > 0, 'Boshi: INSUFFICIENT_LIQUIDITY_BURNED');
        _burn(address(this), liquidity);
        bento.transfer(_token0, address(this), to, amount0);
        bento.transfer(_token1, address(this), to, amount1);
        balance0 = IBentoBoxV1(bento).balanceOf(_token0, address(this));
        balance1 = IBentoBoxV1(bento).balanceOf(_token1, address(this));

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint256(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
        emit Burn(msg.sender, amount0, amount1, to);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes calldata data) external lock {
        require(amount0Out > 0 || amount1Out > 0, 'Boshi: INSUFFICIENT_OUTPUT_AMOUNT');
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        require(amount0Out < _reserve0 && amount1Out < _reserve1, 'Boshi: INSUFFICIENT_LIQUIDITY');

        uint256 balance0;
        uint256 balance1;
        { // scope for _token{0,1}, avoids stack too deep errors
        IERC20 _token0 = token0;
        IERC20 _token1 = token1;
        require(to != address(_token0) && to != address(_token1), 'Boshi: INVALID_TO');
        if (amount0Out > 0) bento.transfer(_token0, address(this), to, amount0Out); // optimistically transfer tokens
        if (amount1Out > 0) bento.transfer(_token1, address(this), to, amount1Out); // optimistically transfer tokens
        if (data.length > 0) IBoshiCallee(to).boshiCall(msg.sender, amount0Out, amount1Out, data);
        balance0 = IBentoBoxV1(bento).balanceOf(_token0, address(this));
        balance1 = IBentoBoxV1(bento).balanceOf(_token1, address(this));
        }
        uint256 amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, 'Boshi: INSUFFICIENT_INPUT_AMOUNT');
        { // scope for reserve{0,1}Adjusted, avoids stack too deep errors
        uint256 balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
        uint256 balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));
        require(balance0Adjusted.mul(balance1Adjusted) >= uint256(_reserve0).mul(_reserve1).mul(1000**2), 'Boshi: K');
        }

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }
}
