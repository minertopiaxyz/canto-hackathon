// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Interface.sol";

contract CantoHackathon {
    uint256 MAX_UINT = 2 ** 256 - 1;

    // testnet
    address public addressFactory = 0x760a17e00173339907505B38F95755d28810570C;
    address public addressRouter = 0x463e7d4DF8fE5fb42D024cb57c77b76e6e74417a;
    address public addressCNote = 0x04E52476d318CdF739C38BD41A922787D441900c;

    // mainnet
    // address public addressFactory = 0xE387067f12561e579C5f7d4294f51867E0c1cFba;
    // address public addressRouter = 0xa252eEE9BDe830Ca4793F054B506587027825a8e;
    // address public addressCNote = 0xEe602429Ef7eCe0a13e4FfE8dBC16e101049504C;

    address public addressDeployer;
    address public addressNote;
    address public addressLP;
    address public addressToken;
    address public addressThePark;
    address public addressPetShop;

    uint8 public step;
    uint256 public oneYear;

    constructor(address _token, address _petShop, address _thePark) {
        oneYear = block.timestamp + (365 * 24 * 3600);
        addressDeployer = msg.sender;
        addressNote = CToken(addressCNote).underlying();
        addressToken = _token;
        addressPetShop = _petShop;
        addressThePark = _thePark;

        // lets create LP token !!
        addressLP = IFactory(addressFactory).createPair(
            addressToken,
            addressNote,
            false
        );
    }

    function setupStep1() public {
        require(step == 0, "invalid step");
        step = 1;

        uint256 total = IERC20(addressToken).totalSupply();
        // retrieve all supply in this contract
        IERC20(addressToken).transferFrom(msg.sender, address(this), total);

        uint256 pctg = total / 100; // 1% of total supply
        IERC20(addressToken).transfer(addressPetShop, 33 * pctg); // 33% reward for note staker
        IERC20(addressToken).transfer(addressThePark, 33 * pctg); // 33% reward for lptoken staker
        IPetShop(addressPetShop).init(
            addressNote,
            addressToken,
            addressCNote,
            addressRouter
        );
        IThePark(addressThePark).init(addressLP, addressToken);
    }

    function setupStep2() public {
        require(step == 1);
        step = 2;

        // send some note to this contract for initial liquidity !!
        uint256 liquidityNote = IERC20(addressNote).balanceOf(address(this));
        uint256 liquidityToken = IERC20(addressToken).balanceOf(address(this)); // remaining supply for liquidity

        IERC20(addressToken).approve(addressRouter, MAX_UINT);
        IERC20(addressNote).approve(addressRouter, MAX_UINT);

        // lets set initial liquidity !!
        IRouter(addressRouter).addLiquidity(
            addressToken,
            addressNote,
            false,
            liquidityToken,
            liquidityNote,
            1,
            1,
            msg.sender,
            block.timestamp
        );
    }
}
