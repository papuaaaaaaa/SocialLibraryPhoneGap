var module = ons.bootstrap('my-app', ['onsen', 'config'])
    .factory('storage', ['$http', 'APP_CONF', function ($http, APP_CONF) {
        return {
            registerUser: function () {
                //do something
            }
        };
    }])
    .controller('AppController', ['$scope', function ($scope) {
    }])
    .controller('PageController', ['$scope', function ($scope) {
    }])
    .controller('LoginController', ['$scope', 'storage', function ($scope, storage) {
        $scope.signUp = function () {
            storage.registerUser();
        };
    }])
    .run(['$window', 'APP_CONF', function ($window, APP_CONF) {
        Kii.initializeWithSite(APP_CONF.id, APP_CONF.key, KiiSite.JP);
    }]);