var request = require("request");
var fs = require("fs");
var zipper = require('zip-local');

request("http://localhost:3000/update/app.zip").pipe(fs.createWriteStream("updates/updated.zip")).on("close",function(){
    zipper.sync.unzip("updates/updated.zip").save("updates");
    fs.unlink("updates/updated.zip");
});