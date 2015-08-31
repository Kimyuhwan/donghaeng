// Ionic Starter App

// custom url scheme
var handleOpenURL = function(url) {
    setTimeout(function() {
        window.location.hash = '/dh-start/' + url.split("/").pop();
    }, 500);
};


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'ngCordova', 'ionic-material', 'starter.controllers', 'starter.services', 'angular-mapbox','cordovaDeviceMotionModule', 'ionMdInput', 'ionMdInputDisabled', 'ngNotificationsBar'])

.run(function($ionicPlatform) {
  // set initial global variables

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //PushBots
    var PUSHBOTS_APP_ID = "55dfb9e3177959ff558b456b";
    if(PushbotsPlugin.isAndroid()){
        var GCM_SENDER_ID = "976553959318";
        PushbotsPlugin.initializeAndroid(PUSHBOTS_APP_ID, GCM_SENDER_ID);
    }
    // set iOS
    if(PushbotsPlugin.isiOS()){
        PushbotsPlugin.initializeiOS(PUSHBOTS_APP_ID);
        PushbotsPlugin.resetBadge();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, notificationsConfigProvider, $httpProvider) {
  // ionic config
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.tabs.position('bottom');

  // notification bar
  // auto hide
  notificationsConfigProvider.setAutoHide(true);
  // delay before hide
  notificationsConfigProvider.setHideDelay(3000);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

      .state('dh-start', {
        url: '/dh-start/:invitationCode',
        templateUrl: 'templates/dh-start.html',
        controller: 'StartCtrl'
      })

      .state('dh-intro', {
        url: '/dh-intro',
        templateUrl: 'templates/dh-intro.html',
        controller: 'IntroCtrl'
      })

      .state('dh-signup', {
        url: '/dh-signup',
        params: {invite_info: null},
        templateUrl: 'templates/dh-signup.html',
        controller: 'SignUpCtrl'
      })

      .state('dh-signin', {
        url: '/dh-signin',
        templateUrl: 'templates/dh-signin.html',
        controller: 'SignInCtrl'
      })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      //
      .state('app.dh-list', {
        url: '/dh-list',
        views: {
            'menuContent': {
                templateUrl: 'templates/dh-list.html',
                controller: 'ListCtrl'
            }
        }
      })

      .state('app.dh-info', {
        url: '/dh-info',
        params: {campaign_info: null},
        views: {
            'menuContent': {
                templateUrl: 'templates/dh-info.html',
                controller: 'InfoCtrl'
            }
        }
      });


  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/dh-intro');
  $urlRouterProvider.otherwise('/dh-intro');

  $httpProvider.interceptors.push(['$q', '$localstorage', function($q, $localstorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localstorage.getToken()) {
                    config.headers.Authorization = 'Bearer ' + $localstorage.getToken();
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    alert('정상적인 접근이 아닙니다. 앱을 다시 껏다가 켜주세요.');
                }
                return $q.reject(response);
            }
        };
  }]);

});

