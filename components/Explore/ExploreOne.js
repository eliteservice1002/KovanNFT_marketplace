import React, { Component } from 'react';
import axios from "axios";
import { crypto_unit } from '../../config';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AuctionTimer from './AuctionTimer';
import { useSelector, useDispatch } from 'react-redux';

const _initData = {
    pre_heading: "Exclusive Assets",
    heading: "Explore",
    btn_1: "View All",
    btn_2: "Load More"
}

const data = [
    {
        id: "1",
        img: "/img/auction_1.jpg",
        title: "Walking On Air",
        owner: "Richard",
        price: "1.5 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "2",
        img: "/img/auction_2.jpg",
        title: "Domain Names",
        owner: "John Deo",
        price: "2.7 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "3",
        img: "/img/auction_3.jpg",
        title: "Trading Cards",
        owner: "Arham",
        price: "2.3 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "4",
        img: "/img/auction_4.jpg",
        title: "Industrial Revolution",
        owner: "Yasmin",
        price: "1.8 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "5",
        img: "/img/auction_5.jpg",
        title: "Utility",
        owner: "Junaid",
        price: "1.7 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "6",
        img: "/img/auction_6.jpg",
        title: "Sports",
        owner: "ArtNox",
        price: "1.9 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "7",
        img: "/img/auction_7.jpg",
        title: "Cartoon Heroes",
        owner: "Junaid",
        price: "3.2 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "8",
        img: "/img/auction_8.jpg",
        title: "Gaming Chair",
        owner: "Johnson",
        price: "0.69 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "9",
        img: "/img/auction_9.jpg",
        title: "Photography",
        owner: "Sara",
        price: "2.3 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "10",
        img: "/img/auction_10.jpg",
        title: "Zed Run",
        owner: "SpaceMan",
        price: "3.7 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "11",
        img: "/img/auction_11.jpg",
        title: "Rare Tyres",
        owner: "Monas",
        price: "2.2 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    },
    {
        id: "12",
        img: "/img/auction_12.jpg",
        title: "World of Women",
        owner: "Victor",
        price: "4.3 ETH",
        count: "1 of 1",
        btnText: "Place a Bid"
    }
]
function comp(str1, str2) {
    if (!str1) return false;
    if(!str2) return false;
    return (str1.toLowerCase() == str2.toLowerCase())
}
export default function ExploreOne(props) {
    
    const [data, setData] = useState([]);
    const [initData, setInitData] = useState([]);
    const router = useRouter();
    const walletAdd = useSelector(state => state.walletAddress);


    useEffect(async () => {
        // alert(props.param)
        setInitData(_initData);
        let walletAddress = walletAdd;
        let res = await axios.get('/api/getnfts');
        let now = Math.floor(Date.now() / 1000);
        // console.log(res.data);
        var data = res.data;
        for (let i = 0; i < data.length; i++) {
            // console.log(data[i].deadLine, now)
            data[i].isMarketingEnd = (data[i].isSold && !data[i].isAuction) || (data[i].isAuction && data[i].deadLine.hex < now);
            data[i].isMine = (!data[i].isAuction && comp(walletAddress, data[i].seller)) || (data[i].isAuction && data[i].isMarketingEnd && comp(data[i].bid[1], walletAddress))

        }
        console.log('------')
        console.log(data)
        data = data.filter((v) => {
            switch (props.param) {
                case 'cancelAnyList':
                    return (!v.isMarketingEnd);
                case 'explore':
                    return (!v.isMarketingEnd && !comp(v.seller, walletAdd.toString()));
                case 'mylist':
                    return (comp(v.seller, walletAdd.toString()) && !v.isSold && !(v.isAuction && v.isMarketingEnd))
                case 'inventory':
                    return (v.isMine && v.isMarketingEnd)||(v.isAuction && v.isMarketingEnd && comp(walletAddress, v.seller));
            }
        })
        for (let i = 0; i < data.length; i++) {
           let buttonName = '';
           switch (props.param) {
            case 'cancelAnyList':
                buttonName = "Cancel list"; break;
            case 'explore':
                buttonName = (data[i].isAuction)? 'Place a bid' : "Buy"; break;
            case 'mylist':
                buttonName = "Cancel list"; break;
            case 'inventory':
                buttonName = (data[i].isSold)? 'List on market':'Request Item';
            }
            data[i].buttonName = buttonName;
        }
        setData(data);



    }, [])

    function detail_clicked(item) {
        //  alert('cc')
        console.log(item)
        localStorage.setItem("item", JSON.stringify(item));

        router.push('/item-details')
    }
    return (
        <section className="explore-area load-more p-0 my-5">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Intro */}
                        <div className="intro d-flex justify-content-between align-items-end m-0">
                            <div className="intro-content">
                                <span>{initData.pre_heading}</span>
                                <h3 className="mt-3 mb-0">{initData.heading}</h3>
                            </div>
                            <div className="intro-btn">
                                <a className="btn content-btn" href="/explore-3">{initData.btn_1}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row items">
                    {data.map((item, idx) => {
                        // console.log(item);
                        return (
                            <div key={idx} className="col-12 col-sm-6 col-lg-3 item">
                                <div className="card">
                                    <div className="image-over" style={{ position: "relative" }}>
                                        <a onClick={(e) => { detail_clicked(item) }}>
                                            <img className="card-img-top" src={item.image} alt="" style={{minHeight: "200px", maxHeight: "200px"}}>

                                            </img>
                                        </a>
                                        <AuctionTimer deadline={item.deadLine.hex} />

                                    </div>
                                    {/* Card Caption */}
                                    <div className="card-caption col-12 p-0">
                                        {/* Card Body */}
                                        <div className="card-body">


                                            <a onClick={(e) => { detail_clicked(item) }}>
                                                <h5 className="mb-0">{item.title}</h5>
                                            </a>
                                            <div className="seller d-flex align-items-center my-3">
                                                <span>{item.name}</span>
                                               
                                            </div>
                                            {(props.param != 'inventory') && (
                                                <>
                                                    <div className="seller d-flex align-items-center my-3">
                                                        <span>Owned By</span>
                                                        <a>
                                                            <h6 className="ml-2 mb-0">{item.seller.replace('0x', '').substring(0, 8)}</h6>
                                                        </a>
                                                    </div>
                                                    <div className="card-bottom d-flex justify-content-between">
                                                        <span>{item.price + ' ' + crypto_unit}</span>

                                                    </div>
                                                </>
                                            )}

                                            <a className="btn btn-bordered-white btn-smaller mt-3" onClick={(e) => { detail_clicked(item) }}>{item.buttonName}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* <div className="row">
                    <div className="col-12 text-center">
                        <a id="load-btn" className="btn btn-bordered-white mt-5" href="#">{this.state.initData.btn_2}</a>
                    </div>
                </div> */}
            </div>
        </section>
    );
}

