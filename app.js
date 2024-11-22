const app = angular.module('app', ['ui.router','ui.bootstrap']);
var baseUrl = 'https://10.21.123.27:8080';

app.service("api_request", ["$http", function($http) {
    this.get_withdata = function(path, callback) {
        var req = {
            method: 'GET',
            url: `${baseUrl}/${path}`,
            withCredentials: true
        };
        $http(req).then(function(response) {
            callback(response.data);
        }, function(err) {
            console.log("Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.data.error || "An unexpected error occurred. Please try again!"
            });
        });
    };

    this.post_withdata = function(path, data, callback) {
        var req = {
            method: 'POST',
            url: `${baseUrl}/${path}`,
            data: data,
            withCredentials: true
        };
        $http(req).then(function(response) {
            callback(response.data);
        }, function(err) {
            console.log("Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.data.error || "An unexpected error occurred. Please try again!"
            });
        });
    };

    this.patch_withdata = function(path, data, callback) {
        var req = {
            method: 'PATCH',
            url: `${baseUrl}/${path}`,
            data: data,
            withCredentials: true
        };
        $http(req).then(function(response) {
            callback(response.data);
        }, function(err) {
            console.log("Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.data.error || "An unexpected error occurred. Please try again!"
            });
        });
    };
}]);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'files/login.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl'
        })
        .state('landing', {
            url: '/landing',
            templateUrl: 'files/landing.html',
            controller: 'LandingController',
            controllerAs: 'landingCtrl'
        })
        .state('pdf', {
            url: '/pdf',
            templateUrl: 'files/pdf.html',
            controller: 'pdfController',
            controllerAs: 'pdfCtrl'
        }) 
        .state('flash', {
            url: '/flashcard',
            templateUrl: 'files/flashcard.html',
            controller: 'flashController',
            controllerAs: 'flashCtrl'
        }) 
        .state('career', {
            url: '/career',
            templateUrl: 'files/career.html',
            controller: 'careerController',
            controllerAs: 'careerCtrl'
        }) 
}]);

app.controller('LoginController',['$state','api_request', function ($state,api_request) {
    var loginCtrl = this;
    loginCtrl.email = '';
    loginCtrl.password = '';

    loginCtrl.login = function() {
        api_request.post_withdata('edu_ease/signin/', {
            "uname": loginCtrl.email,
            "passwd": loginCtrl.password
        }, function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.message
            }).then(() => {
                $state.go('landing');
            });
        });
    };
}]);

app.controller('LandingController',['$state','api_request', function ($state,api_request) {
    var landingCtrl = this;

}]);

app.controller('careerController',['$state','api_request', function ($state,api_request) {
    var careerCtrl = this;

}]);

app.controller('pdfController', ['api_request', '$http', function(api_request, $http) {
    var pdfCtrl = this;
    pdfCtrl.messages = [];
    
    pdfCtrl.fetchResponses = function() {
        api_request.post_withdata('edu_ease/ask_question/', {
            "question": pdfCtrl.question,
        }, function(response) {
            console.log(response);
            pdfCtrl.messages.push({
                type: 'user',
                answer: pdfCtrl.question
            });
            pdfCtrl.messages.push({
                type: 'assistant',
                answer: response.answer
            });
            pdfCtrl.question = '';
        });
    };

    pdfCtrl.file = function(element) {
        pdfCtrl.file = element.files[0];
    };

    pdfCtrl.files = function(element) {
        pdfCtrl.files = element.files[0];
    };

    pdfCtrl.uploadDocs = function() {
        var formData = new FormData();
        formData.append('files', pdfCtrl.file);
        formData.append('files', pdfCtrl.files);

        var req = {
            method: 'POST',
            url: `${baseUrl}/edu_ease/upload_doc/`,
            headers: {'Content-Type': undefined},
            data: formData,
            withCredentials: true,
            transformRequest: angular.identity
        };

        $http(req).then(function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.message
            })
        }, function(error) {
            console.log("error", error);
        });
    };
}]);





    