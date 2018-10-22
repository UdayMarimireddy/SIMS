var routerApp = angular.module( 'SIMS', 
                                [ 'ui.bootstrap',
                                    'ui.router',
                                    'oc.lazyLoad',
                                    'ngRoute',
                                    'ui-notification',
                                    'ngTable'
                                ] );

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
        
        .state( 'SIMS.home.about', {
            url: '/about',
            templateUrl: 'views/about/about.html',
            data: {
              loginRequired: true
            }
        } )
    }
] );

routerApp.controller( 'SIMSCtrl', SIMSCtrl );

SIMSCtrl.$inject = [ '$rootScope' ];

function SIMSCtrl( $rootScope ) {
    
    $rootScope.blocklogin = true;
    
}

routerApp.factory( 'SIMSFactory', SIMSFactory );

SIMSFactory.$inject = [ '$window' ];

function SIMSFactory( $window ) {
    var service = {};
    
    service.getCurrentLoggedinIUser = function()
    {
        if( sessionStorage[ 'userToken' ] )
        {
            var parsedToken = parseJWT( sessionStorage[ 'userToken' ] );

            return parsedToken.username;
        }
        else
        {
            return '';
        }
    };
    
    //ParseJWT as function to be later used in another service method inside this service
    function parseJWT( token )
    {
        if( !token )
            return;
        
        var base64Url = token.split( '.' )[ 1 ];
        var base64    = base64Url.replace( '-', '+' ).replace( '_', '/' );
        
        return JSON.parse( $window.atob( base64 ) );
    };

    return service;
}

routerApp.factory( 'tokenAuthentication', tokenAuthentication );

tokenAuthentication.$inject = [];

function tokenAuthentication() {
    return {
        request: function( config ) {
            
            config.headers.tokenauthenticate = sessionStorage.getItem( 'userToken' );
            
            return config;
        }
    };
}

routerApp.run( [ '$rootScope', '$location', 'SIMSFactory', function( $rootScope, $location, SIMSFactory ) {
        
        $rootScope.$on( '$stateChangeStart', function ( event, toState, toParams ) {
            
            var loggedInUser = SIMSFactory.getCurrentLoggedinIUser();

            if ( !loggedInUser )
            {
                $location.path( '/SIMS' );
            }
        } );
        
    }
] );