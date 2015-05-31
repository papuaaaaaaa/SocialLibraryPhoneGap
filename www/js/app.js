var module = ons.bootstrap('my-app', ['onsen', 'config'])
    .factory('auth', ['$rootScope', 'APP_CONF', function ($scope, APP_CONF) {
        return {
            registerUser: function (email, password) {
                var user = KiiUser.userWithEmailAddress(email, password);
                user.register({
                    success: function (theUser) {
                        console.log("User registered!");
                        console.log(theUser);
                    },
                    failure: function (theUser, errorString) {
                        console.log("Error registering: " + errorString);
                    }
                });
            },
            login: function (email, password) {
                KiiUser.authenticate(email, password, {
                    success: function (theUser) {
                        console.log("User authenticated!");
                        console.log(theUser);
                    },
                    failure: function (theUser, errorString) {
                        console.log("Error authenticating: " + errorString);
                    }
                });
            }
        }
    }])
    .factory('wanted_books', ['$rootScope', 'APP_CONF', function ($scope, APP_CONF) {

        var bucket = KiiUser.getCurrentUser().bucketWithName("wanted_books");
        var books = [];

        var create = function (title, author, isbn, image_url, comment) {
            var obj = bucket.createObject();
            obj.set("title", title);
            obj.set("author", author);
            obj.set("isbn", isbn);
            obj.set("image_url", image_url);
            obj.set("comment", comment);
            return obj;
        };

        var update = function () {
            var all_query = KiiQuery.queryWithClause();
            var queryCallbacks = {
                success: function (queryPerformed, results, nextQuery) {
                    books = [];
                    for (var i = 0; i < results.length; i++) {
                        books.push({
                            title: results[i].get("title"),
                            author: results[i].get("author"),
                            isbn: results[i].get("isbn"),
                            image_url: results[i].get("image_url"),
                            comment: results[i].get("comment")
                        });
                    }
                },
                failure: function (queryPerformed, anErrorString) {
                    // do something with the error response
                }
            };
            bucket.executeQuery(all_query, queryCallbacks);
        };

        return {
            list: function () {
                update();
                return books;
            },
            createObject: create,
            add: function (obj) {
                obj.save({
                    success: function (theObject) {
                        console.log("Object saved!");
                        console.log(theObject);
                    },
                    failure: function (theObject, errorString) {
                        console.log("Error saving object: " + errorString);
                    }
                });
            },
            remove: function (obj) {
                obj.delete({
                    success: function (theDeletedObject) {
                        console.log("Object deleted!");
                        console.log(theDeletedObject);
                    },
                    failure: function (theObject, errorString) {
                        console.log("Error deleting object: " + errorString);
                    }
                });
            },
            updateList: update
        }
    }])
    .
    controller('AppController', ['$scope', function ($scope) {
    }])
    .controller('PageController', ['$scope', function ($scope) {
        $scope.wanted_books = [];
        $scope.provided_books = [];
    }])
    .controller('LoginController', ['$scope', 'auth', function ($scope, auth) {
        $scope.mail = ""
        $scope.pass = ""

        $scope.signUp = function () {
            auth.registerUser($scope.mail, $scope.pass);
        };

        $scope.login = function () {
            auth.login($scope.mail, $scope.pass);
        }
    }])
    .controller('WantedBookController', ['$scope', 'auth', 'wanted_books', function ($scope, auth, wanted_books) {

        $scope.selectBook = {};
        $scope.add = function () {
            var book = wanted_books.createObject('title', 'author', 'isbn', 'comment', 'url');
            wanted_books.add(book);
            $scope.books = wanted_books.list()
        };
        $scope.books = wanted_books.list()
    }])
    .controller('ProvidedBookController', ['$scope', function ($scope) {
    }])
    .run(['$window', 'APP_CONF', function ($window, APP_CONF) {
        Kii.initializeWithSite(APP_CONF.id, APP_CONF.key, KiiSite.JP);
    }]);