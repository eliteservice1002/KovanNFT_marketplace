import React, { Component } from 'react';
import axios from 'axios';
import NextLink from "next/link";
import db from '../../db';
const BASE_URL = "https://my-json-server.typicode.com/themeland/netstorm-json/explore";

class ExploreTwo extends Component {
    state = {
        data: {},
        exploreData: []
    }
    componentDidMount(){
        // axios.get(`${BASE_URL}`)
        //     .then(res => {
        //         this.setState({
        //             data: res.data,
        //             exploreData: res.data.exploreData
        //         })
        //         // console.log(this.state.data)
        //     })
        // .catch(err => console.log(err))
        console.log(db)
        this.setState({
            data: db,
            exploreData: db.explore.exploreData
        })
    }
    render() {
        return (
            <section className="explore-area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {/* Intro */}
                            <div className="intro d-flex justify-content-between align-items-end m-0">
                                <div className="intro-content">
                                    <span>{this.state.data.preHeading}</span>
                                    <h3 className="mt-3 mb-0">{this.state.data.heading}</h3>
                                </div>
                                <div className="intro-btn">
                                    <a className="btn content-btn" href="/explore-1">{this.state.data.btnText}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row items">
                        {this.state.exploreData.map((item, idx) => {
                            return (
                                <div key={idx} className="col-12 col-sm-6 col-lg-3 item">
                                    <div className="card">
                                        <div className="image-over">
                                            <a>
                                                <img className="card-img-top" src={item.img} alt="" />
                                            </a>
                                        </div>
                                        {/* Card Caption */}
                                        <div className="card-caption col-12 p-0">
                                            {/* Card Body */}
                                            <div className="card-body">
                                                <div className="countdown-times mb-3">
                                                    <div className="countdown d-flex justify-content-center" data-date="2022-01-24">
                                                        <div className="countdown-container days"><span className="countdown-heading days-top">Days</span><span className="countdown-value days-bottom">143</span></div>
                                                        <div className="countdown-container hours"><span className="countdown-heading hours-top">Hours</span><span className="countdown-value hours-bottom">21</span></div>
                                                        <div className="countdown-container minutes"><span className="countdown-heading minutes-top">Minutes</span><span className="countdown-value minutes-bottom">53</span></div>
                                                        <div className="countdown-container seconds"><span className="countdown-heading seconds-top">Seconds</span><span className="countdown-value seconds-bottom">24</span></div>
                                                    </div>
                                                </div>
                                                <a>
                                                    <h5 className="mb-0">{item.title}</h5>
                                                </a>
                                                <div className="seller d-flex align-items-center my-3">
                                                    <span>Owned By</span>
                                                    <a href="/author">
                                                        <h6 className="ml-2 mb-0">{item.owner}</h6>
                                                    </a>
                                                </div>
                                                <div className="card-bottom d-flex justify-content-between">
                                                    <span>{item.price}</span>
                                                    <span>{item.count}</span>
                                                </div>
                                                {/* <a className="btn btn-bordered-white btn-smaller mt-3" href="/wallet-connect"><i className="icon-handbag mr-2" />{item.btnText}</a> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
}

export default ExploreTwo;