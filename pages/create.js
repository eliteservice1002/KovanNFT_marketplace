
import { ethers } from 'ethers'
import { getdomainurl } from '../lib/utility'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import axios from "axios";
import { useEffect, useState, useRef } from 'react'
let BigNumber = require("bignumber.js");
const FormData = require("form-data");

import {
    nftaddress,
    nftmarketaddress
} from '../config'

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

import Creates from '../components/Create/Create';
let __file;

export default function Create() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', category: 'Art', isAuction: false, AuctionInterval: 0 })
    const [_file, setFile] = useState(null);
    const nameRef = useRef(null);
    const detailRef = useRef(null);
    const priceRef = useRef(null);
    const [block, setblock] = useState('none');
    const [nftnameerr, setNftnameerr] = useState('');
    const [nftdetailerr, setNftdetailerr] = useState('');
    const [nftpriceerr, setNftpriceerr] = useState('');
    const [minting, setMinting] = useState(false);
    // const [isAuction, setIsAuction] = useState(false);
    const router = useRouter()

    useEffect(async () => {




    }, [])

    function closeAlert() {
        setblock('none');
    }
    function setAuction(e) {
        updateFormInput({
            ...formInput,
            isAuction: e.target.value == 'option2',
        })
    }
    async function onChange(e) {
        console.log(e.target.files)
        const file = e.target.files[0]
        __file = file;
        setFile(file);
        try {
            // const added = await client.add(
            //     file,
            //     {
            //         progress: (prog) => console.log('recieved: ${prog}')
            //     }
            // )
            // const url = "https://ipfs.infura.io/ipfs/${added.path}";
            // console.log(url)
            let formData = new FormData();
            formData.append("file", file);
            // formData.append('aaa', 'bbb');
            const url = URL.createObjectURL(file)
            setFileUrl(url);
            // const response = await axios.post('/api/uploadimage', formData);
            // console.log(response.data)
            // let url = getdomainurl();
            // console.log(data)
            // var ret = await fetch('/api/uploadimage', {method: "POST", data: data});
            // console.log(ret)
            // const url_pinata = `https://api.pinata.cloud/pinning/pinFiletoIPFS`;
            // let response = await axios
            //     .post(url_pinata, data, {
            //         headers: {
            //             "Content-Type": `multipart/form-data; boundary= ${data._boundary}`,
            //             pinata_api_key: '6d78aaa98809fbfcf16f',
            //             pinata_secret_api_key: '0a424fa3beb41f81618a30f623cd9a279819a6bdfe2ffea0f51f2ebf75bb569e',
            //         },
            //     })

            // const url = "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
            // console.log(url);

        } catch (e) {
            console.log(e)
        }
    }


    async function createItem() {
        // alert('creating')
        const { name, description, price, category, isAuction, AuctionInterval } = formInput
        // console.log(isAuction);
        // return;
        // if (!name || !description || !price || !fileUrl) return
        if (!(+price > 0)) {
            // alert('a')
            setNftpriceerr('Price should be greater than zero!')
            priceRef.current.focus();
            return;
        } else {
            setNftpriceerr('')

        }
        if (name == '') {
            setNftnameerr('You should input name of NFT!')
            nameRef.current.focus();
            return;
        } else {
            setNftnameerr('')
        }
        if (description == '') {
            setNftdetailerr('You should input description of NFT!')
            detailRef.current.focus();
            return;
        } else {
            setNftdetailerr('')
        }
        const data = {
            name, description, price, category, image: fileUrl
        }
        try {
            // const added = await client.add(data)
            // const url = 'https://ipfs.infura.io/ipfs/${added.path}'
            // console.log(data)
            // const url_pinata = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
            // let response = await axios
            //     .post(url_pinata, data, {
            //         headers: {
            //             pinata_api_key: '6d78aaa98809fbfcf16f',
            //             pinata_secret_api_key: '0a424fa3beb41f81618a30f623cd9a279819a6bdfe2ffea0f51f2ebf75bb569e',
            //         },
            //     })
            setMinting(true)
            var formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('file', __file);
            formData.append('domain', getdomainurl());
            const response = await axios.post('/api/uploadpinata', formData);


            console.log(response)
            const url = response.data;
            // const url = "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
            createSale(url)
        } catch (error) {
            setMinting(false)
            console.log('Error uploading file: ', error)
        }
    }

    async function createSale(url) {
        try {
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            
            let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
            // let transaction = await contract.createToken(url)
            // let tx = await transaction.wait()

            // let event = tx.events[0]
            // let value = event.args[2]
            // let tokenId = value.toNumber()

            const price = ethers.utils.parseUnits(formInput.price, 'ether')

            // contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
            let listingPrice = await contract.getListingPrice()

            console.log(ethers.BigNumber.from(listingPrice))
            let interval = Math.floor(formInput.AuctionInterval * 3600 * 24)

            let transaction = await contract.createToken(
                url, price, interval, { value: listingPrice }
            )
            await transaction.wait()

        } catch (e) {
            if (e.message?.includes('User denied')) {
                setblock('block');
            }
        } finally {
            setMinting(false)
            router.push('/')
        }


    }



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
            {/* <div id="overlay1"> */}
            {/* <img id="minting-image" src="https://cms.qz.com/wp-content/uploads/2021/03/NFT.gif?quality=75&strip=all&w=1200&h=630&crop=1" 
                    alt="minted-gif" className="gif_image light-b-shadow"/> */}
            {/* <div className="progress">
                    <div className="progress-bar progress-bar-striped" style={{width:"40%"}}></div>
                </div> */}
            {minting && (
                <div className="loading-spinner">
                    <p className="mb-0 d-inline-flex mr-3" style={{ fontSize: '30px' }}>Minting NFT. Please wait</p>
                    <div className="spinner-border text-primary"></div>
                </div>
            )}

            {/* </div> */}
            <section className="author-area">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-12 col-md-4">

                            <div className="card no-hover text-center">
                                <div className="image-over">
                                    {(fileUrl) && (<img className="card-img-top" src={fileUrl} alt="" />)}
                                    {(!fileUrl) && (<img className="card-img-top" src='img/author_1.jpg' alt="" />)}


                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-7">
                            {/* Intro */}
                            <div className="intro mt-5 mt-lg-0 mb-4 mb-lg-5">
                                <div className="intro-content">
                                    <span>Get Started</span>
                                    <h3 className="mt-3 mb-0">Create Item</h3>
                                </div>
                            </div>
                            {/* Item Form */}
                            <div className="item-form card no-hover">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="input-group form-group">
                                            <div className="custom-file">
                                                <input type="file" className="custom-file-input" id="inputGroupFile01" onChange={onChange} />
                                                <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file  e. g. Image, Video(mp4)</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group mt-3">
                                            <input type="text" className="form-control" name="name" ref={nameRef} placeholder="Item Name" required="required"
                                                onChange={(e) =>
                                                    updateFormInput({ ...formInput, name: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="form-group mt-3" style={{ color: "red" }}>
                                            {nftnameerr}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <textarea className="form-control" name="textarea" ref={detailRef} placeholder="Description" cols={30} rows={3} defaultValue={""}
                                                onChange={(e) =>
                                                    updateFormInput({
                                                        ...formInput,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="form-group mt-3" style={{ color: "red" }}>
                                            {nftdetailerr}
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control" name="price" ref={priceRef} placeholder="Item Price" required="required"
                                                onChange={(e) =>
                                                    updateFormInput({ ...formInput, price: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="form-group mt-3" style={{ color: "red" }}>
                                            {nftpriceerr}
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

                                    <div className="col-12">
                                        <button className="btn w-100 mt-3 mt-sm-4" onClick={createItem}>
                                            Create Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>


    )
}

// class Create extends Component {
//     render() {
//         return (
//             <>
//                 <Creates />
//             </>
//         );
//     }
// }

// export default Create;