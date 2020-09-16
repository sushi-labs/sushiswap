// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.6.12;

import "./SakeSwapERC20.sol";
import "./libraries/Math.sol";
import "./libraries/UQ112x112.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/ISakeSwapFactory.sol";
import "./interfaces/ISakeSwapCallee.sol";
import "./interfaces/ISakeSwapPair.sol";
import "./SakeSwapSlippageToken.sol";

interface IMigrator {
    // Return the desired amount of liquidity token that the migrator wants.
    function desiredLiquidity() external view returns (uint256);
}

contract SakeSwapPair is SakeSwapERC20 {
    using SafeMath for uint256;
    using UQ112x112 for uint224;

    uint256 public constant MINIMUM_LIQUIDITY = 10**3;
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes("transfer(address,uint256)")));
    uint256 public constant DECAY_PERIOD = 5 minutes;
    uint256 public constant UQ112 = 2**112;

    address public factory;
    address public token0;
    address public token1;
    SakeSwapSlippageToken public stoken;

    uint224 private virtualPrice; // token0 virtual price, uses single storage slot
    uint32 private lastPriceTime; // the latest exchange time

    uint112 private reserve0; // uses single storage slot, accessible via getReserves
    uint112 private reserve1; // uses single storage slot, accessible via getReserves
    uint32 private blockTimestampLast; // uses single storage slot, accessible via getReserves

    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    uint256 public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event

    uint256 private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "SakeSwap: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    function getVirtualPrice() public view returns (uint224 _virtualPrice, uint32 _lastPriceTime) {
        _virtualPrice = virtualPrice;
        _lastPriceTime = lastPriceTime;
    }

    function _safeTransfer(address token, address to, uint256 value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "SakeSwap: TRANSFER_FAILED");
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
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, "SakeSwap: FORBIDDEN"); // sufficient check
        token0 = _token0;
        token1 = _token1;
        stoken = new SakeSwapSlippageToken(0);
    }

    // update reserves and, on the first call per block, price accumulators
    function _update(uint256 balance0, uint256 balance1, uint112 _reserve0, uint112 _reserve1) private {
        require(balance0 <= uint112(-1) && balance1 <= uint112(-1), "SakeSwap: OVERFLOW");
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast += uint256(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
            price1CumulativeLast += uint256(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
        }
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }

    // if fee is on, mint liquidity equivalent to 1/6th of the growth in sqrt(k)
    function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
        address feeTo = ISakeSwapFactory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint256 _kLast = kLast; // gas savings
        if (feeOn) {
            if (_kLast != 0) {
                uint256 rootK = Math.sqrt(uint256(_reserve0).mul(_reserve1));
                uint256 rootKLast = Math.sqrt(_kLast);
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
        uint balance0 = IERC20(token0).balanceOf(address(this));
        uint balance1 = IERC20(token1).balanceOf(address(this));
        uint amount0 = balance0.sub(_reserve0);
        uint amount1 = balance1.sub(_reserve1);

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        if (_totalSupply == 0) {
            address migrator = ISakeSwapFactory(factory).migrator();
            if (msg.sender == migrator) {
                liquidity = IMigrator(migrator).desiredLiquidity();
                require(liquidity > 0 && liquidity != uint256(-1), "SakeSwap: Bad desired liquidity");
            } else {
                require(migrator == address(0), "SakeSwap: Must not have migrator");
                liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
                _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
            }
        } else {
            liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
        }
        require(liquidity > 0, "SakeSwap: INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(to, liquidity);

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
        emit Mint(msg.sender, amount0, amount1);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function burn(address to) external lock returns (uint256 amount0, uint256 amount1) {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        address _token0 = token0; // gas savings
        address _token1 = token1; // gas savings
        uint256 balance0 = IERC20(_token0).balanceOf(address(this));
        uint256 balance1 = IERC20(_token1).balanceOf(address(this));

        bool feeOn = _mintFee(_reserve0, _reserve1);
        {
            uint256 liquidity = balanceOf[address(this)];
            uint256 _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
            amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
            amount1 = liquidity.mul(balance1) / _totalSupply; // using balances ensures pro-rata distribution
            require(amount0 > 0 && amount1 > 0, "SakeSwap: INSUFFICIENT_LIQUIDITY_BURNED");
            _burn(address(this), liquidity);
        }
        _safeTransfer(_token0, to, amount0);
        _safeTransfer(_token1, to, amount1);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint256(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
        emit Burn(msg.sender, amount0, amount1, to);
    }

    function _updateVirtualPrice(uint112 _reserve0, uint112 _reserve1) internal {
        (uint256 _virtualPrice, uint32 _lastPriceTime) = getVirtualPrice();
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        if (_lastPriceTime < blockTimestamp) {
            uint256 currentPrice = uint256(UQ112x112.encode(_reserve1).uqdiv(_reserve0));
            uint256 timePassed = Math.min(DECAY_PERIOD, block.timestamp.sub(_lastPriceTime));
            uint256 timeRemain = DECAY_PERIOD.sub(timePassed);
            uint256 price = _virtualPrice.mul(timeRemain).add(currentPrice.mul(timePassed)) / (DECAY_PERIOD);
            virtualPrice = uint224(price);
            lastPriceTime = blockTimestamp;
        }
    }

    // this low-level function should be called from a contract which performs important safety checks
    function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes calldata data) external lock {
        require(amount0Out > 0 || amount1Out > 0, "SakeSwap: INSUFFICIENT_OUTPUT_AMOUNT");
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        require(amount0Out < _reserve0 && amount1Out < _reserve1, "SakeSwap: INSUFFICIENT_LIQUIDITY");

        uint256 balance0;
        uint256 balance1;
        {
            // scope for _token{0,1}, avoids stack too deep errors
            address _token0 = token0;
            address _token1 = token1;
            require(to != _token0 && to != _token1, "SakeSwap: INVALID_TO");
            if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
            if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
            if (data.length > 0) ISakeSwapCallee(to).SakeSwapCall(msg.sender, amount0Out, amount1Out, data);
            balance0 = IERC20(_token0).balanceOf(address(this));
            balance1 = IERC20(_token1).balanceOf(address(this));
        }
        uint256 amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, "SakeSwap: INSUFFICIENT_INPUT_AMOUNT");
        {
            // scope for reserve{0,1}Adjusted, avoids stack too deep errors
            uint256 balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
            uint256 balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));
            require(
                balance0Adjusted.mul(balance1Adjusted) >= uint256(_reserve0).mul(_reserve1).mul(1000**2),
                "SakeSwap: K"
            );
        }

        _updateVirtualPrice(_reserve0, _reserve1);
        _update(balance0, balance1, _reserve0, _reserve1);

        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    function _getToken0MarketPrice() internal view returns (uint256 price) {
        (uint256 _virtualPrice, uint32 _lastPriceTime) = getVirtualPrice();
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves();
        uint256 currentPrice = uint256(UQ112x112.encode(_reserve1).uqdiv(_reserve0));
        uint256 timePassed = Math.min(DECAY_PERIOD, block.timestamp.sub(_lastPriceTime));
        uint256 timeRemain = DECAY_PERIOD.sub(timePassed);
        price = _virtualPrice.mul(timeRemain).add(currentPrice.mul(timePassed)) / (DECAY_PERIOD);
    }

    function getTokenMarketPrice(address token) external view returns (uint256 price) {
        uint256 t0Price = _getToken0MarketPrice();
        token == token0 ? price = t0Price : price = UQ112.mul(UQ112) / t0Price;
    }

    function _getAmountOut(address token, uint256 amountIn, uint256 t0Price) internal view returns (uint256 _out) {
        uint256 amountInWithFee = amountIn.mul(997);
        if (token == token0) {
            uint256 numerator = amountInWithFee.mul(t0Price);
            uint256 denominator = UQ112.mul(1000);
            _out = numerator / denominator;
        } else {
            uint256 numerator = amountInWithFee.mul(UQ112);
            uint256 denominator = t0Price.mul(1000);
            _out = numerator / denominator;
        }
    }

    function _getAmountIn(address token, uint256 amountOut, uint256 t0Price) internal view returns (uint256 _in) {
        if (token == token0) {
            uint256 numerator = amountOut.mul(1000).mul(t0Price);
            uint256 denominator = UQ112.mul(997);
            _in = numerator / denominator;
        } else {
            uint256 numerator = amountOut.mul(1000).mul(UQ112);
            uint256 denominator = t0Price.mul(997);
            _in = numerator / denominator;
        }
    }

    function getAmountOutMarket(address token, uint256 amountIn) public view returns (uint256 _out, uint256 t0Price) {
        t0Price = _getToken0MarketPrice();
        _out = _getAmountOut(token, amountIn, t0Price);
    }

    function getAmountInMarket(address token, uint256 amountOut) public view returns (uint256 _in, uint256 t0Price) {
        t0Price = _getToken0MarketPrice();
        _in = _getAmountIn(token, amountOut, t0Price);
    }

    function getAmountOutPool(address token, uint256 amountIn) public view returns (uint256 _out, uint256 t0Price) {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves();
        t0Price = uint256(UQ112x112.encode(_reserve1).uqdiv(_reserve0));
        _out = _getAmountOut(token, amountIn, t0Price);
    }

    function getAmountInPool(address token, uint256 amountOut) public view returns (uint256 _in, uint256 t0Price) {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves();
        t0Price = uint256(UQ112x112.encode(_reserve1).uqdiv(_reserve0));
        _in = _getAmountIn(token, amountOut, t0Price);
    }

    function getAmountOutReal(uint256 amountIn, uint256 _reserveIn, uint256 _reserveOut) internal pure returns (uint256 _out) {
        uint256 amountInWithFee = amountIn.mul(997);
        uint256 numerator = amountInWithFee.mul(_reserveOut);
        uint256 denominator = _reserveIn.mul(1000).add(amountInWithFee);
        _out = numerator / denominator;
    }

    function getAmountInReal(uint256 amountOut, uint256 _reserveIn, uint256 _reserveOut) internal pure returns (uint256 _in) {
        uint256 numerator = _reserveIn.mul(amountOut).mul(1000);
        uint256 denominator = _reserveOut.sub(amountOut).mul(997);
        _in = (numerator / denominator).add(1);
    }

    function getAmountOutFinal(address token, uint256 amountIn) external view returns (uint256 amountOut, uint256 stokenAmount) {
        address _token0 = token0;
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        (uint256 _reserveIn, uint256 _reserveOut) = token == _token0 ? (_reserve0, _reserve1) : (_reserve1, _reserve0);

        uint256 amountOutReal = getAmountOutReal(amountIn, _reserveIn, _reserveOut);
        (uint256 amountOutMarket, ) = getAmountOutMarket(token, amountIn);
        amountOut = amountOutReal;

        // arbitrager
        if (amountOutReal > amountOutMarket) {
            uint256 slippage = amountOutReal.sub(amountOutMarket);
            uint256 halfSlippage = slippage / 2;
            amountOut = amountOutReal.sub(halfSlippage);
        }

        (uint256 amountOutPool, uint256 t0Price) = getAmountOutPool(token, amountIn);
        uint256 slippage = amountOutPool.sub(amountOutReal);
        stokenAmount = token == _token0 ? slippage : slippage.mul(t0Price) / UQ112;
    }

    function getAmountInFinal(address token, uint256 amountOut) external view returns (uint256 amountIn, uint256 stokenAmount) {
        address _token0 = token0;
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        (uint256 _reserveIn, uint256 _reserveOut) = token == _token0 ? (_reserve1, _reserve0) : (_reserve0, _reserve1);

        uint256 amountInReal = getAmountInReal(amountOut, _reserveIn, _reserveOut);
        (uint256 amountInMarket, ) = getAmountInMarket(token, amountOut);
        amountIn = amountInReal;

        // arbitrager
        if (amountInReal < amountInMarket) {
            uint256 slippage = amountInMarket.sub(amountInReal);
            uint256 extra = slippage / 2;
            amountIn = amountInReal.add(extra);
        }

        (uint256 amountInPool, uint256 t0Price) = getAmountInPool(token, amountOut);
        uint256 slippage = amountInReal.sub(amountInPool);
        stokenAmount = token == _token0 ? slippage : slippage.mul(t0Price) / UQ112;
    }

    function dealSlippageWithIn(address[] calldata path, uint256 amountIn, address to, bool ifmint) external lock returns (uint256 amountOut) {
        require(path.length == 2, "SakeSwap: INVALID_PATH");
        address _token0 = token0;
        uint256 amountOutReal;
        uint256 amountOutMarket;

        // avoids stack too deep errors
        {
            (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
            (uint256 _reserveIn, uint256 _reserveOut) = path[0] == _token0
                ? (_reserve0, _reserve1)
                : (_reserve1, _reserve0);
            amountOutReal = getAmountOutReal(amountIn, _reserveIn, _reserveOut);
            amountOut = amountOutReal;
            (amountOutMarket, ) = getAmountOutMarket(path[0], amountIn);
            uint256 balance = IERC20(path[0]).balanceOf(address(this));
            uint256 amount = balance.sub(_reserveIn);
            require(amount >= amountIn, "SakeSwap: Invalid Amount");
        }

        // arbitrager
        if (amountOutReal > amountOutMarket) {
            uint256 slippageExtra = amountOutReal.sub(amountOutMarket);
            uint256 halfSlippage = slippageExtra / 2;
            amountOut = amountOutReal.sub(halfSlippage);
        }

        if (ifmint == true) {
            (uint256 amountOutPool, uint256 t0Price) = getAmountOutPool(path[0], amountIn);
            uint256 slippage = amountOutPool.sub(amountOutReal);
            uint256 mintAmount = path[1] == _token0 ? slippage.mul(t0Price) / UQ112 : slippage;
            stoken.mint(to, mintAmount);
        }
    }

    function dealSlippageWithOut(address[] calldata path, uint256 amountOut, address to, bool ifmint) external lock returns (uint256 extra) {
        require(path.length == 2, "SakeSwap: INVALID_PATH");
        address _token0 = token0;
        uint256 amountInReal;
        uint256 amountInMarket;

        // avoids stack too deep errors
        {
            (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
            (uint256 _reserveIn, uint256 _reserveOut) = path[0] == _token0
                ? (_reserve0, _reserve1)
                : (_reserve1, _reserve0);
            amountInReal = getAmountInReal(amountOut, _reserveIn, _reserveOut);
            (amountInMarket, ) = getAmountInMarket(path[1], amountOut);
        }

        // arbitrager
        if (amountInReal < amountInMarket) {
            uint256 slippageExtra = amountInMarket.sub(amountInReal);
            extra = slippageExtra / 2;
        }

        if (ifmint == true) {
            (uint256 amountInPool, uint256 t0Price) = getAmountInPool(path[1], amountOut);
            uint256 slippage = amountInReal.sub(amountInPool);
            uint256 mintAmount = path[0] == _token0 ? slippage.mul(t0Price) / UQ112 : slippage;
            stoken.mint(to, mintAmount);
        }
    }

    // force balances to match reserves
    function skim(address to) external lock {
        address _token0 = token0; // gas savings
        address _token1 = token1; // gas savings
        _safeTransfer(_token0, to, IERC20(_token0).balanceOf(address(this)).sub(reserve0));
        _safeTransfer(_token1, to, IERC20(_token1).balanceOf(address(this)).sub(reserve1));
    }

    // force reserves to match balances
    function sync() external lock {
        _update(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)), reserve0, reserve1);
    }
}
