//SPDX-License-Identifier: <SPDX-License>
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./NFTMarket.sol";
contract NFT is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    NFTMarket nftMarket;
    uint256 listingPrice;
    constructor() ERC721("Metaverse Tokens", "METT"){
        nftMarket = new NFTMarket();
        contractAddress = address(nftMarket);
        listingPrice = nftMarket.getListingPrice();
    }
    function getListingPrice() public view returns (uint256){
        return listingPrice;
    }
    function getMarketAddress() public view returns (address){
        return address(nftMarket);
        //return block.timestamp;
    }
    function createToken(string memory tokenURI, uint256 price, uint256 auctionInterval) public payable  returns (uint){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        nftMarket.createMarketItem{value:msg.value}(msg.sender, contractAddress, newItemId, price, auctionInterval);
        return newItemId;
    }
}