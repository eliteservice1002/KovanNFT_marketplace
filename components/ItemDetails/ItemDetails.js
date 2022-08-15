import React, { Component } from 'react';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../../config";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import AuctionTimer from '../Explore/AuctionTimer';
import axios from 'axios';
const FormData = require("form-data");


const initData = {
    itemImg: "/img/auction_2.jpg",
    date: "2022-03-30",
    tab_1: "Bids",
    tab_2: "History",
    tab_3: "Details",
    ownerImg: "/img/avatar_1.jpg",
    itemOwner: "Themeland",
    created: "15 Jul 2021",
    title: "Walking On Air",
    content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum obcaecati dignissimos quae quo ad iste ipsum officiis deleniti asperiores sit.",
    price_1: "1.5 ETH",
    price_2: "$500.89",
    count: "1 of 5",
    size: "14000 x 14000 px",
    volume: "64.1",
    highest_bid: "2.9 BNB",
    bid_count: "1 of 5",
    btnText: "Place a Bid"
}

const tabData_1 = [
    {
        id: "1",
        img: "/img/avatar_1.jpg",
        price: "14 ETH",
        time: "4 hours ago",
        author: "@arham"
    },
    {
        id: "2",
        img: "/img/avatar_2.jpg",
        price: "10 ETH",
        time: "8 hours ago",
        author: "@junaid"
    },
    {
        id: "3",
        img: "/img/avatar_3.jpg",
        price: "12 ETH",
        time: "3 hours ago",
        author: "@yasmin"
    }
]

const tabData_2 = [
    {
        id: "1",
        img: "/img/avatar_6.jpg",
        price: "32 ETH",
        time: "10 hours ago",
        author: "@hasan"
    },
    {
        id: "2",
        img: "/img/avatar_7.jpg",
        price: "24 ETH",
        time: "6 hours ago",
        author: "@artnox"
    },
    {
        id: "3",
        img: "/img/avatar_8.jpg",
        price: "29 ETH",
        time: "12 hours ago",
        author: "@meez"
    }
]

const sellerData = [
    {
        id: "1",
        img: "/img/avatar_1.jpg",
        seller: "@ArtNoxStudio",
        post: "Creator"
    },
    {
        id: "2",
        img: "/img/avatar_2.jpg",
        seller: "Virtual Worlds",
        post: "Collection"
    }
]

