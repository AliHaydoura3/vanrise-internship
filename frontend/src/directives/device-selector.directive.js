/**
 * deviceSelector directive
 *
 * A reusable custom element that renders a device <select>.
 * Devices are loaded automatically from ItemsService.
 *
 * Usage:
 *   <device-selector
 *       selected-value="vm.deviceFilter"  <!-- two-way bound value (integer device ID or null) -->
 *       on-change="vm.onDeviceChange()"   <!-- optional: called after every selection change -->
 *       show-all-option="true"            <!-- optional: prepend an "All devices" option -->
 *       api="vm.deviceSelectorApi">       <!-- optional: object populated with getData() -->
 *   </device-selector>
 *
 * The directive exposes a getData() method two ways:
 *   1. Via the api object:  vm.deviceSelectorApi.getData()  → selected device ID (int) or null
 *   2. Via the DOM element: element[0].getData()
 *
 * Note: ng-options preserves the original integer type for device IDs.
 * When the empty option ("All devices" / "Select a device") is selected, getData() returns null.
 */
angular.module("myApp").directive("deviceSelector", function () {
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
            "ItemsService",
            function (ItemsService) {
                var vm = this;
                vm.devices = [];

                // Load devices from the API
                ItemsService.list()
                    .then(function (devices) {
                        vm.devices = devices;
                    })
                    .catch(function () {
                        vm.devices = [];
                    });

                /**
                 * Returns the currently selected device ID (integer) or null if none selected.
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
            '        ng-options="device.id as device.name for device in vm.devices">' +
            '  <option value="">{{vm.showAllOption ? \'All devices\' : \'Select a device\'}}</option>' +
            '</select>'
    };
});
