app.factory('GamesFactory', ['$http', '$q', function ($http, $q) {
    return {
        boardgames: false,
        getBoardgames: function () {
            var deferred = $q.defer();
            $http.get(server + 'boardgames/?format=json')
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        addBoardgames: function(game){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'boardgames/?format=json',
                data: game,
                contentType: 'application/json'
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (msg) {
                    deferred.reject(msg);
                });
            return deferred.promise;
        }
    };
}]);


app.controller('BoardgamesController', ['$scope', '$rootScope', 'GamesFactory', 'LoadingState', '$route', function ($scope, $rootScope, GamesFactory, LoadingState, $route) {
    getGames();

    function getGames(){
        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();

        GamesFactory.getBoardgames().then(function (data) {
            $scope.games = data;
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
        }, function (msg) {
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
            console.log(msg);
            //displayMessage(msg, "error");
        });
    }


    $scope.openAddWindow = function(){
        $('.addWindow').toggle();
    };

    $scope.addGame = function(game){
        game.image = $scope.uploadimage;
        GamesFactory.addBoardgames(game).then(function(){
            $scope.game = null;
            $("input[type='file']").val('');
            $scope.addGameForm.$setPristine();
            $('.addWindows').toggle();
            getGames();
        }, function(msg){

        });
    };

    $scope.getFile = function () {
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function (result) {
                $scope.imageSrc = result;
            });
    };
}]);
