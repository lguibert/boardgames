app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", {templateUrl: 'templates/games.html'})
        .otherwise({redirectTo: '/'});
}]);