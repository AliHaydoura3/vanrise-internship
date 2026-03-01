/**
 * clientSelector directive
 *
 * A reusable custom element that renders a client <select>.
 * Clients are loaded automatically from ClientsService.
 *
 * Usage:
 *   <client-selector
 *       selected-value="vm.clientFilter"   <!-- two-way bound value (integer client ID or null) -->
 *       on-change="vm.onClientChange()"    <!-- optional: called after every selection change -->
 *       show-all-option="true"             <!-- optional: prepend an "All clients" option -->
 *       api="vm.clientSelectorApi">        <!-- optional: object populated with getData() -->
 *   </client-selector>
 *
 * getData() returns the selected client ID (integer) or null when the empty option is active.
 */
angular.module("myApp").directive("clientSelector", function () {
    return {
        restrict: "E",
        scope: {},
        bindToController: {
            selectedValue: "=",
            onChange: "&?",
            showAllOption: "@?",
            api: "=?"
        },
        controllerAs: "vm",
        controller: [
            "ClientsService",
            function (ClientsService) {
                var vm = this;
                vm.clients = [];

                // Load all clients from the API
                ClientsService.list()
                    .then(function (clients) {
                        vm.clients = clients;
                    })
                    .catch(function () {
                        vm.clients = [];
                    });

                /**
                 * Returns the currently selected client ID (integer) or null if none selected.
                 */
                vm.getData = function () {
                    return vm.selectedValue != null ? vm.selectedValue : null;
                };

                // Called by ng-change inside the template; passes the new value
                // immediately so the parent callback doesn't need to rely on the
                // two-way `=` binding having propagated yet.
                vm.handleChange = function () {
                    if (vm.onChange) {
                        vm.onChange({ value: vm.selectedValue });
                    }
                };
            }
        ],
        link: function (scope, element, attrs, ctrl) {
            // Populate the optional api object so the parent can call getData()
            if (ctrl.api) {
                ctrl.api.getData = ctrl.getData;
            }
            // Also attach getData() directly to the DOM element
            element[0].getData = ctrl.getData;
        },
        template:
            '<select class="form-control" ' +
            '        ng-model="vm.selectedValue" ' +
            '        ng-change="vm.handleChange()" ' +
            '        ng-options="client.id as client.name for client in vm.clients">' +
            '  <option value="">{{vm.showAllOption ? \'All clients\' : \'Select a client\'}}</option>' +
            '</select>'
    };
});
