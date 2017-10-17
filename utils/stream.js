'use strict'
const argv = require('yargs').argv;
const through2= require('through2');
const fs = require('fs');
const Parsers = require("./parsers.js");

let io = (path) => {  
    let stream = fs.createReadStream(path);
    stream.pipe(process.stdout)
}

let upperCase = (path) => {  
    let stream = fs.createReadStream(path).pipe(through2.obj(function(chunk){
        let string = chunk.toString().toUpperCase() 
        this.push(string)         
    }))    
    stream.pipe(process.stdout)
}

let csvToJson = (path) => {  
    let stream = fs.createReadStream(path).pipe(through2.obj(function(chunk){
        let json = Parsers(chunk.toString());
        this.push( JSON.stringify( json ));
    }))     
    stream.pipe(process.stdout)
}

let csvToJsonWrite = (path) => {  
    let stream = fs.createReadStream(path).pipe(through2.obj(function(chunk, enc, callback){
        let json = Parsers(chunk.toString());

        console.log('########################')
        console.log(enc)

        var wstream = fs.createWriteStream('data/file.json');
        wstream.write(JSON.stringify( json ));
        wstream.end();
    }))      
}

switch(argv.action){

    case ("io"):
        io(argv.file)
    break

    case ("upperCase"):
        upperCase(argv.file)
    break

    case ("csvToJson"):
        csvToJson(argv.file)
    break

    case ("csvToJsonWrite"):
        csvToJsonWrite(argv.file)
    break
}

