var module = ons.bootstrap('my-app', ['onsen', 'config'])
    .factory('storage', ['$http', '$rootScope', 'APP_CONF', function ($http, $scope, APP_CONF) {
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
            },
            addWantedBook: function (imageUrl, title, author, isbn, comment) {
                var user = KiiUser.getCurrentUser();
                var bucket = user.bucketWithName("wanted_books");
                var obj = bucket.createObject();
                obj.set("image_url", imageUrl);
                obj.set("title", title);
                obj.set("author", author);
                obj.set("isbn", isbn);
                obj.set("comment", comment)
                obj.save({
                    success: function (theObject) {
                        console.log("Object saved!");
                        console.log(theObject);
                    },
                    failure: function (theObject, errorString) {
                        console.log("Error saving object: " + errorString);
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
    .controller('WantedBookController', ['$scope', 'storage', function ($scope, storage) {

        $scope.selectBook = {};
        $scope.add = function () {
            storage.addWantedBook(selectBook.imageUrl, selectBook.title, selectBook.isbn, selectBook.comment);
        };
        //$scope.books = [{"image_url": "image_url", "title": "title", "author": "author", "comment": "comment"},
        //    {"image_url": "image_url", "title": "title", "author": "author", "comment": "comment"}];
        $scope.books = [];
        $scope.list = function () {
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            var user = KiiUser.getCurrentUser();
            var bucket = user.bucketWithName("wanted_books");
            // Build "all" query
            var all_query = KiiQuery.queryWithClause();
            // Define the callbacks
            var queryCallbacks = {
                success: function (queryPerformed, resultSet, nextQuery) {
                    $scope.books = [];
                    for (var i = 0; i < resultSet.length; i++) {
                        // do something with the object resultSet[i];
                        $scope.books.push({
                            image_url: resultSet[i].get("image_url"),
                            title: resultSet[i].get("title"),
                            author: resultSet[i].get("author"),
                            comment: resultSet[i].get("title")
                        });
                    }
                    console.log($scope.books)
                },
                failure: function (queryPerformed, anErrorString) {
                    // do something with the error response
                }
            };
            // Execute the query
            bucket.executeQuery(all_query, queryCallbacks);
            // alternatively, you can also do:
            //bucket.executeQuery(null, queryCallbacks);
        };
        $scope.list();

    }])
    .controller('ProvidedBookController', ['$scope', function ($scope) {
    }])
    .run(['$window', 'APP_CONF', function ($window, APP_CONF) {
        Kii.initializeWithSite(APP_CONF.id, APP_CONF.key, KiiSite.JP);
    }]);