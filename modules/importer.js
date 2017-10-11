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
        let header = csvArray[0].split(',')

        let dataJson = {data: []}

        for(let row = 1; row < csvArray.length; row++){
            let data = {}
            let values =  csvArray[row].split(",")

            for(let p = 0; p < header.length; p++){
                data[header[p]] =  values[p]
            }
            dataJson.data.push(data)
        }

        return dataJson;
    }

    import(path){     
        const filePath = path + this.changedFile;   
        return readFileAsync(filePath, "utf8").then(d => Promise.resolve(this.parseCsvToJson(d)));        
    }

    importSync(path){    
        const filePath = path + this.changedFile;
        let d = fs.readFileSync(filePath, "utf8")
       
        return this.parseCsvToJson(d)
    }


}

module.exports = Importer;