'use strict'
const yargs = require('yargs');
const through2= require('through2');
const https = require('https');
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
    fs.createReadStream(path).pipe(through2.obj(function(chunk, enc, callback){
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

let findCss = (path, file) => {
    let data;
    var cssFiles = fs.readdirSync(path);

    if(!cssFiles.length){
        return
    }

    for (let files = 0; files < cssFiles.length; files++){
        let filepath = path + "/" + cssFiles[files];

        if (fs.lstatSync(filepath).isDirectory()){
            bundleCss(filepath)
        }
        else{
            let stream = fs.createReadStream(filepath).pipe(through2.obj(function(chunk, enc, callback){

                fs.appendFile("../assets/css/bundle.css", chunk, function (err) {
                    if (err) console.log('Not saved!');
                    console.log('CSS saved!');
                });
                this.push(chunk)
                callback();
            }))
        }
    }
}
let bundleCss = (path) => {
    fs.writeFile('../assets/css/bundle.css', "");
    findCss(path);

    https.get('https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            fs.appendFile("../assets/css/bundle.css", data, function (err) {
                if (err) console.log('Not saved!');
                console.log('CSS saved!');
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
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
        },
        path: {
            describe: "Files to be concatenated",
            demand: false,
            alias: 'p'
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

    case ("bundle-css"):
        bundleCss(argv.path)
    break

    case ("csvToJsonWrite"):
        csvToJsonWrite(argv.file)
    break
}

module.exports = { io, upperCase, csvToJson,  csvToJsonWrite }

