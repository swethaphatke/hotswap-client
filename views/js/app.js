var app = angular.module('hotswapApp', ['ngMaterial', 'ui.router', 'ngStorage']);
var request = require('request');
var fs = require("fs");

app.controller("AppCtrl", function ($scope) {
    //   electron.dialog.showErrorBox('Oppps!','Looks like I messed something up...');
});

app.controller('PatientListController', function ($scope, $http, $localStorage, $mdToast) {
    $scope.$storage = $localStorage.$default({
        version: 0
    });
    console.log($localStorage.version);
    request.get('http://localhost:3000/version', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var version = JSON.parse(body).version;
            if (version > $localStorage.version) {
                var toast = $mdToast.simple();
                toast.textContent('Update Available, Your app will be upgraded soon');
                toast.hideDelay(6000);
                $mdToast.show(toast);
            }

            request("http://localhost:3000/update/app.zip").
            pipe(fs.createWriteStream('update.zip')).
            on('close', function () {
                console.log('File written!');
            });


        }
    });
    $http.get("views/data/patient-list.json").then(function (response) {
        $scope.patients = response.data.patient;
    });
});

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/ui-views/login.html'
        })

        .state('patient-list', {
            url: '/patient-list',
            controller: 'PatientListController',
            templateUrl: 'views/ui-views/patient-list.html'
        })

        .state('about', {

        });

});