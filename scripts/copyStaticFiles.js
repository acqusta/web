#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
let  join = require('path').join;


//const antd = path.resolve(__dirname, '../');

// var shelljs = require('shelljs');
// var addCheckMark = require('./helpers/checkmark');
// var path = require('path');

// var cpy = path.join(__dirname, '../node_modules/cpy-cli/cli.js');

// shelljs.exec(cpy + ' /static/* /build/', addCheckMark.bind(null, callback));

// function callback() {
//   process.stdout.write(' Copied /static/* to the /build/ directory\n\n');
// }

function findSync(startPath) {
    let result=[];
    function finder(path) {
        let files=fs.readdirSync(path);
        files.forEach((val,index) => {
            if (/.*\.md$/.test(val)) return;
            if (/.DS_Store/.test(val)) return;
            if (/Thumbs.db/.test(val)) return;
            let fPath=join(path,val);
            let stats=fs.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()) result.push(fPath);
        });
    }
    finder(startPath);
    return result;
}

let fileNames=findSync('docs');
fileNames.push('acqusta.png');
fileNames.push('acqusta_icon.png');
fileNames.push('baidu_verify_0GXlizjRMz.html');
console.log("copy static files to _site")
console.log(fileNames);

var copyfiles = require('copyfiles');

function callback(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    process.exit(0);
  }
}

fileNames.push("_site");
copyfiles(fileNames, 0, callback);
