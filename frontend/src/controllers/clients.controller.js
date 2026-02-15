angular.module("myApp").controller("ClientsCtrl", [
    "$uibModal",
    "ClientsService",
    function ($uibModal, ClientsService) {
        var vm = this;
        vm.items = [];
        vm.query = "";
        vm.typeFilter = ""; // empty = all, '0' = Individual, '1' = Organization
        vm.results = [];
        vm.loading = false;

        vm.refreshResults = function () {
            vm.loading = true;
            var typeParam = vm.typeFilter === "" ? null : parseInt(vm.typeFilter, 10);
            ClientsService.list(vm.query, typeParam)
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

        // Apply type filter immediately — use current name input value so selecting a type
        // preserves the name filter (no need to click Search again).
        vm.filterByType = function () {
            vm.loading = true;
            var typeParam = vm.typeFilter === "" ? null : parseInt(vm.typeFilter, 10);
            ClientsService.list(vm.query, typeParam)
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

        vm.add = function () {
            var modal = $uibModal.open({
                templateUrl: "clientModal.html",
                controller: "ClientModalCtrl",
                controllerAs: "modalCtrl",
                resolve: {
                    client: function () {
                        return { name: "", type: 0, birthDate: null };
                    },
                    title: function () {
                        return "Add";
                    },
                },
            });

            modal.result.then(function (result) {
                if (result) {
                    // ensure birthDate is null for organizations
                    if (result.type !== 0) result.birthDate = null;
                    ClientsService.add(result)
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
                templateUrl: "clientModal.html",
                controller: "ClientModalCtrl",
                controllerAs: "modalCtrl",
                resolve: {
                    client: function () {
                        // convert UTC/ISO date string to JS Date for date input
                        var copy = angular.copy(item);
                        if (copy.birthDate) copy.birthDate = new Date(copy.birthDate);
                        return copy;
                    },
                    title: function () {
                        return "Edit";
                    },
                },
            });

            modal.result.then(function (result) {
                if (result) {
                    if (result.type !== 0) result.birthDate = null;
                    ClientsService.update(result)
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
                ClientsService.remove(item)
                    .then(function () {
                        vm.refreshResults();
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            });
        };

        vm.refreshResults();
    },
]);
