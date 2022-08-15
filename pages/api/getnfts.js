import { ether_rpcurl } from "../../config";
import { nftaddress, nftmarketaddress } from "../../config";
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import { ethers } from 'ethers'
import axios from "axios";


export default async function handler(req, res) {
    const provider = new ethers.providers.JsonRpcProvider(
        ether_rpcurl
      );
      // console.log(provider);
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
      const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
      // const data = await marketContract.fetchMarketItems();
      const data = await marketContract.fetchAllItems();

      // console.log('market Items = ')
      // console.log(data)
      const items = await Promise.all(data.map(async i => {
        // console.log(i)
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // console.log(tokenUri)
        let meta = await axios.get(tokenUri);
        // console.log(meta)
        // meta = JSON.parse(meta);
        let price = ethers.utils.formatUnits(i.price, 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          category:meta.data.category,
          isAuction: i.isAuction,
          deadLine: i.deadline,
          bidCount: i.bidCount,
          bid: i.bid,
          isSold: i.sold,
          id: meta.data.id,
          bids: meta.data.bids
        }
        // console.log(item)
        return item;
      }))
      res.json(items);

}