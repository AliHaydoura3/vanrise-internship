angular.module("myApp").controller("MainCtrl", [
  "$uibModal",
  "ItemsService",
  function ($uibModal, ItemsService) {
    var vm = this;
    vm.items = ItemsService.list();
    vm.query = "";
    vm.results = vm.items.slice();

    vm.refreshResults = function () {
      var q = (vm.query || "").toLowerCase();
      if (!q) {
        vm.results = vm.items.slice();
        return;
      }
      vm.results = vm.items.filter(function (it) {
        return (it.name || "").toLowerCase().indexOf(q) !== -1;
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
          ItemsService.add(result);
          vm.refreshResults();
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
          ItemsService.update(result);
          vm.refreshResults();
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
        ItemsService.remove(item);
        vm.refreshResults();
      });
    };

    vm.refreshResults();
  },
]);
