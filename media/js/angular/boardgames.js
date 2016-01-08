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
                url: server + 'boardgames/add/',
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
        },
        updateBoardgames: function(game){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'boardgames/update/',
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


app.controller('BoardgamesController', ['$scope', '$rootScope', 'GamesFactory', 'LoadingState', function ($scope, $rootScope, GamesFactory, LoadingState) {
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
        if($scope.currently_update){
            $scope.game = null;
            $scope.currently_update = false;
            $scope.addGameForm.$setPristine();
            $scope.addGameForm.$setUntouched();
        }
        $('.addWindow').toggle();
    };

    $scope.addGame = function(game){
        game.image = $scope.uploadimage;
        GamesFactory.addBoardgames(game).then(function(){
            doItAfterModification();
        }, function(msg){

        });
    };

    function doItAfterModification(){
        $scope.game = null;
        //$scope.games = null;
        $("input[type='file']").val('');
        $scope.addGameForm.$setPristine();
        $scope.addGameForm.$setUntouched();
        $('.addWindow').hide();
        //getGames();
    }

    $scope.openUpdateGame = function(id, game){
        if($scope.currently_update){
            $scope.currently_update = false;
            $('.addWindow').hide();
        }else{
            $('.addWindow').show();
            $scope.currently_update = true;
            game.price = parseFloat(game.price);
            game.date_buy = new Date(game.date_buy);
            $scope.game = game;
        }
    };

    $scope.updateGame = function(game){
        GamesFactory.updateBoardgames(game).then(function(){
            doItAfterModification();
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
