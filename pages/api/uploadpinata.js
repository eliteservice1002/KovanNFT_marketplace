var formidable = require('formidable');
var fs = require('fs');
const FormData = require('form-data');
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

// pinata_api_key: 'aa3b8bfab762cd2ed292',
// pinata_secret_api_key: 'e752f5bb3b57f81ab6eff29ab7e5fc96e6ea938a6b0ec1cdc2cc471f5d2cce1f',
export const config = {
    api: {
        bodyParser: false,
    },
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
export default  function handler(req, res) {
    console.log('enter');
    const form = new formidable.IncomingForm();
    // console.log(req.params)
    form.uploadDir = "./public/_nfts/";
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        // console.log(err, fields, files);
        // console.log(files.file.path)
        let data = new FormData();
        data.append('file', fs.createReadStream(files.file.path));
        var url_pinata = `https://api.pinata.cloud/pinning/pinFiletoIPFS`;
        axios.post(url_pinata, data, {
            headers: {
                "Content-Type": `multipart/form-data; boundary= ${data._boundary}`,
                pinata_api_key: '6d78aaa98809fbfcf16f',
                pinata_secret_api_key: '0a424fa3beb41f81618a30f623cd9a279819a6bdfe2ffea0f51f2ebf75bb569e',
            },
        }).then(resp => {
            console.log('-------')
            // console.log(res)
            var url = "https://gateway.pinata.cloud/ipfs/" + resp.data.IpfsHash;
            url_pinata = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
            var data = {
                name: fields.name,
                description: fields.description,
                price: fields.price,
                category: fields.category,
                image: url,
                id: 0,
                bids: []
            }
            axios.post(url_pinata, data, {
                headers: {
                    pinata_api_key: '6d78aaa98809fbfcf16f',
                    pinata_secret_api_key: '0a424fa3beb41f81618a30f623cd9a279819a6bdfe2ffea0f51f2ebf75bb569e',
                },
            }).then(resp => {
                url = "https://gateway.pinata.cloud/ipfs/" + resp.data.IpfsHash;
                data.id = resp.data.IpfsHash;
                console.log(url)
                fs.writeFile('public/_nfts/' + resp.data.IpfsHash, JSON.stringify(data), function (err) {
                    // console.log(err);
                    if (err) throw err;
                    console.log('Saved!');
                    res.send(url)
                    // res.json(nft_data)
                });
                
            })
                

            
        })

        // console.log(response)

        
      
    });
    // res.send('saved')
}