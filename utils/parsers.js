'use strict'
let parseCsvToJson = (csv) => {
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

module.exports = parseCsvToJson;