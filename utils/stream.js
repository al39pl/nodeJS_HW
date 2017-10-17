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
        this.push( json );
    })).on('data', function (data) {        
        fs.createWriteStream(`data/${pathService.basename(path, pathService.extname(path))}.json`)
        .write(JSON.stringify( data ))
    })

   
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

    case ("csvToJsonWrite"):
        csvToJsonWrite(argv.file)
    break
}

