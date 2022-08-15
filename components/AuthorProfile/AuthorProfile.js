import React, { Component } from 'react';
import axios from 'axios';
import db from '../../db';
const BASE_URL = "https://my-json-server.typicode.com/themeland/netstorm-json-1/author";

class AuthorProfile extends Component {
    state = {
        data: {},
        socialData: []
    }
    componentDidMount(){
        // axios.get(`${BASE_URL}`)
        //     .then(res => {
        //         this.setState({
        //             data: res.data,
        //             socialData: res.data.socialData
        //         })
        //         // console.log(this.state.data)
        //     })
        // .catch(err => console.log(err))
        this.setState({
            data: db.author,
            socialData: db.author.socialData
        })
        console.log(db)
    }
    render() {
        return (
            <div className="card no-hover text-center">
                <div className="image-over">
                    <img className="card-img-top" src={this.state.data.img} alt="" />
                    {/* Author */}
                    {/* <div className="author">
                        <div className="author-thumb avatar-lg">
                            <img className="rounded-circle" src={this.state.data.authorImg} alt="" />
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }
}

export default AuthorProfile;