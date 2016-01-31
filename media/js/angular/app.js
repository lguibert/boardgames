var app = angular.module('boardgamesperso', ['ngRoute', 'ngAnimate']);
//var server = "http://dev.lucasguibert.com:8000/";
//var server = "http://localhost:8000/";
var server = "http://api.boardgames.lucasguibert.com/";

app.service('LoadingState', ['$rootScope', function ($rootScope) {
    return {
        getLoadingState: function () {
            return this.loading;
        },
        setLoadingState: function (state) {
            this.loading = state;
            $rootScope.$emit("ChangedState");
        }
    }
}]);

app.controller('MainController', ['$scope', '$rootScope', 'LoadingState', function ($scope, $rootScope, LoadingState) {
    $rootScope.$on('ChangedState', function () {
        $scope.loading = LoadingState.getLoadingState();
    });
}]);