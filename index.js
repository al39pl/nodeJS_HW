const config = require("./config");
const models = require("./models");
const modules = require("./modules");

console.log(config.name);

const user = new models.User;
const product = new models.Product;

const dirWatch = new modules.DirWatcher();
dirWatch.watch("./data", 5000)

const Importer = new modules.Importer(dirWatch);


dirWatch.on("dirwatcher:changed", function(){
    var syncImport = Importer.importSync("./data/")

    console.log("### syncImport")
    console.log(syncImport)

    Importer.import("./data/").then(function(data){
        console.log("### aSyncImport")
        console.log(data)
    })
})