export default function ItemDetails() {
    // state = {
    //     initData: {},
    //     tabData_1: [],
    //     tabData_2: [],
    //     sellerData: []
    // }
    const [item, setItem] = useState(null);
    const [bid, setBid] = useState(null);
    const [mybidprice, setMybidprice] = useState(0);
    const [bidpriceerror, setBidpriceerror] = useState('');
    const [auctionEnd, setAuctionEnd] = useState(false);
    const [block, setblock] = useState('none');
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', category: 'Art', isAuction: false, AuctionInterval: 0 })
    const router = useRouter()
    useEffect(async () => {
        let item = JSON.parse(localStorage.getItem("item"))
        console.log('===')
        console.log(item)
        setItem(item);
        setBid({
            bidder: item.bid[1],
            bidPrice: item.bid[2].hex,
            bidTime: item.bid[0].hex
        })
        let now = Math.floor(Date.now() / 1000);
        if (item.isAuction && !item.isSold && now > item.deadLine.hex) {
            setAuctionEnd(true);
        }
    }, [])

    // componentDidMount(){
    //     this.setState({
    //         initData: initData,
    //         tabData_1: tabData_1,
    //         tabData_2: tabData_2,
    //         sellerData: sellerData
    //     })
    // }
    function setAuction(e) {
        updateFormInput({
            ...formInput,
            isAuction: e.target.value == 'option2',
        })
    }
    async function detailaction(nft) {
        console.log(nft);
        // axios.post('/api/updatebid', {
        //     a: 1
        // })
        // return;
        switch (nft.buttonName) {
            case "Buy":
            case "Place a bid":
                await buyNft(nft);
                break;
            case "Cancel list":
                await cancelList(nft);
                break;
            case "List on market":
                await listItem(nft);
                break;

        }
    }

    async function listItem(nft) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()



        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        // listingPrice = BigNumber(listingPrice.toNumber);
        // alert(price)
        // console.log(price, list)
        console.log(ethers.BigNumber.from(listingPrice))
        let interval = Math.floor(formInput.AuctionInterval * 3600 * 24)
        // alert(formInput.AuctionInterval)
        try {
            let transaction = await contract.listItem(
                nft.tokenId, price, interval, { value: listingPrice }
            )
            await transaction.wait()
            router.push('/')
        } catch (e) {
            if (e.message?.includes('User denied')) {
                setblock('block');
            }
        }

    }

    async function cancelList(nft) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        // console.log(connection)
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();
        // console.log(signer)
        const contract = new ethers.Contract(
            nftmarketaddress,
            Market.abi,
            signer
        );

        const price = ethers.utils.parseUnits("0", "ether");
        console.log(nft)
        console.log('---------------')
        try {
            const transaction = await contract.cancelListing(
                nft.tokenId,
                {
                    value: price,
                }
            );
            console.log(transaction)
            await transaction.wait();
            router.push('/')
        } catch (e) {
            if (e.message?.includes('User denied')) {
                setblock('block');
            }
        }


    }

    async function placebid(nft) {


        // alert(mybidprice);return;
        // console.log(mybidprice, bid.bidPrice)
        // if(mybidprice<bid.bidPrice){
        //     setBidpriceerror("Bid price should be greater than previous bid");
        //     return;
        // }
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        // console.log(connection)
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();
        // console.log(signer)
        const contract = new ethers.Contract(
            nftmarketaddress,
            Market.abi,
            signer
        );

        const price = ethers.utils.parseUnits(mybidprice, "ether");
        console.log(nft)
        try {
            const transaction = await contract.createAuctionSale(
                nft.tokenId,
                {
                    value: price,
                }
            );
            await transaction.wait();
        } catch (e) {
            if (e.message?.includes('User denied')) {
                setblock('block');
            }
        }
        let now = Math.floor(Date.now() / 1000);
        const walletAddress = localStorage.getItem("walletAddress", '')

        await axios.post('/api/updatebid', {
            id: nft.id,
            bidder: walletAddress,
            bidAmount: mybidprice,
            bidTime: now
        })
        router.push('/')
    }
    function closeAlert() {
        setblock('none');
    }
    async function buyNft(nft) {
        // alert(mybidprice);return;
        if (nft.isAuction) {
            await placebid(nft);
            return;
        }
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        // console.log(connection)
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();
        // console.log(signer)
        const contract = new ethers.Contract(
            nftmarketaddress,
            Market.abi,
            signer
        );

        const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
        console.log(nft)
        try {
            const transaction = await contract.createMarketSale(
                nftaddress,
                nft.tokenId,
                {
                    value: price,
                }
            );
            await transaction.wait();
            router.push('/')
        } catch (e) {
            if (e.message?.includes('User denied')) {
                setblock('block');
            }
        }
    }



    async function RequestAuction(nft) {
        // alert(mybidprice);return;

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        // console.log(connection)
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();
        // console.log(signer)
        const contract = new ethers.Contract(
            nftmarketaddress,
            Market.abi,
            signer
        );


        console.log(nft)
        try {
            const transaction = await contract.requestAuctionSale(
                nftaddress,
                nft.tokenId,

            );
            await transaction.wait();
            router.push('/')
        } catch (e) {
            if (e.message?.includes('User denied')) {
                setblock('block');
            }
        }
    }
    if (item == null) return (<></>)
    return (
        <>
            <div className="modal" id="myModal" style={{ display: block }}>
                <div className="modal-dialog border border-white">
                    <div className="modal-content">


                        <div className="modal-header">
                            <h4 className="modal-title">Alert</h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={closeAlert}>&times;</button>
                        </div>


                        <div className="modal-body">
                            You rejected metamaks!
                        </div>


                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={closeAlert}>Close</button>
                        </div>

                    </div>
                </div>
            </div>
            <section className="item-details-area">
                <div>{auctionEnd}</div>
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-12 col-lg-5">
                            <div className="item-info">
                                <div className="item-thumb text-center">
                                    <img src={item.image} alt="" />
                                </div>
                                <AuctionTimer deadline={item.deadLine.hex} _type={2} />
                                {/* <div className="countdown-times my-4">
                                <div className="countdown d-flex justify-content-center" data-date="2022-01-24">
                                    <div className="countdown-container days"><span className="countdown-heading days-top">Days</span><span className="countdown-value days-bottom">143</span></div>
                                    <div className="countdown-container hours"><span className="countdown-heading hours-top">Hours</span><span className="countdown-value hours-bottom">21</span></div>
                                    <div className="countdown-container minutes"><span className="countdown-heading minutes-top">Minutes</span><span className="countdown-value minutes-bottom">53</span></div>
                                    <div className="countdown-container seconds"><span className="countdown-heading seconds-top">Seconds</span><span className="countdown-value seconds-bottom">24</span></div>
                                </div>
                            </div> */}
                                {/* Netstorm Tab */}
                                {item.isAuction && !item.isSold && (
                                    <>
                                        <ul className="netstorm-tab nav nav-tabs" id="nav-tab">
                                            <li>
                                                <a className="active" id="nav-home-tab" data-toggle="pill" href="#nav-home">
                                                    <h5 className="m-0">Bid History</h5>
                                                </a>
                                            </li>

                                        </ul>
                                        {/* Tab Content */}
                                        <div className="tab-content" id="nav-tabContent">
                                            <div className="tab-pane fade show active" id="nav-home">
                                                <ul className="list-unstyled">
                                                    {/* Single Tab List */}
                                                    {/* {this.state.tabData_1.map((item, idx) => {
                                            return ( */}
                                                    {(item.bids.count == 0) ? (
                                                        <li className="single-tab-list d-flex align-items-center">
                                                            <img className="avatar-sm rounded-circle mr-3" alt="" />
                                                            <p className="m-0">No Bids yet</p>
                                                        </li>
                                                    ) : (
                                                        item.bids.map((v, ind1) => (
                                                            <li key={ind1} className="single-tab-list d-flex align-items-center">
                                                                <img className="avatar-sm rounded-circle mr-3" alt="" />
                                                                <p className="m-0">Bid listed for <strong>{v.bidAmount + '  BNB'}</strong>  <br />by <a href="/author">{v.bidder}</a></p>
                                                            </li>
                                                        ))

                                                    )}

                                                    {/* );
                                        })} */}
                                                </ul>
                                            </div>


                                        </div>
                                    </>
                                )}


                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            {/* Content */}
                            <div className="content mt-5 mt-lg-0">
                                <h3 className="m-0">{item.name}</h3>
                                <p>{item.description}</p>
                                {/* Owner */}
                                <div className="owner d-flex align-items-center">
                                    <span>Owned By</span>
                                    <a className="owner-meta d-flex align-items-center ml-3" href="/author">
                                        {/* <img className="avatar-sm rounded-circle" src={this.state.initData.ownerImg} alt="" /> */}
                                        <h6 className="ml-2">{item.seller}</h6>
                                    </a>
                                </div>
                                {(item.buttonName != 'List on market') && (
                                    <>
                                        <div className="item-info-list mt-4">
                                            <ul className="list-unstyled">
                                                <li className="price d-flex justify-content-between">
                                                    <span>Current Price {item.price + ' BNB'}</span>

                                                </li>

                                            </ul>
                                        </div>
                                        <div className="row items">

                                            <div className="col-12 item px-lg-2">
                                                <div className="card no-hover">
                                                    <h4 className="mt-0 mb-2">Price</h4>
                                                    <div className="price d-flex justify-content-between align-items-center">
                                                        <span>{item.price + ' BNB'}</span>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}


                                {(item.buttonName == 'List on market') && (
                                    <>
                                        <section className="author-area" style={{ padding: "10px 0px" }}>
                                            <div className="container">
                                                <div className="row justify-content-between">

                                                    <div className="col-12">

                                                        <div className="item-form card no-hover">
                                                            <div className="row">


                                                                <div className="col-12 col-md-6">
                                                                    <div className="form-group">
                                                                        <input type="text" className="form-control" name="price" placeholder="Item Price" required="required"
                                                                            onChange={(e) =>
                                                                                updateFormInput({ ...formInput, price: e.target.value })
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-12 col-md-6">
                                                                    <div className="form-group">
                                                                        <select
                                                                            id="royalties"
                                                                            name="royalties"
                                                                            className="sign__select"
                                                                            onChange={(e) =>
                                                                                updateFormInput({
                                                                                    ...formInput,
                                                                                    category: e.target.value,
                                                                                })
                                                                            }
                                                                        >
                                                                            <option value="Art">Art</option>
                                                                            <option value="Photography">Photography</option>
                                                                            <option value="Meme">Meme</option>
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12">
                                                                    <div className="form-group mt-3">
                                                                        <div className="form-check form-check-inline">
                                                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" defaultValue="option1" defaultChecked onChange={(e) => setAuction(e)} />
                                                                            <label className="form-check-label" htmlFor="inlineRadio1">Instant Sale</label>
                                                                        </div>
                                                                        <div className="form-check form-check-inline">
                                                                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" defaultValue="option2" onChange={(e) => setAuction(e)} />
                                                                            <label className="form-check-label" htmlFor="inlineRadio2">Auction</label>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                                {formInput.isAuction && (
                                                                    <div className="col-12">
                                                                        <div className="form-group mt-3">
                                                                            <input type="text" className="form-control" name="name" placeholder="Auction duration(in days)" required="required"
                                                                                onChange={(e) =>
                                                                                    updateFormInput({ ...formInput, AuctionInterval: e.target.value })
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}


                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                    </>

                                )}



                                {!auctionEnd && item.isAuction && (
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control mt-4" name="price" placeholder="Bid Price (BNB)" required="required" style={{
                                                backgroundColor: "#09080d",
                                                color: "white"
                                            }}
                                                onChange={(e) => { setBidpriceerror(""); setMybidprice(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="col-12 col-md-6">
                                    <span style={{ color: "red" }}>{bidpriceerror}</span>
                                </div>

                                {(auctionEnd) ? (
                                    (localStorage.getItem("walletAddress").toLowerCase() == item.bid[1].toLowerCase()) ? (
                                        <a className="d-block btn btn-bordered-white mt-4" onClick={(e) => { RequestAuction(item) }}>Request item</a>

                                    ) : (<></>)
                                ) : (
                                    // <a className="d-block btn btn-bordered-white mt-4" onClick={(e) => { buyNft(item) }}>{item.buttonName}</a>
                                    <a className="d-block btn btn-bordered-white mt-4" onClick={(e) => { detailaction(item) }}>{item.buttonName}</a>

                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

