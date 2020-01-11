#!/usr/bin/env node



const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readfolder = promisify(fs.readdir);
const rename = promisify(fs.rename);


const start = async function() {
    const currdir = process.cwd();
    console.log(currdir);
    const files = await readfolder(path.resolve(currdir));
    console.log(files.length);
    let cnt = 1;
    const result = files.map((file) => {
        return {
            old: path.join(currdir, file),
            new: path.join(currdir, `${cnt++}`.padStart(3, "0")+".mp3")
        };
    });
    const renames = result.map((res) => {
        return rename(res.old, res.new);
    });
    await Promise.all(renames);

    console.log(JSON.stringify(result, null, 3));





};

start().then(()=> {
    console.log("success");
}, (e) => {
    console.log(`failure ${e}`);
})