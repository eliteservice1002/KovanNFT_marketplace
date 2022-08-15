var formidable = require('formidable');
var fs = require('fs');
const FormData = require('form-data');
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


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
        
            
        // console.log(response)

        var nft_path = replaceAll(files.file.path, '', '');
        nft_path = nft_path.replace("\\", "/");
        nft_path = nft_path.replace("\\", "/");
        nft_path = replaceAll(nft_path, 'public/', '');
        // console.log(nft_path)
        var _id = uuidv4();
        var id = _id + '.txt';
        var nft_data = {
            name: fields.name,
            description: fields.description,
            price: fields.price,
            category: fields.category,
            image: fields.domain + '/' + nft_path,
            id: _id,
            bids: []
        }
        fs.writeFile('public/_nfts/' + id, JSON.stringify(nft_data), function (err) {
            console.log(err);
            if (err) throw err;
            console.log('Saved!');
            res.send(fields.domain + '/api/tokenuri/' + _id);
            // res.json(nft_data)
        });
    });
    // res.send('saved')
}