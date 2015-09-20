// Generated by CoffeeScript 1.10.0
(function() {
  var UserController;

  UserController = (function() {
    function UserController(user_service, token_service, $location, $mdDialog) {
      this.user_service = user_service;
      this.token_service = token_service;
      this.$location = $location;
      this.$mdDialog = $mdDialog;
    }

    UserController.prototype.handle_request = function(res) {
      var token;
      token = res.data ? res.data.token : null;
      if (token) {
        return console.log("got token: " + token);
      }
    };

    UserController.prototype.login = function() {
      return this.user_service.login(this.email, this.password).then((function(_this) {
        return function(res) {
          if (!res.data.authenticated) {
            return console.log('Auth failed');
          } else {
            socket.emit('user logged in: ', self.email);
            return _this.$location.path('/');
          }
        };
      })(this), this.handle_request);
    };

    UserController.prototype.register = function() {
      return this.user_service.register(this.email, this.password).then(this.handle_request, this.handle_request);
    };

    UserController.prototype.logout = function() {
      this.token_service["delete"]();
      socket.emit('user logged out');
      return this.$location.path('/login');
    };

    UserController.prototype.is_logged_in = function() {
      return Boolean(this.token_service.get());
    };

    UserController.prototype.get_id = function() {
      return this.token_service.payload().id;
    };

    return UserController;

  })();

  UserController.$inject = ['user_service', 'token_service', '$location', '$mdDialog'];

  client.controller('User', UserController);

}).call(this);

//# sourceMappingURL=controller.js.map
