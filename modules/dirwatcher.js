'use strict'
const fs = require('fs')
const EventEmmiter = require('events')

class DirWatcher extends EventEmmiter {

    constructor(){
       super();
    }    

    watch(path, delay){
        let changedFiles = [];
        let emitDelay = null;
        fs.watch(path, (type, filename) => {

            if(changedFiles.indexOf(filename) < 0){
                changedFiles.push(filename);
            }            


            if(!emitDelay){
                emitDelay = setTimeout(()=> {
                    this.emit("dirwatcher:changed", changedFiles)
                    clearTimeout(emitDelay)
                    emitDelay = null;
                }, delay)
            }

         });

    }
}

module.exports = DirWatcher;