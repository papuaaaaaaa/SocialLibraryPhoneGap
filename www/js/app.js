var module = ons.bootstrap('my-app', ['onsen', 'config'])
    .factory('storage', ['$http', 'APP_CONF', function ($http, APP_CONF) {
        return {
            registerUser: function (email, password) {
                // Create the KiiUser object
                var user = KiiUser.userWithEmailAddress(email, password);

                // Register the user, defining callbacks for when the process completes
                user.register({
                    // Called on successful registration
                    success: function (theUser) {
                        // Print some info to the log
                        console.log("User registered!");
                        console.log(theUser);
                    },
                    // Called on a failed registration
                    failure: function (theUser, errorString) {
                        // Print some info to the log
                        console.log("Error registering: " + errorString);
                    }
                });
            },
            login: function (email, password) {
                // Authenticate the user
                KiiUser.authenticate(email, password, {
                    // Called on successful registration
                    success: function (theUser) {
                        // Print some info to the log
                        console.log("User authenticated!");
                        console.log(theUser);
                    },
                    // Called on a failed authentication
                    failure: function (theUser, errorString) {
                        // Print some info to the log
                        console.log("Error authenticating: " + errorString);
                    }
                });
            }
        }
    }])
    .controller('AppController', ['$scope', function ($scope) {
    }])
    .controller('PageController', ['$scope', function ($scope) {
    }])
    .controller('LoginController', ['$scope', 'storage', function ($scope, storage) {
        $scope.mail = ""
        $scope.pass = ""

        $scope.signUp = function () {
            storage.registerUser($scope.mail, $scope.pass);
        };

        $scope.login = function () {
            storage.login($scope.mail, $scope.pass);
        }
    }])
    .run(['$window', 'APP_CONF', function ($window, APP_CONF) {
        Kii.initializeWithSite(APP_CONF.id, APP_CONF.key, KiiSite.JP);
    }]);