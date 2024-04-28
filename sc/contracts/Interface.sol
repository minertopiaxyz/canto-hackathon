// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// based on https://github.com/Canto-Network/Canto/blob/main/contracts/turnstile.sol
interface ITurnstile {
    function register(address) external returns (uint256);

    function withdraw(
        uint256 _tokenId,
        address payable _recipient,
        uint256 _amount
    ) external returns (uint256);
}

contract Turnstile {
    mapping(uint256 => uint256) public balances;
}

interface IFactory {
    function allPairsLength() external view returns (uint256);

    function isPair(address pair) external view returns (bool);

    function pairCodeHash() external pure returns (bytes32);

    function getPair(
        address tokenA,
        address token,
        bool stable
    ) external view returns (address);

    function createPair(
        address tokenA,
        address tokenB,
        bool stable
    ) external returns (address);
}

interface IRouter {
    struct route {
        address from;
        address to;
        bool stable;
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        bool stable,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        );

    function swapExactTokensForTokensSimple(
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenFrom,
        address tokenTo,
        bool stable,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function getAmountOut(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external view returns (uint256 amount, bool stable);

    function swapExactCANTOForTokens(
        uint256 amountOutMin,
        route[] calldata routes,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function isPair(address pair) external view returns (bool);
}

// based on: https://github.com/Canto-Network/clm/blob/main/src/CTokenInterfaces.sol
// interface to interact with cnote !!
interface ICToken {
    function balanceOfUnderlying(address owner) external returns (uint256);

    function mint(uint256 mintAmount) external returns (uint256);

    function redeem(uint256 redeemTokens) external returns (uint256);

    function redeemUnderlying(uint256 redeemAmount) external returns (uint256);
}

contract CToken {
    address public underlying;
}

interface IDogToken {
    function init(uint256 _nftId) external;
}

interface IPetShop {
    function init(
        address _note,
        address _token,
        address _cNote,
        address _router
    ) external;
}

interface IThePark {
    function init(address _lp, address _token) external;
}
