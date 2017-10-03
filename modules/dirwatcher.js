'use strict'
const fs = require('fs')
const EventEmmiter = require('events')

class DirWatcher extends EventEmmiter {

    constructor(){
       super();      
    }    

    watch(path, delay){
        let self = this;
        self.watch = fs.watch(path, (type, filename) => {
             setTimeout(function(){
                 console.log("### Emit dirwatcher:changed")
                 self.emit("dirwatcher:changed", filename)                
             }, delay)
         });
    }
}

module.exports = DirWatcher;