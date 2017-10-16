'use strict'
const fs = require('fs')
const EventEmmiter = require('events')
const promisify = require('promisify-node')
const readFileAsync = promisify(fs.readFile)

class Importer extends EventEmmiter {

    constructor(watcher){
        super();
        let self = this;
        self.changedFiles = null;

        watcher.on("dirwatcher:changed", function(data){
            console.log(`## Captured dirwatcher:changed, changed file: ${data}`)
            self.changedFiles = data;
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
        const changedFiles = this.changedFiles;
        let promises = []

        for(let f = 0; f < changedFiles.length; f++){
            promises.push(readFileAsync(path + changedFiles[f], "utf8").then(d => Promise.resolve(this.parseCsvToJson(d))))
        }
        return Promise.all(promises)
    }

    importSync(path){
        const changedFiles = this.changedFiles;
        let jsonData = [];
        try {
            for(let f = 0; f < changedFiles.length; f++){
                jsonData.push(this.parseCsvToJson(fs.readFileSync(path + changedFiles[f], "utf8")))
            }
            return jsonData
        }catch(e){
            console.log(`### ${e}`)
        }

    }


}

module.exports = Importer;