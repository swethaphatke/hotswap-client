var request = require("request");
var fs = require("fs");
var fse = require("fs-extra");
var zipper = require('zip-local');

if (!localStorage.getItem('appVersion')) {
    localStorage.setItem('appVersion', 1);
}

// var myNotification = new Notification('Updates available', {
//   body: 'Hold tight, your application will be updated soon.'
// });

var updatedAppVersion = 0;
$("#refresh").on("click", function () {
    var appVersion = localStorage.getItem('appVersion');
    $.get("http://localhost:3000/version", function (data) {
        updatedAppVersion = data.version;
        if (updatedAppVersion > appVersion) {
            $(".hidden").removeClass("hidden");
            var myNotification = new Notification('Updates available', {
                body: 'Hold tight, your application will be updated soon.'
            });
            updateApp();
        }else{
            console.log("no updates available");
        }
    })
});

function updateApp() {
    fse.emptyDir('updates', function (err) {
        request("http://localhost:3000/update/app.zip").pipe(fs.createWriteStream("updates/updated.zip")).on("close", function () {
            zipper.sync.unzip("updates/updated.zip").save("updates");
            fs.unlink("updates/updated.zip");
            fse.copy('updates', 'views', { clobber: true }, function (err) {
                if (err) return console.error(err)
                console.log("success!");
                localStorage.setItem("appVersion", updatedAppVersion);
                location.reload();
            });
        });
    });
}

