angular.module("myApp").controller("ReservationsCtrl", [
    "$uibModal",
    "ReservationsService",
    function ($uibModal, ReservationsService) {
        var vm = this;
        vm.results = [];
        vm.loading = false;

        // Filter values — bound via the directives' selected-value attributes
        vm.clientFilter = null;  // integer client ID or null (= all)
        vm.phoneNumberFilter = null;  // integer phone number ID or null (= all)

        // API objects populated by the selector directives in the link phase
        vm.clientSelectorApi = {};
        vm.phoneNumberSelectorApi = {};

        // ── Data loading ───────────────────────────────────────────────────

        vm.refreshResults = function () {
            vm.loading = true;
            ReservationsService.list(vm.clientFilter, vm.phoneNumberFilter)
                .then(function (items) {
                    vm.results = items;
                })
                .catch(function () {
                    vm.results = [];
                })
                .finally(function () {
                    vm.loading = false;
                });
        };

        // ── Filter callbacks (triggered by on-change on the directives) ────
        // Receive the freshly-selected value directly so we don't depend on
        // the two-way `=` binding having propagated before the API call.

        vm.filterByClient = function (value) {
            vm.clientFilter = (value !== undefined) ? value : vm.clientFilter;
            vm.refreshResults();
        };

        vm.filterByPhoneNumber = function (value) {
            vm.phoneNumberFilter = (value !== undefined) ? value : vm.phoneNumberFilter;
            vm.refreshResults();
        };

        // ── Delete ─────────────────────────────────────────────────────────

        vm.confirmDelete = function (item) {
            var modal = $uibModal.open({
                templateUrl: "confirmDelete.html",
                controller: [
                    "$uibModalInstance",
                    "item",
                    function ($uibModalInstance, item) {
                        var m = this;
                        m.item = item;
                        m.confirm = function () { $uibModalInstance.close(true); };
                        m.cancel = function () { $uibModalInstance.dismiss("cancel"); };
                    }
                ],
                controllerAs: "m",
                resolve: {
                    // Reuse the generic confirmDelete template; pass a display label as 'name'
                    item: function () {
                        return {
                            name: item.phoneNumber + "  \u2192  " + item.clientName
                        };
                    }
                }
            });

            modal.result.then(function () {
                ReservationsService.remove(item.id)
                    .then(function () {
                        vm.refreshResults();
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            });
        };

        // ── Bootstrap ──────────────────────────────────────────────────────
        vm.refreshResults();
    }
]);
