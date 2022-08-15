//SPDX-License-Identifier: <SPDX-License>
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";
import "./NFT.sol";



contract NFTMarket is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner;

    uint256 listingPrice = 0.025 ether;

    address tokenAddress;
    address[3] admins;
    // ERC20Basic token;
    constructor() {
        owner = payable(msg.sender);
        admins[0] = owner;

        // tokenAddress = _token;
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        bool isAuction;
        uint256 deadline;
        uint256 bidCount;
        Bid bid;
    }



    struct Bid {
        uint _time;
        address bidder;
        uint256 bidPrice;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );
    function getAdmins() public view returns (address[3] memory) {
        return admins;
    }
    function setAdmin(
        uint256 index,
        address admin
     ) public payable nonReentrant {
         require(index < 2, "index should be less than 2");
         require(msg.sender == owner, "Only owner can add admin");
         admins[index + 1] = admin;
    }
    function getTokenBalance(address account) public view returns (uint256){
        return IERC20(tokenAddress).balanceOf(account);
    }
    function transferToken(address sender, address recept, uint256 amount) public payable nonReentrant{
        console.log('super sender' , sender);
        IERC20(tokenAddress).transferFrom(sender, recept, amount);
    }
    function getListingPrice() public view returns (uint256){
        return listingPrice;
    }
    function getTimeStamp() public view returns (uint256){
        return block.timestamp;
        //return block.timestamp;
    }


    function createMarketItem(
        address _owner,
        address nftContract,
        uint256 tokenId,
        uint256 price,
        uint256 auctionInterval
     ) public payable  {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "price must be equal to listing price");
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        bool isAuction = auctionInterval > 0;
        uint256 currentTime = block.timestamp;
        uint256 deadline = 0;
        Bid memory bid;
        if(isAuction){
            bid._time = currentTime;
            bid.bidder = _owner;
            bid.bidPrice = price;
            deadline = currentTime + auctionInterval;
        }
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(_owner),
            payable(address(0)),
            price,
            false,
            isAuction,
            deadline,
            0,
            bid
        );

        // IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            _owner,
            address(0),
            price,
            false
        );        

    }

    function cancelListing(
        uint256 itemId
    ) public payable nonReentrant{
        // console.log("owner", idToMarketItem[itemId].seller );
        // console.log(msg.sender);
        require(idToMarketItem[itemId].seller == payable(msg.sender) || admins[0] == payable(msg.sender)|| admins[1] == payable(msg.sender)|| admins[2] == payable(msg.sender) , "Only owner can do this");
        require(idToMarketItem[itemId].isAuction == false, "Auction can't be canceled");
        idToMarketItem[itemId].sold = true;

    }

    function listItem(        
        uint256 itemId,
        uint256 price,
        uint256 auctionInterval
     ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "price must be equal to listing price");
        
        bool isAuction = auctionInterval > 0;
        uint256 currentTime = block.timestamp;
        uint256 deadline = 0;
        Bid memory bid;
        if(isAuction){
            bid._time = currentTime;
            bid.bidder = msg.sender;
            bid.bidPrice = price;
            deadline = currentTime + auctionInterval;
        }
        idToMarketItem[itemId].price = price;
        idToMarketItem[itemId].sold = false;
        idToMarketItem[itemId].isAuction = isAuction;
        idToMarketItem[itemId].deadline = deadline;
        idToMarketItem[itemId].bidCount = 0;
        idToMarketItem[itemId].bid = bid;   

    }

    function createMarketSale (
        address nftContract,
        uint256 itemId
     ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        require(msg.value == price, "please submit the asking price in order to complete to purchase");

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        idToMarketItem[itemId].seller = payable(msg.sender);
        idToMarketItem[itemId].isAuction = false;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    function createAuctionSale (
        uint256 itemId
     ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].bid.bidPrice;
        
        require(msg.value > price, "please submit the  price more than previouse bid");
        uint256 requestTime = block.timestamp;
        // console.log('eee');
        // console.log(requestTime);
        // console.log(idToMarketItem[itemId].deadline);
        require(requestTime < idToMarketItem[itemId].deadline, "Deadline expired");
        uint256  deltaPrice = msg.value - price;
        payable(idToMarketItem[itemId].bid.bidder).transfer(idToMarketItem[itemId].bid.bidPrice);
        payable(idToMarketItem[itemId].seller).transfer(deltaPrice);
        idToMarketItem[itemId].price = msg.value;
        idToMarketItem[itemId].bid._time = requestTime;
        idToMarketItem[itemId].bid.bidder = msg.sender;
        idToMarketItem[itemId].bid.bidPrice = msg.value;
        idToMarketItem[itemId].seller = payable(msg.sender);
        idToMarketItem[itemId].bidCount++;
    }
    
    function requestAuctionSale (
        address nftContract,
        uint256 itemId
     ) public payable nonReentrant {
        require(idToMarketItem[itemId].isAuction, "This is not for Auction");
        require(idToMarketItem[itemId].deadline < block.timestamp, "Auction is not ended");
        require(idToMarketItem[itemId].bid.bidder == msg.sender, "You are not a winner");
        // require(msg.value == listingPrice, "please submit the market fee");
        uint tokenId = idToMarketItem[itemId].tokenId;
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        idToMarketItem[itemId].isAuction = false;
        _itemsSold.increment();
    }
    
    function fetchMarketItems() public view returns (MarketItem[] memory){
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for(uint i=0; i< itemCount; i++){
            if (idToMarketItem[i+1].owner == address(0)){
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] =currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchAllItems() public view returns (MarketItem[] memory){
        uint itemCount = _itemIds.current();
       
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i=0; i< itemCount; i++){
            uint currentId = idToMarketItem[i + 1].itemId;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] =currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function fetchMyNFTS() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        for(uint i=0; i<totalItemCount; i++){
            if( idToMarketItem[i+1].owner == msg.sender){
                itemCount +=1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i=0; i<totalItemCount; i++){
            if( idToMarketItem[i+1].owner == msg.sender){
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }

    function fetchItemsCreated() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        for(uint i=0; i<totalItemCount; i++){
            if( idToMarketItem[i+1].seller == msg.sender){
                itemCount +=1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i=0; i<totalItemCount; i++){
            if( idToMarketItem[i+1].seller == msg.sender){
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }

    
}