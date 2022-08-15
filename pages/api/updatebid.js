var fs = require('fs');



export default function handler(req, res) {
    // console.log(req.body);
    console.log('---------------------')
    const _data = {
        bidder: req.body.bidder,
        bidAmount: req.body.bidAmount,
        bidTime: req.body.bidTime
    }
    const id = req.body.id;
    const fname = 'public/_nfts/' + id + '.txt';
    fs.readFile(fname, function (err, data) {
        let indata = JSON.parse(data);
        // indata.bids.push(_data);
        let _bids = indata.bids;
        console.log(_bids)
        console.log(_data)
        _bids.push(_data);
        console.log(_bids)
        indata.bids = _bids;
        console.log(indata);
        fs.writeFile(fname, JSON.stringify(indata), function (err) {
            if (err) throw err;
            
        });
    });
    res.send('ok');
}
