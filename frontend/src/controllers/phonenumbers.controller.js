angular.module("myApp").controller("PhoneNumbersCtrl", [
    "$uibModal",
    "PhoneNumbersService",
    "ItemsService",
    function ($uibModal, PhoneNumbersService, ItemsService) {
        var vm = this;
        vm.items = [];
        vm.query = "";
        vm.deviceFilter = null;  // null = all devices; integer = filter by device ID
        vm.devices = [];
        vm.results = [];
        vm.loading = false;

        // Populated by the deviceSelector directive via its api attribute
        vm.deviceSelectorApi = {};

        // Load available devices for the filter dropdown
        vm.loadDevices = function () {
            ItemsService.list()
                .then(function (devices) {
                    vm.devices = devices;
                })
                .catch(function () {
                    vm.devices = [];
                });
        };

        vm.refreshResults = function () {
            vm.loading = true;
            // deviceFilter is null for "all" or an integer device ID
            var deviceParam = vm.deviceFilter || null;
            PhoneNumbersService.list(vm.query, deviceParam)
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

        // Called by on-change on the directive; receives the freshly-selected
        // value before the two-way `=` binding has had a chance to propagate.
        vm.filterByDevice = function (value) {
            vm.deviceFilter = (value !== undefined) ? value : vm.deviceFilter;
            vm.refreshResults();
        };

        vm.add = function () {
            var modal = $uibModal.open({
                templateUrl: "phoneNumberModal.html",
                controller: "PhoneNumberModalCtrl",
                controllerAs: "modalCtrl",
                resolve: {
                    phoneNumber: function () {
                        return { number: "", deviceId: null };
                    },
                    devices: function () {
                        return vm.devices;
                    },
                    title: function () {
                        return "Add";
                    },
                },
            });

            modal.result.then(function (result) {
                if (result) {
                    PhoneNumbersService.add(result)
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
                templateUrl: "phoneNumberModal.html",
                controller: "PhoneNumberModalCtrl",
                controllerAs: "modalCtrl",
                resolve: {
                    phoneNumber: function () {
                        return angular.copy(item);
                    },
                    devices: function () {
                        return vm.devices;
                    },
                    title: function () {
                        return "Edit";
                    },
                },
            });

            modal.result.then(function (result) {
                if (result) {
                    PhoneNumbersService.update(result)
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
                PhoneNumbersService.remove(item.id)
                    .then(function () {
                        vm.refreshResults();
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            });
        };

        vm.loadDevices();
        vm.refreshResults();
    },
]);
