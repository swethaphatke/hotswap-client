var request = require("request");
var fs = require("fs");
var fse = require("fs-extra");
var zipper = require('zip-local');

fse.emptyDir('updates', function (err) {
    request("http://localhost:3000/update/app.zip").pipe(fs.createWriteStream("updates/updated.zip")).on("close", function () {
        zipper.sync.unzip("updates/updated.zip").save("updates");
        fs.unlink("updates/updated.zip");
        fse.copy('updates', 'views', { clobber: true }, function (err) {
            if (err) return console.error(err)
            console.log("success!");
        });
    });
});