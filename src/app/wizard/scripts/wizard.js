'use strict';

angular.module('app').controller('wizardCtrl', function ($scope, $location, $sce, $window, $timeout, SegueService, $rootScope, AnimationService, session, device) {

    /** Submitted User Data **/
    $scope.submittedData = {};
    // $scope.submittedData.kitName = ' ';
    $scope.submittedData.wifi_ssid =' ';
    $scope.submittedData.wifi_password =' ';
    $scope.submittedData.userEmail = ' ';
    $scope.submittedData.userName = ' ';

    $scope.submittedData.deviceData = {
        description: 'Making Sense Pilot #1',
        exposure: 'outdoor',
        kit_id: 11
    }

    //$scope.location ..

    /** Operational Data **/
    $scope.onboarding_session = session.onboarding_session;
    $scope.device_token = session.device_token;

    $scope.pre_made = false;

    $scope.modalClass='hidden';

    $scope.handShakeState = false;

    console.log(session);

    /** Base Navigation  **/
    $scope.seque = function () {
        console.log($scope.payload.template);
        if (($scope.payload.template == 'handshake') && ($scope.handShakeState == false)){
            $rootScope.$broadcast('handshake');
        } else if ($scope.payload.template == 'final'){
            $window.open('https://smartcitizen.me/kits/3770', '_blank');
        } else if ($scope.segueControl == 'ready') {
            console.log($scope.payload.template);
            if ($scope.payload.template == 'sensorName' || $scope.payload.template == 'location_map' || $scope.payload.template == 'location_tags') {
                device.update($scope.submittedData.deviceData).then(sequeTransition, $scope.serverFailed);
            } else {
                sequeTransition();
            }
        }
        else {
            handleError();
        }
    };

    $scope.back = function () {
        if ($scope.payload.backBlock != 'blocked') {
            //compare templates
            $rootScope.$broadcast('no'); //?
            backTransition();
        }
    };


    /** Aux Navigation **/

    function sequeTransition() {
        AnimationService.leaving(true);
        $timeout(function () {
            $location.path('/wizard/' + SegueService.nextPage($scope.payload.index, $scope.pre_made));
            $window.scrollTo(0, 0);
        }, 500); // see animations max duration time
    }

    function backTransition() {
        AnimationService.leaving(false);
        $timeout(function () {
            $scope.segueControl ='ready';
            $location.path('/wizard/' + SegueService.previousPage($scope.payload.index, $scope.pre_made));
            $window.scrollTo(0, 0);
        }, 500); // see animations max duration time
    }

    function handleError(){
        if (
            ($scope.payload.template == 'wifi_enter') ||
            ($scope.payload.template == 'sensorName') ||
            ($scope.payload.template == 'account1') ||
            ($scope.payload.template == 'login') ||
            ($scope.payload.template == 'make1') ||
            ($scope.payload.template == 'make2')
        ){
            $scope.segueControl = 'error';
            $timeout(function(){
                $scope.payload.segueButton = $scope.payload.segueButtonError;
            }, 250);
            return;
        }

        $scope.segueControl = 'error';
        $scope.errorButton = 'show';
        $rootScope.$broadcast('blockedSegue');
        $timeout(function(){
            $scope.payload.segueButton = $scope.payload.segueButtonError;
        }, 250); //half of animation time defined in _navigation.scss
    }

    $scope.$on('removeError', function(){
       removeError();
    });

    function removeError(){
        $scope.errorButton = '';
    }

    $scope.no = function(){
        $rootScope.$broadcast('no');
    };

    $scope.yes = function(){
        $scope.modalBox = 'red';
        var data = {title: "Uh oh", body:"It seems like you are missing parts of the kit. If that’s so, let’s notify the team and they’ll get back to you as soon as possible", image:"app/images/alert.svg", button:"Notify the team!", action: "email"};
        $scope.modalContent = data;
        $rootScope.$broadcast('modal');
    };

    $scope.serverFailed = function(){
        $scope.modalBox = 'red';
        var data = {title: "Uh oh", body:"It seems we can't talk to the platform. Please, check your internet connection!", button: "Retry", action: "retry"};
        $scope.modalContent = data;
        $rootScope.$broadcast('modal');
    };

    /** -- MODAL-- **/

    $scope.modalClick = function(){
        $scope.modalClass='out';
        $timeout(function(){
            $scope.modalClass='hidden';
        }, 500);
    };
    $scope.modalButtonClick = function(){
        if ( $scope.modalContent.action == 'email' ) $window.open('mailto:support@smartcitizen.me?Subject=SmartCitizen Support [' + $scope.onboarding_session + ']', '_blank');
        else if ( $scope.modalContent.action == 'retry' ) $scope.seque;
    };
    $scope.$on('modal', function(){
        $scope.modalClass='showing';
    });




});