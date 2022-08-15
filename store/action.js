import Web3Modal from "web3modal";
import { ethers } from 'ethers'
import { stringCmp } from '../lib/utility';
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import {
    nftaddress,
    nftmarketaddress
} from '../config'

export const setWalletAddressAction = payload => ({
    type: "setWalletAddress",
    payload
})

export const setAdminAction = (payload) => async (dispatch) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    var contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let transaction = await contract.setAdmin(payload.ind, payload.address);
    let tx = await transaction.wait();
    dispatch(readAdminsAction());
}
export const readAdminsAction = () => async (dispatch) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    var contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let admins = await contract.getAdmins();
    dispatch({
        type: 'readAdmins',
        payload: admins
    })
}