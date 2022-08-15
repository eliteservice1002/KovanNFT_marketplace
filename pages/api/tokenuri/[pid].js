var fs = require('fs');


export default function handler({ query: { pid } }, res) {
    console.log('enter')
    
    fs.readFile("./public/_nfts/" + pid + '.txt',"utf8", function(err, data) {
        console.log(data)
        res.send(data);
      });
    
  }