var module = ons.bootstrap('my-app', ['onsen'])
    .controller('AppController', function ($scope) {
    })
    .controller('PageController', function ($scope) {
        ons.ready(function () {
            // Init code here
        });
    });