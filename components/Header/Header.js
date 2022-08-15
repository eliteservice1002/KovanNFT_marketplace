import React from 'react';
import NextLink from "next/link";
import { useEffect, useState } from 'react'
import Web3Modal from "web3modal";
import { useSelector, useDispatch } from 'react-redux';
import { setWalletAddressAction, setAdminAction, readAdminsAction } from '../../store/action';
import { ethers } from 'ethers'
import { stringCmp } from '../../lib/utility';
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import {
    nftaddress,
    nftmarketaddress
} from '../../config'

export default function Header() {

    const [walletAddress, setWalletAddress] = useState('');
    const walletAdd = useSelector(state => state.walletAddress);
    const admins = useSelector(state => state.admins);
    const dispatch = useDispatch();

    useEffect(async () => {
        // dispatch(setWalletAddressAction({walletAddress: 'second'}))
        // alert(walletAdd)
        let add = walletAdd
        if (add != '') {
            setWalletAddress(add.replace('0x', '').substring(0, 8));
        }
    }, [])

    async function connect() {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        // console.log(connection.selectedAddress)
        if (!connection) return;
        if (!connection.selectedAddress) return;
        let add = connection.selectedAddress;
        dispatch(setWalletAddressAction({ walletAddress: add }))
        setWalletAddress(add.replace('0x', '').substring(0, 8));
        dispatch(readAdminsAction());
        // const provider = new ethers.providers.Web3Provider(connection)
        // const signer = provider.getSigner()
        // var contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        // let admins = await contract.getAdmins();
        // console.log(admins);
        // admins.map((v, ind) => {
        //     dispatch(setAdminAction({ ind, admin: v }))
        // })
    }
    function isAdmin(admins, mine){
        for(var i=0; i<admins.length; i++){
            var included = stringCmp(mine, admins[i]);
            if(included) return true;
        }
        return false;
    }
    return (
        <header id="header">
            {/* Navbar */}
            {/* {walletAdd} */}
            <nav data-aos="zoom-out" data-aos-delay={800} className="navbar navbar-expand">
                <div className="container header">
                    {/* Navbar Brand*/}
                    <NextLink href="/">
                        <a className="navbar-brand">
                            <img className="navbar-brand-sticky" src="img/logo.png" alt="sticky brand-logo" />
                        </a>
                    </NextLink>
                    <div className="ml-auto" />
                    {/* Navbar */}
                    <ul className="navbar-nav items mx-auto">
                        <li className="nav-item dropdown">
                            <NextLink href="/">
                                <a className="nav-link">Home</a>
                            </NextLink>
                        </li>
                        <li className="nav-item dropdown">
                            <NextLink href="/explore">
                                <a className="nav-link">Explore</a>
                            </NextLink>
                        </li>
                        <li className="nav-item dropdown">
                            <NextLink href="/create">
                                <a className="nav-link">Create NFT</a>
                            </NextLink>
                        </li>
                        <li className="nav-item dropdown">
                            <NextLink href="/inventory">
                                <a className="nav-link">My Inventory</a>
                            </NextLink>
                        </li>
                        <li className="nav-item dropdown">
                            <NextLink href="/mylist">
                                <a className="nav-link">My List</a>
                            </NextLink>
                        </li>
                        <li className="nav-item dropdown">
                            <NextLink href="/">
                                <a className="nav-link">Contact</a>
                            </NextLink>
                        </li>
                        {(stringCmp(walletAdd, admins[0])) && (
                            <li className="nav-item dropdown">
                                <NextLink href="/addAdmin">
                                    <a className="nav-link" style={{color:"red"}}>Add Managers</a>
                                </NextLink>
                            </li>
                        )}
                        {(isAdmin(admins, walletAdd)) && (
                            <li className="nav-item dropdown">
                                <NextLink href="/cancelAnyList">
                                    <a className="nav-link" style={{color:"red"}}>Cancel List</a>
                                </NextLink>
                            </li>
                        )}



                    </ul>
                    {/* Navbar Icons */}
                    {/* <ul className="navbar-nav icons">
                        <li className="nav-item">
                            <a  className="nav-link" data-toggle="modal" data-target="#search">
                                <i className="fas fa-search" />
                            </a>
                        </li>
                    </ul> */}
                    {/* Navbar Toggler */}
                    {/* <ul className="navbar-nav toggle">
                        <li className="nav-item">
                            <a href="#" className="nav-link" data-toggle="modal" data-target="#menu">
                                <i className="fas fa-bars toggle-icon m-0" />
                            </a>
                        </li>
                    </ul> */}
                    {/* Navbar Action Button */}
                    <ul className="navbar-nav action">
                        {(walletAddress == '') && (
                            <li className="nav-item ml-3">
                                <a className="btn ml-lg-auto btn-bordered-white" onClick={connect}><i className="icon-wallet mr-md-2" />Wallet Connect</a>
                            </li>
                        )}
                        {(walletAddress != '') && (
                            <li className="nav-item dropdown">
                                <a className="nav-link" style={{ color: 'gray' }}>{walletAddress}</a>
                            </li>
                        )}
                        {/* <li className="nav-item ml-3">
                            <a className="btn ml-lg-auto btn-bordered-white" onClick={connect}><i className="icon-wallet mr-md-2" />{(walletAddress =='')?'Wallet Connect':'Reconnect wallet'}</a>
                        </li> */}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

