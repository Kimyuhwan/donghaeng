angular.module('starter.services', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    setToken: function(token) {
      $window.localStorage['TOKEN'] = token;
    },
    getToken: function() {
      return $window.localStorage['TOKEN'];
    },
    deleteToken: function() {
      $window.localStorage.removeItem('TOKEN');
    },
    setPushToken: function(token) {
      $window.localStorage['PUSH_TOKEN'] = token;
    },
    getPushToken: function() {
      return $window.localStorage['PUSH_TOKEN'];
    },
    deletePushToken: function() {
      $window.localStorage.removeItem('PUSH_TOKEN');
    }
  }
}])

// service를 만들고.
.factory('$communication', ['$http', '$localstorage', function($http, $localstorage){

        //var baseUrl = "http://localhost:3000/";
        //var baseUrl = "http://192.168.56.1:3000/";
        var baseUrl = "http://128.199.239.83:3000/";
        //var baseUrl = "http://private-02144-sang10518.apiary-mock.com/campaigns";

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localstorage.getToken();
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();

        return {
            user : currentUser,
            signup: function(data, success, error) {
                $http.post(baseUrl + 'users/signup', data).success(success).error(error)
            },
            signin: function(data, success, error) {
                $http.post(baseUrl + 'users/signin', data).success(success).error(error)
            },
            campaignlist: function(success, error) {
                $http.get(baseUrl + 'campaigns').success(success).error(error)
            },
            campaigninfo: function(campaign_id, success, error) {
                $http.get(baseUrl + 'campaigns/' + campaign_id).success(success).error(error);
            },
            invite: function(data, success, error) {
                $http.post(baseUrl + 'invitations/invite', data).success(success).error(error);
            },
            validcode: function(data, success, error) {
                $http.post(baseUrl + 'invitations/valid', data).success(success).error(error);
            }
        };
    }
]);
