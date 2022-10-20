// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "../../interfaces/IBentoBoxMinimal.sol";
import "../../interfaces/IMasterDeployer.sol";
import "../../interfaces/IPool.sol";
import "../../interfaces/ITridentCallee.sol";
import "@rari-capital/solmate/src/tokens/ERC20.sol";
import "@rari-capital/solmate/src/utils/ReentrancyGuard.sol";

/// @notice Trident exchange pool template with constant mean formula for swapping among an array of ERC-20 tokens.
/// @dev The reserves are stored as bento shares.
///      The curve is applied to shares as well. This pool does not care about the underlying amounts.
contract IndexPool is IPool, ERC20, ReentrancyGuard {
    event Mint(address indexed sender, address tokenIn, uint256 amountIn, address indexed recipient);
    event Burn(address indexed sender, address tokenOut, uint256 amountOut, address indexed recipient);

    uint256 public immutable swapFee;

    address public immutable barFeeTo;
    IBentoBoxMinimal public immutable bento;
    IMasterDeployer public immutable masterDeployer;

    uint256 internal constant BASE = 10**18;
    uint256 internal constant MIN_TOKENS = 2;
    uint256 internal constant MAX_TOKENS = 8;
    uint256 internal constant MIN_FEE = BASE / 10**6;
    uint256 internal constant MAX_FEE = BASE / 10;
    uint256 internal constant MIN_WEIGHT = BASE;
    uint256 internal constant MAX_WEIGHT = BASE * 50;
    uint256 internal constant MAX_TOTAL_WEIGHT = BASE * 50;
    uint256 internal constant MIN_BALANCE = BASE / 10**12;
    uint256 internal constant INIT_POOL_SUPPLY = BASE * 100;
    uint256 internal constant MIN_POW_BASE = 1;
    uint256 internal constant MAX_POW_BASE = (2 * BASE) - 1;
    uint256 internal constant POW_PRECISION = BASE / 10**10;
    uint256 internal constant MAX_IN_RATIO = BASE / 2;
    uint256 internal constant MAX_OUT_RATIO = (BASE / 3) + 1;

    uint136 internal totalWeight;
    address[] internal tokens;

    uint256 public barFee;

    bytes32 public constant override poolIdentifier = "Trident:Index";

    mapping(address => Record) public records;
    struct Record {
        uint120 reserve;
        uint136 weight;
    }

    constructor(bytes memory _deployData, address _masterDeployer) ERC20("Sushi LP Token", "SLP", 18) {
        (address[] memory _tokens, uint136[] memory _weights, uint256 _swapFee) = abi.decode(_deployData, (address[], uint136[], uint256));
        // @dev Factory ensures that the tokens are sorted.
        require(_tokens.length == _weights.length, "INVALID_ARRAYS");
        require(MIN_FEE <= _swapFee && _swapFee <= MAX_FEE, "INVALID_SWAP_FEE");
        require(MIN_TOKENS <= _tokens.length && _tokens.length <= MAX_TOKENS, "INVALID_TOKENS_LENGTH");

        for (uint256 i = 0; i < _tokens.length; i++) {
            require(_tokens[i] != address(0), "ZERO_ADDRESS");
            require(MIN_WEIGHT <= _weights[i] && _weights[i] <= MAX_WEIGHT, "INVALID_WEIGHT");
            records[_tokens[i]] = Record({reserve: 0, weight: _weights[i]});
            tokens.push(_tokens[i]);
            totalWeight += _weights[i];
        }

        require(totalWeight <= MAX_TOTAL_WEIGHT, "MAX_TOTAL_WEIGHT");
        // @dev This burns initial LP supply.
        _mint(address(0), INIT_POOL_SUPPLY);

        swapFee = _swapFee;
        barFee = IMasterDeployer(_masterDeployer).barFee();
        barFeeTo = IMasterDeployer(_masterDeployer).barFeeTo();
        bento = IBentoBoxMinimal(IMasterDeployer(_masterDeployer).bento());
        masterDeployer = IMasterDeployer(_masterDeployer);
    }

    /// @dev Mints LP tokens - should be called via the router after transferring `bento` tokens.
    /// The router must ensure that sufficient LP tokens are minted by using the return value.
    function mint(bytes calldata data) public override nonReentrant returns (uint256 liquidity) {
        (address recipient, uint256 toMint) = abi.decode(data, (address, uint256));

        uint120 ratio = uint120(_div(toMint, totalSupply));

        for (uint256 i = 0; i < tokens.length; i++) {
            address tokenIn = tokens[i];
            uint120 reserve = records[tokenIn].reserve;
            // @dev If token balance is '0', initialize with `ratio`.
            uint120 amountIn = reserve != 0 ? uint120(_mul(ratio, reserve)) : ratio;
            require(amountIn >= MIN_BALANCE, "MIN_BALANCE");
            // @dev Check Trident router has sent `amountIn` for skim into pool.
            unchecked {
                // @dev This is safe from overflow - only logged amounts handled.
                require(_balance(tokenIn) >= amountIn + reserve, "NOT_RECEIVED");
                records[tokenIn].reserve += amountIn;
            }
            emit Mint(msg.sender, tokenIn, amountIn, recipient);
        }
        _mint(recipient, toMint);
        liquidity = toMint;
    }

    /// @dev Burns LP tokens sent to this contract. The router must ensure that the user gets sufficient output tokens.
    function burn(bytes calldata data) public override nonReentrant returns (IPool.TokenAmount[] memory withdrawnAmounts) {
        (address recipient, bool unwrapBento, uint256 toBurn) = abi.decode(data, (address, bool, uint256));

        uint256 ratio = _div(toBurn, totalSupply);

        withdrawnAmounts = new TokenAmount[](tokens.length);

        _burn(address(this), toBurn);

        for (uint256 i = 0; i < tokens.length; i++) {
            address tokenOut = tokens[i];
            uint256 balance = records[tokenOut].reserve;
            uint120 amountOut = uint120(_mul(ratio, balance));
            require(amountOut != 0, "ZERO_OUT");
            // @dev This is safe from underflow - only logged amounts handled.
            unchecked {
                records[tokenOut].reserve -= amountOut;
            }
            _transfer(tokenOut, amountOut, recipient, unwrapBento);
            withdrawnAmounts[i] = TokenAmount({token: tokenOut, amount: amountOut});
            emit Burn(msg.sender, tokenOut, amountOut, recipient);
        }
    }

    /// @dev Burns LP tokens sent to this contract and swaps one of the output tokens for another
    /// - i.e., the user gets a single token out by burning LP tokens.
    function burnSingle(bytes calldata data) public override nonReentrant returns (uint256 amountOut) {
        (address tokenOut, address recipient, bool unwrapBento, uint256 toBurn) = abi.decode(data, (address, address, bool, uint256));

        Record storage outRecord = records[tokenOut];

        amountOut = _computeSingleOutGivenPoolIn(outRecord.reserve, outRecord.weight, totalSupply, totalWeight, toBurn, swapFee);

        require(amountOut <= _mul(outRecord.reserve, MAX_OUT_RATIO), "MAX_OUT_RATIO");
        // @dev This is safe from underflow - only logged amounts handled.
        unchecked {
            outRecord.reserve -= uint120(amountOut);
        }
        _burn(address(this), toBurn);
        _transfer(tokenOut, amountOut, recipient, unwrapBento);
        emit Burn(msg.sender, tokenOut, amountOut, recipient);
    }

    /// @dev Swaps one token for another. The router must prefund this contract and ensure there isn't too much slippage.
    function swap(bytes calldata data) public override nonReentrant returns (uint256 amountOut) {
        (address tokenIn, address tokenOut, address recipient, bool unwrapBento, uint256 amountIn) = abi.decode(
            data,
            (address, address, address, bool, uint256)
        );

        Record storage inRecord = records[tokenIn];
        Record storage outRecord = records[tokenOut];

        require(amountIn <= _mul(inRecord.reserve, MAX_IN_RATIO), "MAX_IN_RATIO");

        amountOut = _getAmountOut(amountIn, inRecord.reserve, inRecord.weight, outRecord.reserve, outRecord.weight);
        // @dev Check Trident router has sent `amountIn` for skim into pool.
        unchecked {
            // @dev This is safe from under/overflow - only logged amounts handled.
            require(_balance(tokenIn) >= amountIn + inRecord.reserve, "NOT_RECEIVED");
            inRecord.reserve += uint120(amountIn);
            outRecord.reserve -= uint120(amountOut);
        }
        _transfer(tokenOut, amountOut, recipient, unwrapBento);
        emit Swap(recipient, tokenIn, tokenOut, amountIn, amountOut);
    }

    /// @dev Swaps one token for another. The router must support swap callbacks and ensure there isn't too much slippage.
    function flashSwap(bytes calldata data) public override nonReentrant returns (uint256 amountOut) {
        (address tokenIn, address tokenOut, address recipient, bool unwrapBento, uint256 amountIn, bytes memory context) = abi.decode(
            data,
            (address, address, address, bool, uint256, bytes)
        );

        Record storage inRecord = records[tokenIn];
        Record storage outRecord = records[tokenOut];

        require(amountIn <= _mul(inRecord.reserve, MAX_IN_RATIO), "MAX_IN_RATIO");

        amountOut = _getAmountOut(amountIn, inRecord.reserve, inRecord.weight, outRecord.reserve, outRecord.weight);

        ITridentCallee(msg.sender).tridentSwapCallback(context);
        // @dev Check Trident router has sent `amountIn` for skim into pool.
        unchecked {
            // @dev This is safe from under/overflow - only logged amounts handled.
            require(_balance(tokenIn) >= amountIn + inRecord.reserve, "NOT_RECEIVED");
            inRecord.reserve += uint120(amountIn);
            outRecord.reserve -= uint120(amountOut);
        }
        _transfer(tokenOut, amountOut, recipient, unwrapBento);
        emit Swap(recipient, tokenIn, tokenOut, amountIn, amountOut);
    }

    /// @dev Updates `barFee` for Trident protocol.
    function updateBarFee() public {
        barFee = IMasterDeployer(masterDeployer).barFee();
    }

    function _balance(address token) internal view returns (uint256 balance) {
        balance = bento.balanceOf(token, address(this));
    }

    function _getAmountOut(
        uint256 tokenInAmount,
        uint256 tokenInBalance,
        uint256 tokenInWeight,
        uint256 tokenOutBalance,
        uint256 tokenOutWeight
    ) internal view returns (uint256 amountOut) {
        uint256 weightRatio = _div(tokenInWeight, tokenOutWeight);
        // @dev This is safe from under/overflow - only logged amounts handled.
        unchecked {
            uint256 adjustedIn = _mul(tokenInAmount, (BASE - swapFee));
            uint256 a = _div(tokenInBalance, tokenInBalance + adjustedIn);
            uint256 b = _compute(a, weightRatio);
            uint256 c = BASE - b;
            amountOut = _mul(tokenOutBalance, c);
        }
    }

    function _compute(uint256 base, uint256 exp) internal pure returns (uint256 output) {
        require(MIN_POW_BASE <= base && base <= MAX_POW_BASE, "INVALID_BASE");

        uint256 whole = (exp / BASE) * BASE;
        uint256 remain = exp - whole;
        uint256 wholePow = _pow(base, whole / BASE);

        if (remain == 0) output = wholePow;

        uint256 partialResult = _powApprox(base, remain, POW_PRECISION);
        output = _mul(wholePow, partialResult);
    }

    function _computeSingleOutGivenPoolIn(
        uint256 tokenOutBalance,
        uint256 tokenOutWeight,
        uint256 _totalSupply,
        uint256 _totalWeight,
        uint256 toBurn,
        uint256 _swapFee
    ) internal pure returns (uint256 amountOut) {
        uint256 normalizedWeight = _div(tokenOutWeight, _totalWeight);
        uint256 newPoolSupply = _totalSupply - toBurn;
        uint256 poolRatio = _div(newPoolSupply, _totalSupply);
        uint256 tokenOutRatio = _pow(poolRatio, _div(BASE, normalizedWeight));
        uint256 newBalanceOut = _mul(tokenOutRatio, tokenOutBalance);
        uint256 tokenAmountOutBeforeSwapFee = tokenOutBalance - newBalanceOut;
        uint256 zaz = (BASE - normalizedWeight) * _swapFee;
        amountOut = _mul(tokenAmountOutBeforeSwapFee, (BASE - zaz));
    }

    function _pow(uint256 a, uint256 n) internal pure returns (uint256 output) {
        output = n % 2 != 0 ? a : BASE;
        for (n /= 2; n != 0; n /= 2) a = a * a;
        if (n % 2 != 0) output = output * a;
    }

    function _powApprox(
        uint256 base,
        uint256 exp,
        uint256 precision
    ) internal pure returns (uint256 sum) {
        uint256 a = exp;
        (uint256 x, bool xneg) = _subFlag(base, BASE);
        uint256 term = BASE;
        sum = term;
        bool negative;

        for (uint256 i = 1; term >= precision; i++) {
            uint256 bigK = i * BASE;
            (uint256 c, bool cneg) = _subFlag(a, (bigK - BASE));
            term = _mul(term, _mul(c, x));
            term = _div(term, bigK);
            if (term == 0) break;
            if (xneg) negative = !negative;
            if (cneg) negative = !negative;
            if (negative) {
                sum = sum - term;
            } else {
                sum = sum + term;
            }
        }
    }

    function _subFlag(uint256 a, uint256 b) internal pure returns (uint256 difference, bool flag) {
        // @dev This is safe from underflow - if/else flow performs checks.
        unchecked {
            if (a >= b) {
                (difference, flag) = (a - b, false);
            } else {
                (difference, flag) = (b - a, true);
            }
        }
    }

    function _mul(uint256 a, uint256 b) internal pure returns (uint256 c2) {
        uint256 c0 = a * b;
        uint256 c1 = c0 + (BASE / 2);
        c2 = c1 / BASE;
    }

    function _div(uint256 a, uint256 b) internal pure returns (uint256 c2) {
        uint256 c0 = a * BASE;
        uint256 c1 = c0 + (b / 2);
        c2 = c1 / b;
    }

    function _transfer(
        address token,
        uint256 shares,
        address to,
        bool unwrapBento
    ) internal {
        if (unwrapBento) {
            bento.withdraw(token, address(this), to, 0, shares);
        } else {
            bento.transfer(token, address(this), to, shares);
        }
    }

    function getAssets() public view override returns (address[] memory assets) {
        assets = tokens;
    }

    function getAmountOut(bytes calldata data) public view override returns (uint256 amountOut) {
        (uint256 tokenInAmount, uint256 tokenInBalance, uint256 tokenInWeight, uint256 tokenOutBalance, uint256 tokenOutWeight) = abi
            .decode(data, (uint256, uint256, uint256, uint256, uint256));
        amountOut = _getAmountOut(tokenInAmount, tokenInBalance, tokenInWeight, tokenOutBalance, tokenOutWeight);
    }

    function getAmountIn(bytes calldata) public pure override returns (uint256) {
        revert();
    }

    function getReservesAndWeights() public view returns (uint256[] memory reserves, uint136[] memory weights) {
        uint256 length = tokens.length;
        reserves = new uint256[](length);
        weights = new uint136[](length);
        // @dev This is safe from overflow - `tokens` `length` is bound to '8'.
        unchecked {
            for (uint256 i = 0; i < length; i++) {
                reserves[i] = records[tokens[i]].reserve;
                weights[i] = records[tokens[i]].weight;
            }
        }
    }
}
