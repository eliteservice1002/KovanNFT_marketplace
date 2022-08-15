const { expect } = require("chai");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    // console.log(ethers);
    //deploy nft market contract
    const all = await ethers.getSigners();
    all.map(v => {
      console.log(v.address)
    })
    const Token = await ethers.getContractFactory('TetherToken')
    const token = await Token.deploy()
    await token.deployed()
    const tokenAddress = token.address
    let ownerTokenBalance = await token.balanceOf(all[0].address);
    console.log('owner token balance = ', ownerTokenBalance);
    let seconderTokenBalance = await token.balanceOf(all[1].address);
    console.log('seconder  token balance = ', seconderTokenBalance);
    const Market = await ethers.getContractFactory('NFTMarket')
    const market = await Market.deploy(tokenAddress)
    await market.deployed()
    const marketAddress = market.address
    //deploy NFT contract
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;
    await token.approve(marketAddress, 10000000);
    await market.transferToken(all[0].address, all[1].address, 1000);
    ownerTokenBalance = await market.getTokenBalance(all[0].address);
    console.log('owner token balance = ', ownerTokenBalance);
    seconderTokenBalance = await market.getTokenBalance(all[1].address);
    console.log('seconder  token balance = ', seconderTokenBalance);


    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();
    console.log(listingPrice);
    
    let _time = await market.getTimeStamp();
    _time = _time.toString();
    
    console.log(_time);
    console.log('-----');
    console.log(Date.now())
    const auctionPrice = ethers.utils.parseUnits('100', 'ether')
    const bidPrice = ethers.utils.parseUnits('101', 'ether')
    // mint 3 NFTs
    await nft.createToken("token1");
    await nft.createToken("token2");
    await nft.createToken("token3");
    //deploy 2 tokens to market
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, 1111110, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, 0, {
      value: listingPrice,
    });
    //deploy 1 auction to market
    await market.createMarketItem(nftContractAddress, 3, auctionPrice, 100, {
      value: listingPrice,
    });
    await market.cancelListing( 2, { value: 0 });
    // const aa = await ethers.getSigners();
    // console.log(aa[0].address);
    // aa.map(a => console.log(a.address))
    const [_, buyerAddress] = await ethers.getSigners();
    // console.log(buyerAddress)
    //buy 1 NFT
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice });
    
    
    //buy 1 Auction item
    var ret = await market.connect(buyerAddress).createAuctionSale(3, { value: bidPrice });
    // console.log(ret)
    //list items
    const items = await market.fetchMarketItems();
    // console.log('items = ' + items);
    // items.map(item => {console.log(item)})
  });
});
