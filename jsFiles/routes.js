app.config([
  "$urlRouterProvider",
  "$stateProvider",
  function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "templateFiles/login.html",
        controller: "LoginController",
        controllerAs: "loginCtrl",
      })
      .state("landing", {
        url: "/",
        templateUrl: "templateFiles/landing.html",
        controller: "LandingController",
        controllerAs: "landingCtrl",
      })
      .state("pdf", {
        url: "/pdf",
        templateUrl: "templateFiles/pdf.html",
        controller: "pdfController",
        controllerAs: "pdfCtrl",
      })
      .state("flash", {
        url: "/flashcard",
        templateUrl: "templateFiles/flashcard.html",
        controller: "flashController",
        controllerAs: "flashCtrl",
      });
  },
]);
