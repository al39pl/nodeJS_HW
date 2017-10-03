'use strict'
const fs = require('fs')
const EventEmmiter = require('events')
const csv = require('csvtojson')
const promisify = require('promisify-node')
const readFileAsync = promisify(fs.readFile)

class Importer extends EventEmmiter {

    constructor(watcher){
        super();
        let self = this;
        self.changedFile = null;

        watcher.on("dirwatcher:changed", function(data){
            console.log(`## Captured dirwatcher:changed, changed file: ${data}`)
            self.changedFile = data;
        })       
        
    }    

    parseCsvToJson(csv){
        let csvArray = csv.split("\r\n")
        let dataJson = {data: []}
        for(let row = 1; row < csvArray.length; row++){
            let data = {}
            for(let p = 0; p < csvArray[0].length; p++){
                data[csvArray[0][p]] = csvArray[row][p]
            }
            dataJson.data.push(data)
        }
        return dataJson;
    }

    import(path){     
        const filePath = path + this.changedFile;   
        return readFileAsync(filePath, "utf8")        
    }

    importSync(path){    
        const filePath = path + this.changedFile;
        let d = fs.readFileSync(filePath, "utf8")
       
        return this.parseCsvToJson(d)
    }


}

module.exports = Importer;