pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TetherToken is ERC20 {


    constructor () ERC20("Token", "TKN") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }

    function decimals() public view virtual override returns (uint8) {
        return 9;
    }
}