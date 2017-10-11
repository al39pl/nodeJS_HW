'use strict'
const fs = require('fs')
const EventEmmiter = require('events')

class DirWatcher extends EventEmmiter {

    constructor(){
       super();      
       this.changedFiles = []
    }    

    watch(path, delay){
        let changedFiles = this.changedFiles
        this.watch = fs.watch(path, (type, filename) => {
            
            if(!changedFiles.indexOf(filename)){
                changedFiles.push[filename];

            }            

             setTimeout(()=> {
                 console.log("### Emit dirwatcher:changed")
                 this.emit("dirwatcher:changed", filename)                
             }, delay) 
         });

    }
}

module.exports = DirWatcher;