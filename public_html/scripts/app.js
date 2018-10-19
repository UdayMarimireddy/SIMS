var routerApp = angular.module( 'SIMS', [ 'ui.bootstrap', 'ui.router', 'oc.lazyLoad', 'ngRoute', 'ui-notification' ] );

routerApp.config( [ '$stateProvider','$urlRouterProvider', '$httpProvider', function( $stateProvider, $urlRouterProvider, $httpProvider ) {

    $urlRouterProvider.otherwise( '/SIMS/home' );
    $httpProvider.interceptors.push( 'tokenAuthentication' );
    
    $stateProvider
        .state( 'SIMS', {
            url: '/SIMS',
            templateUrl: 'views/login.html',
            controller: 'signInCtrl',
            controllerAs: 'signInVM',
            data: {
              loginRequired: false
            },
            resolve: {
                loadMyCtrl: [ '$ocLazyLoad', function( $ocLazyLoad ) {
                    return $ocLazyLoad.load( [
                        {
                            name: 'SIMS.login',
                            files: [ 'scripts/login.js' ]
                        } 
                    ] );
                } ]
            },
            onEnter: function() {
                console.log( '' );
            }
        })
        
        .state( 'SIMS.home', {
            url: '/home',
            templateUrl: 'views/home/home.html',
            controller: "homeCtrl",
            controllerAs: "homeVM",
            data: {
              loginRequired: true
            },
            resolve: {
                loadMyCtrl: [ '$ocLazyLoad', function( $ocLazyLoad ) {
                    return $ocLazyLoad.load( [ 
                        {
                            name: 'SIMS.home',
                            files: [ 'scripts/home.js' ]
                        }
                    ] );
                } ]
            },
            onExit: function() {
                console.log( '' );
            }
        } )
    }
] );

routerApp.controller( 'SIMSCtrl', SIMSCtrl );

SIMSCtrl.$inject = [ '$rootScope' ];

function SIMSCtrl( $rootScope ) {
    
    $rootScope.blocklogin = true;
    
}

routerApp.factory( 'tokenAuthentication', tokenAuthentication );

tokenAuthentication.$inject = [];

function tokenAuthentication() {
    return {
        request: function( config ) {
            
            config.headers.tokenauthenticate = localStorage.getItem( 'userToken' );
            
            return config;
        }
    };
}

routerApp.run( [ '$rootScope', '$location', function( $rootScope, $location ) {
        
        $location.path( '/SIMS' );
            
        $rootScope.$on( '$stateChangeStart', function ( event, toState, toParams ) {
            var loginRequired = toState.data.loginRequired;

            if( $rootScope.blocklogin && loginRequired )
                window.location.reload();
        } );
        
    }
] );