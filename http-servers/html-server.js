'use strict'
const fs = require("fs");
const through2= require('through2');

require('http')
.createServer()
.on('request', (req, res) => {    
    console.log("#############")
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.createReadStream('./pages/index.html').pipe(through2.obj(function(chunk, enc, callback){
        let page = chunk.toString();

        this.push(page.replace("{message}", "real message text"))  
        callback();
    })).pipe(res)

})
.listen(3000)