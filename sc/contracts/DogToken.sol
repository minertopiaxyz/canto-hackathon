// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./Interface.sol";

contract DogToken is ERC20Burnable {
    address public TURNSTILE = 0xEcf044C5B4b867CFda001101c617eCd347095B44;

    // testnet
    // address public WCANTO = 0x04a72466De69109889Db059Cb1A4460Ca0648d9D;
    // address public NOTE = 0x03F734Bd9847575fDbE9bEaDDf9C166F880B5E5f;
    // address public ROUTER = 0x463e7d4DF8fE5fb42D024cb57c77b76e6e74417a;

    // mainnet
    address public WCANTO = 0x826551890Dc65655a0Aceca109aB11AbDbD7a07B;
    address public NOTE = 0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503;
    address public ROUTER = 0xa252eEE9BDe830Ca4793F054B506587027825a8e;

    uint256 public turnstileNFTId;

    constructor() ERC20("Free Public Doge", "DOGF") {
        _mint(msg.sender, 21e27);
        turnstileNFTId = ITurnstile(TURNSTILE).register(address(this));
    }

    receive() external payable {}

    fallback() external payable {}

    function feeAvailable() public view returns (uint256) {
        return Turnstile(TURNSTILE).balances(turnstileNFTId);
    }

    function pumpPrice() public returns (uint256, uint256) {
        uint256 fee = feeAvailable();
        uint256 burned = 0;

        if (fee > 0) {
            // withdraw CANTO from CSR
            ITurnstile(TURNSTILE).withdraw(turnstileNFTId, payable(this), fee);

            // swap CANTO to TOKEN then burn !!
            uint256 amount = address(this).balance;
            address DEAD = 0x000000000000000000000000000000000000dEaD;
            IRouter.route[] memory routes = new IRouter.route[](2);
            routes[0] = IRouter.route(WCANTO, NOTE, false);
            routes[1] = IRouter.route(NOTE, address(this), false);
            IRouter(ROUTER).swapExactCANTOForTokens{value: amount}(
                1,
                routes,
                DEAD, // trick: send to no out address
                block.timestamp
            );

            burned = balanceOf(DEAD);
            _burn(DEAD, burned);
        }

        return (fee, burned);
    }
}
