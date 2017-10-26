'use strict'
const yargs = require('yargs');
const through2= require('through2');
const fs = require('fs');
const Parsers = require("./parsers.js");
const pathService = require('path');

let io = (path) => {  
    let stream = fs.createReadStream(path);
    stream.pipe(process.stdout)
}

let upperCase = (path) => {  
    let stream = fs.createReadStream(path).pipe(through2.obj(function(chunk, enc, callback){
        let string = chunk.toString().toUpperCase() 
        this.push(string)  
        callback();
    }))    
    stream.pipe(process.stdout)
}

let csvToJson = (path) => {  
    let headers = "";
    let string = "";
    let stream = fs.createReadStream(path).pipe(through2.obj(function(chunk, enc, callback){  
        
        string += chunk.toString();
        this.push( JSON.stringify( Parsers(string)));
        callback();
    }))     
    stream.pipe(process.stdout)
}

let csvToJsonWrite = (path) => {  
    let string = "";
    let stream = fs.createReadStream(path).pipe(through2.obj(function(chunk, enc, callback){        
        string += chunk.toString();
        callback();
    })).on('data', function () {                  
        fs.createWriteStream(`../data/${pathService.basename(path, pathService.extname(path))}.json`)
        .write(JSON.stringify( Parsers(string) ))
    })

   
}

let gen = () => {  
    let data = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p\r\n"

    for (var i = 1; i <= 200000; i++){
        data = data + i + ",";
        if(i%16 == 0 && i != 0){
            data += "\r\n"
        }
    }
    
    fs.createWriteStream("../data/data_three.csv")
    .write(data) 
}

const argv = yargs.command("run", "runs the app", {
        action: {
            describe: "Action to perform",
            demand: true,
            alias: 'a'
        },
        file: {
            describe: "File to be modified",
            demand: true,
            alias: 'f'
        }
    })
    .help()
    .argv;

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

    case ("gen"):
        gen(argv.file)
    break

    case ("csvToJsonWrite"):
        csvToJsonWrite(argv.file)
    break
}

module.exports = { io, upperCase, csvToJson,  csvToJsonWrite }

