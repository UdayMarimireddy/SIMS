(function() {
    'use strict';

    angular.module("SIMS.home", [])
        .controller("homeCtrl", homeCtrl)
        .factory("homeService", homeService);

    homeCtrl.$inject = ['$rootScope', '$scope', '$state', 'homeService', 'Notification', 'NgTableParams'];

    function homeCtrl($rootScope, $scope, $state, homeService, Notification, NgTableParams) {
        var THIS = this;
        
        _init();
        
        function _init()
        {
            getAllStudentDetails();
        }
        
        function getAllStudentDetails()
        {
            homeService
                    .getAllStudentDetails()
                    .then( function ( success ) {
                        
                        THIS.studentDetails = new NgTableParams( {}, { dataset: success.data } );
                        
                    }, function ( error ) {
                        
                        console.log( error );
                        Notification.error(error.data);
                        
                    } );
        }
                
        $( 'ul li' ).click( function() {
            $( 'li' ).removeClass( 'active' );
            $( this ).addClass( 'active' );
        } );
        
        $( '#home' ).height( $(window ).height() - 192 );
        
        $( window ).resize( function() {
            $( '#home' ).height( $( window ).height() - 192 );
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

            sessionStorage.removeItem( 'userToken' );

            Notification.success( "Signout Successful!!" );
            $state.go( 'SIMS' );
        };   
        
    }

    homeService.$inject = ['$http'];

    function homeService($http) {

        function getAllStudentDetails( )
        {
            return $http( {
                method: 'GET',
                url: '/SIMS/getAllStudentDetails/'
            } );
        }
        
        return {
            getAllStudentDetails: getAllStudentDetails
        };
    }
})();