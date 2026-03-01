angular.module("myApp").controller("ClientsCtrl", [
    "$uibModal",
    "$q",
    "ClientsService",
    "ReservationsService",
    function ($uibModal, $q, ClientsService, ReservationsService) {
        var vm = this;
        vm.items = [];
        vm.query = "";
        vm.typeFilter = ""; // empty = all, '0' = Individual, '1' = Organization
        vm.results = [];
        vm.loading = false;
        vm.activeClientIds = {}; // map of clientId -> true for clients with active reservations

        // Populated by the clientTypeSelector directive via its api attribute
        vm.clientTypeSelectorApi = {};

        vm.refreshResults = function () {
            vm.loading = true;
            var typeParam = vm.typeFilter === "" ? null : parseInt(vm.typeFilter, 10);
            $q.all([
                ClientsService.list(vm.query, typeParam),
                ReservationsService.listActive()
            ]).then(function (results) {
                vm.items = results[0];
                vm.results = results[0].slice();
                // Build map of clientIds that currently have an active reservation
                vm.activeClientIds = {};
                results[1].forEach(function (r) {
                    vm.activeClientIds[r.clientId] = true;
                });
            }).catch(function () {
                vm.items = [];
                vm.results = [];
                vm.activeClientIds = {};
            }).finally(function () {
                vm.loading = false;
            });
        };

        vm.search = function () {
            vm.refreshResults();
        };

        // Called by on-change on the directive; receives the freshly-selected
        // value before the two-way `=` binding has had a chance to propagate.
        vm.filterByType = function (value) {
            vm.typeFilter = (value !== undefined) ? value : vm.typeFilter;
            vm.refreshResults();
        };

        /** Returns true if the client has at least one currently active reservation. */
        vm.hasActiveReservation = function (clientId) {
            return !!vm.activeClientIds[clientId];
        };

        // ── Reserve ───────────────────────────────────────────────────────

        vm.reserve = function (client) {
            var modal = $uibModal.open({
                templateUrl: "reserveModal.html",
                controller: function ($uibModalInstance) {
                    var m = this;
                    m.client = client;
                    m.phoneNumberId = null;
                    m.phoneNumberSelectorApi = {};
                    m.save = function () { $uibModalInstance.close(m.phoneNumberId); };
                    m.cancel = function () { $uibModalInstance.dismiss("cancel"); };
                },
                controllerAs: "m"
            });

            modal.result.then(function (phoneNumberId) {
                if (phoneNumberId != null) {
                    ReservationsService.add({ clientId: client.id, phoneNumberId: phoneNumberId })
                        .then(function () { vm.refreshResults(); })
                        .catch(function (err) { console.error(err); });
                }
            });
        };

        // ── Unreserve ─────────────────────────────────────────────────────

        vm.unreserve = function (client) {
            // Load the active reservations for this specific client so the modal
            // can show only the phone numbers the client currently holds.
            ReservationsService.listActive(client.id).then(function (activeReservations) {
                var modal = $uibModal.open({
                    templateUrl: "unreserveModal.html",
                    controller: function ($uibModalInstance) {
                        var m = this;
                        m.client = client;
                        m.activeReservations = activeReservations;
                        m.phoneNumberId = null;
                        m.confirm = function () { $uibModalInstance.close(m.phoneNumberId); };
                        m.cancel = function () { $uibModalInstance.dismiss("cancel"); };
                    },
                    controllerAs: "m"
                });

                modal.result.then(function (phoneNumberId) {
                    if (phoneNumberId != null) {
                        ReservationsService.unreserve({ clientId: client.id, phoneNumberId: phoneNumberId })
                            .then(function () { vm.refreshResults(); })
                            .catch(function (err) { console.error(err); });
                    }
                });
            }).catch(function (err) {
                console.error(err);
            });
        };

        vm.add = function () {
            var modal = $uibModal.open({
                templateUrl: "clientModal.html",
                controller: "ClientModalCtrl",
                controllerAs: "modalCtrl",
                resolve: {
                    client: function () {
                        return { name: "", type: null, birthDate: null };
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
                        copy.type = String(copy.type);
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
