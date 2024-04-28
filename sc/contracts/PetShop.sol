// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./StakingRewards.sol";
import "./Interface.sol";

// petshop is NOTE staking contract with token reward
// will added three functions:
// 1. on stake, NOTE will be converted to cnote in canto lending market
// 2. on unstake, cnote will be converted to NOTE and sent to user
// 3. yield/interest will be used to pump the price
contract PetShop is StakingRewards {
    bool public initialized;
    address public NOTE;
    address public TOKEN;
    address public CNOTE;
    address public ROUTER;
    uint256 public snapshot;

    function init(
        address _note,
        address _token,
        address _cNote,
        address _router
    ) public {
        require(!initialized, "initialized");
        initialized = true;

        // lets approve cnote
        NOTE = _note;
        TOKEN = _token;
        CNOTE = _cNote;
        ROUTER = _router;

        uint256 MAX_UINT = 2 ** 256 - 1;
        IERC20(NOTE).approve(CNOTE, MAX_UINT);
        IERC20(CNOTE).approve(CNOTE, MAX_UINT);
        IERC20(NOTE).approve(ROUTER, MAX_UINT);

        uint256 oneYear = 365 * 24 * 3600;
        startStaking(NOTE, TOKEN, oneYear);
    }

    function afterStake(uint256) internal virtual override {
        // the twist:
        // all NOTE staked converted to cnote in canto lending market
        ICToken(CNOTE).mint(IERC20(NOTE).balanceOf(address(this)));
    }

    function beforeUnstake(uint256 amount) internal virtual override {
        // convert cnote to NOTE !!
        ICToken(CNOTE).redeemUnderlying(amount);
    }

    // this !!
    // what make this dog unique !!
    function pumpPrice() public returns (uint256, uint256) {
        // all NOTE already invested as cnote
        // lets calculate the interest
        snapshot = ICToken(CNOTE).balanceOfUnderlying(address(this));

        uint256 interest = 0;
        if (snapshot > totalSupply) {
            interest = snapshot - totalSupply;
            ICToken(CNOTE).redeemUnderlying(interest);
        }

        uint256 burned = buyAndBurn();
        return (interest, burned);
    }

    function buyAndBurn() private returns (uint256) {
        uint256 noteAmount = IERC20(NOTE).balanceOf(address(this));
        uint256 burned = 0;

        if (noteAmount > 0) {
            // use the interest to buy token
            IRouter(ROUTER).swapExactTokensForTokensSimple(
                noteAmount,
                1,
                NOTE,
                TOKEN,
                false,
                address(this),
                block.timestamp
            );

            // burn the token just bought !!
            burned = IERC20(TOKEN).balanceOf(address(this));
            ERC20Burnable(TOKEN).burn(burned);
        }

        return (burned);
    }

    function snapshotInterest() public {
        snapshot = ICToken(CNOTE).balanceOfUnderlying(address(this));
    }
}
