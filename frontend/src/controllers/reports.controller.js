// ── Report 1: Number of Clients per Type ─────────────────────────────────────
angular.module("myApp").controller("ClientsReportCtrl", [
    "ReportsService",
    function (ReportsService) {
        var vm = this;
        vm.results = [];
        vm.loading = false;
        vm.typeFilter = "";      // "" = all, "0" = Individual, "1" = Organization
        vm.typeSelectorApi = {};

        vm.filterByType = function (value) {
            vm.typeFilter = (value !== undefined) ? value : vm.typeFilter;
            vm.refreshResults();
        };

        vm.refreshResults = function () {
            vm.loading = true;
            var typeParam = vm.typeFilter === "" ? null : parseInt(vm.typeFilter, 10);
            ReportsService.getClientsPerType(typeParam)
                .then(function (data) { vm.results = data; })
                .catch(function () { vm.results = []; })
                .finally(function () { vm.loading = false; });
        };

        vm.refreshResults();
    }
]);

// ── Report 2: Reserved/Unreserved Phone Numbers per Device ────────────────────
angular.module("myApp").controller("PhoneNumbersReportCtrl", [
    "ReportsService",
    function (ReportsService) {
        var vm = this;
        vm.results = [];
        vm.loading = false;
        vm.deviceFilter = null;   // integer device ID or null
        vm.statusFilter = "";     // "" = all, "Reserved", "Unreserved"
        vm.deviceSelectorApi = {};

        vm.filterByDevice = function (value) {
            vm.deviceFilter = (value !== undefined) ? value : vm.deviceFilter;
            vm.refreshResults();
        };

        vm.filterByStatus = function (value) {
            vm.statusFilter = (value !== undefined) ? value : vm.statusFilter;
            vm.refreshResults();
        };

        vm.refreshResults = function () {
            vm.loading = true;
            var statusParam = vm.statusFilter || null;
            ReportsService.getPhoneNumberStatus(vm.deviceFilter, statusParam)
                .then(function (data) { vm.results = data; })
                .catch(function () { vm.results = []; })
                .finally(function () { vm.loading = false; });
        };

        vm.refreshResults();
    }
]);
