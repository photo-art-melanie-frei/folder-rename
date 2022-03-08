#!/usr/bin/env node



const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readfolder = promisify(fs.readdir);
const rename = promisify(fs.rename);


const start = async function(prefix="") {
    const currdir = process.cwd();
    console.log(currdir);
    const files = await readfolder(path.resolve(currdir));
    console.log(files.length);
    let cnt = 1;
    const result = files.map((file) => {
        return {
            old: path.join(currdir, file),
            new: path.join(currdir, `${prefix}${cnt++}`.padStart(3, "0")+".mp3")
        };
    });
    let failed = false;
    const renames = result.map((res) => {
        if (res.old === res.new) {
            return Promise.resolve();
        }
        return rename(res.old, res.new).catch(()=> {
            failed = true;
            return rename(res.old, "0"+res.new);
        });
    });
    await Promise.all(renames);

    if(failed) {
        let renames = result.map((res) => {
            if (res.old === res.new) {
                return Promise.resolve();
            }
            return rename(res.old, res.new);
        });
        await Promise.all(renames);
    }

    console.log(JSON.stringify(result, null, 3));





};

start("bak__").then(()=> {
    return start().then(()=> {
        console.log("success");
    })
}).catch(e => {
    console.log(`failure ${e}`);
})