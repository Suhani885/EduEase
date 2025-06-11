app.controller("LoginController", [
  "$state",
  "api_request",
  function ($state, api_request) {
    var loginCtrl = this;
    loginCtrl.uname = "";
    loginCtrl.password = "";

    loginCtrl.login = function () {
      api_request.post_withdata(
        "edu_ease/signin/",
        {
          uname: loginCtrl.uname,
          passwd: loginCtrl.password,
        },
        function (response) {
          console.log(response);
          $state.go("landing");
        }
      );
    };
  },
]);
