// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./StakingRewards.sol";

contract ThePark is StakingRewards {
    bool public initialized;

    function init(address _lp, address _token) public {
        require(!initialized, "initialized");
        initialized = true;
        uint256 oneYear = 365 * 24 * 3600;
        startStaking(_lp, _token, oneYear);
    }
}
