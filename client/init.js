"use strict";

var client = angular.module('client', ['ngMaterial', 'ngRoute', 'LocalStorageModule'])
    .factory('authInterceptor', authInterceptor)
    .service('user_service', userService)
    .service('auth', authService)
    .constant('ACCOUNT_SERVICE', 'http://localhost:3001/account')
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    })
    .config(function(localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('venture-game')
    })
    .config(function($mdThemingProvider, $mdIconProvider){
        $mdIconProvider
            .iconSet('mdi', 'assets/svg/iconsets/mdi-icons.svg', 24);

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('purple');

    });



function authInterceptor(ACCOUNT_SERVICE, auth) {

    return {
        // automatically attach Authorization header
        request: function(config) {
            var token = auth.get_token();
            if(config.url.indexOf(ACCOUNT_SERVICE) === 0 && token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        },

        // If a token was sent back, save it
        response: function(res) {
            if(res.config.url.indexOf(ACCOUNT_SERVICE) === 0 && res.data.token) {
                auth.saveToken(res.data.token);
            }
            return res;
        }
    }
}

function authService(localStorageService) {
    var self = this,
        token_key = 'token';

    self.saveToken = function(token) {
        localStorageService.set(token_key, token);
    };

    self.get_token = function() {
        return localStorageService.get(token_key);
    };

    self.deleteToken = function() {
        localStorageService.remove(token_key);
    };
}

function userService($http, ACCOUNT_SERVICE, auth) {
    var self = this;

    self.register = function(email, password) {
        return $http.post(ACCOUNT_SERVICE + '/register', {
            email: email,
            password: password
        })
    };

    self.login = function(email, password) {
        return $http.post(ACCOUNT_SERVICE + '/login', {
            account_id: email,
            password: password
        })
    };
}
