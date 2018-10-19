(function() {
    'use strict';

    angular.module("SIMS.home", [])
        .controller("homeCtrl", homeCtrl)
        .factory("homeService", homeService);

    homeCtrl.$inject = ['$rootScope', '$scope', '$state', 'homeService', 'Notification'];

    function homeCtrl($rootScope, $scope, $state, homeService, Notification) {
                
        $( 'ul li' ).click( function() {
            $( 'li' ).removeClass( 'active' );
            $( this ).addClass( 'active' );
        } );
        
        $( '#home' ).height( $(window).height() - 100 );
        
        $( window ).resize( function() {
            $( '#home' ).height( $( window ).height() - 100 );
        } );
        
        $( '#toggleMenu' ).click( function() {
            $( '#toggleMenuDisplay' ).slideToggle();
        } );
        
        $( '._close' ).click( function() {
            $( '#toggleMenuDisplay' ).slideUp();
        } );
        
        $scope.logout = function()
        {
            $rootScope.blocklogin = true;

            localStorage.removeItem( 'userToken' );

            Notification.success( "Signout Successful!!" );
            $state.go( 'SIMS' );
        };   
        
    }

    homeService.$inject = ['$http'];

    function homeService($http) {

        return {
            
        };
    }
})();