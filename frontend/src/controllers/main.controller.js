angular.module("myApp").controller("MainCtrl", [
  "$scope",
  "$uibModal",
  "ItemsService",
  "AuthService",
  function ($scope, $uibModal, ItemsService, AuthService) {
    var vm = this;

    // ── Authentication ───────────────────────────────────────────────
    // always start logged out; wipe any saved credentials so login page is shown
    AuthService.logout();
    vm.loggedIn = false;
    vm.currentUser = null;

    vm.getInitials = function () {
      return vm.currentUser ? vm.currentUser.username.substring(0, 2).toUpperCase() : "?";
    };

    vm.logout = function () {
      AuthService.logout();
      vm.loggedIn = false;
      vm.currentUser = null;
    };

    // Receive login-success event broadcast from LoginCtrl
    $scope.$on("userLoggedIn", function (event, data) {
      console.log("MainCtrl: received userLoggedIn", data.username);
      vm.loggedIn = true;
      vm.currentUser = { username: data.username };
      vm.refreshResults();
    });



    // ── Devices ──────────────────────────────────────────────────────
    vm.items = [];
    vm.query = "";
    vm.results = [];
    vm.loading = false;

    vm.refreshResults = function () {
      vm.loading = true;
      ItemsService.list(vm.query)
        .then(function (items) {
          vm.items = items;
          vm.results = items.slice();
        })
        .catch(function () {
          vm.items = [];
          vm.results = [];
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.search = function () {
      vm.refreshResults();
    };

    vm.add = function () {
      var modal = $uibModal.open({
        templateUrl: "itemModal.html",
        controller: "ItemModalCtrl",
        controllerAs: "modalCtrl",
        resolve: {
          item: function () {
            return { name: "" };
          },
          title: function () {
            return "Add";
          },
        },
      });

      modal.result.then(function (result) {
        if (result) {
          ItemsService.add(result)
            .then(function () {
              vm.refreshResults();
            })
            .catch(function (err) {
              console.error(err);
            });
        }
      });
    };

    vm.edit = function (item) {
      var modal = $uibModal.open({
        templateUrl: "itemModal.html",
        controller: "ItemModalCtrl",
        controllerAs: "modalCtrl",
        resolve: {
          item: function () {
            return angular.copy(item);
          },
          title: function () {
            return "Edit";
          },
        },
      });

      modal.result.then(function (result) {
        if (result) {
          ItemsService.update(result)
            .then(function () {
              vm.refreshResults();
            })
            .catch(function (err) {
              console.error(err);
            });
        }
      });
    };

    vm.confirmDelete = function (item) {
      var modal = $uibModal.open({
        templateUrl: "confirmDelete.html",
        controller: [
          "$uibModalInstance",
          "item",
          function ($uibModalInstance, item) {
            var m = this;
            m.item = item;
            m.confirm = function () {
              $uibModalInstance.close(true);
            };
            m.cancel = function () {
              $uibModalInstance.dismiss("cancel");
            };
          },
        ],
        controllerAs: "m",
        resolve: {
          item: function () {
            return item;
          },
        },
      });

      modal.result.then(function () {
        ItemsService.remove(item)
          .then(function () {
            vm.refreshResults();
          })
          .catch(function (err) {
            console.error(err);
          });
      });
    };

    if (vm.loggedIn) {
      vm.refreshResults();
    }
  },
]);
