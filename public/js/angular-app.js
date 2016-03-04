
angular.module('tvshowApp', ["oc.lazyLoad", 'ui.router', 'ngAnimate', 'LocalStorageModule'])

    .run(
    [          '$rootScope', '$state', '$stateParams',
        function ($rootScope,   $state,   $stateParams) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])

    .config(function($locationProvider, $stateProvider, localStorageServiceProvider){
        $locationProvider.html5Mode(true);

        localStorageServiceProvider
            .setPrefix('tvshow');

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "/templates/index",
                controller: "IndexCtrl"
            })

            /*.state('example', {
                abstract: true,
                url: "/example",
                templateUrl: "/templates/example",
                controller: ExampleCtrl"
            })*/

    })


    .controller('MainCtrl', function ($scope, $state, $rootScope) {


    })


    .controller('IndexCtrl', function ($scope, $state) {
        $scope.doors = 3;
        $scope.doorsToOpen = 1;
        $scope.resultsStay = [];
        $scope.resultsSwitch = [];
        $scope.numSwitchWins = 0;
        $scope.numStayWins = 0;
        $scope.showBody = 0;


        $scope.simulate = function(){

            $scope.error= null;
            if(isNaN($scope.doors) || $scope.doors < 3){
                $scope.error = "Number of doors (N) must be an integer equal to or greater than 3";
                return;
            }
            else if(isNaN($scope.doorsToOpen) || $scope.doorsToOpen > $scope.doors-2){
                $scope.error = "Doors to open (D) must be an integer less than number of doors minus 2";
                return;
            }

            $scope.numSwitchWins = 0;
            $scope.numStayWins = 0;
            $scope.resultsStay = [];
            $scope.resultsSwitch = [];
            for(var prize=1; prize <= $scope.doors; prize++){
                for(var pick=1; pick <= $scope.doors; pick++){
                    $scope.openArr = [];
                    $scope.open = [];
                    for(var open=1; open<=$scope.doors;open++){
                        if(open != prize && open != pick){
                            $scope.open.push(open);
                        }
                    }
                    if($scope.doorsToOpen==1){
                        $scope.openArr = $scope.open;
                    }
                    else{
                        //console.log($scope.open, $scope.doorsToOpen);
                        $scope.openArr = getCombinations($scope.open, $scope.doorsToOpen);
                        console.log($scope.openArr);
                    }
                    $scope.switchTo = [];
                    for(var switchTo=1; switchTo<= $scope.doors;switchTo++){
                        if(switchTo != pick && ($scope.openArr.indexOf(switchTo)<0 || $scope.openArr.length > 1) ){
                            $scope.switchTo.push(switchTo);
                        }
                    }

                    $scope.resultsSwitch.push({
                        prize: prize,
                        pick: pick,
                        open: $scope.openArr,
                        switchTo: $scope.switchTo,
                        result: $scope.switchTo.indexOf(prize) >=0?1:0
                    });
                    $scope.resultsStay.push({
                        prize: prize,
                        pick: pick,
                        open: $scope.openArr,
                        result: pick==prize?1:0
                    });
                    if(pick==prize){
                        $scope.numStayWins++;
                    }
                    else if($scope.switchTo.indexOf(prize) >= 0){
                        $scope.numSwitchWins++;
                    }
                }
            }
            $scope.showBody = 1;

        };

        //helper function
        function getCombinations(arr, n)
        {
            if(n == 1)
            {
                var ret = [];
                for(var i = 0; i < arr.length; i++)
                {
                    /*for(var j = 0; j < arr[i].length; j++)
                     {
                     ret.push([arr[i][j]]);
                     }*/
                    ret.push(arr[i]);
                }
                return ret;
            }
            else
            {
                var ret = [];
                for(var i = 0; i < arr.length; i++)
                {
                    var elem = arr.shift();
                    //for(var j = 0; j < elem.length; j++)
                    //{
                    var childperm = getCombinations(arr.slice(), n-1);
                    for(var k = 0; k < childperm.length; k++)
                    {
                        ret.push(elem+" and "+childperm[k]);
                    }
                    //}
                }
                return ret;
            }
        }
    })

    .filter('reduce', function() {
        return function(numerator, denominator){
            var gcd = function gcd(a,b){
                return b ? gcd(b, a%b) : a;
            };
            gcd = gcd(numerator,denominator);
            return numerator/gcd+"/"+denominator/gcd;
            //return numerator+"/"+denominator;
        };
    })

    .filter('open', function() {
        return function(arr){
            var returnStr = "";
            for(var i=0; i<arr.length;i++){
                if(i==0){
                    returnStr += arr[i];
                }
                else{
                    returnStr += " or "+arr[i];
                }
            }
            return returnStr;
        };
    })

    .filter('switchTo', function() {
        return function(arr, pick){
            var returnStr = pick + " to ";
            for(var i=0; i<arr.length;i++){
                if(i==0){
                    returnStr += arr[i];
                }
                else{
                    returnStr += " or "+arr[i];
                }
            }
            return returnStr;
        };
    });