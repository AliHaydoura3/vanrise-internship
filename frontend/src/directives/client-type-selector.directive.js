/**
 * clientTypeSelector directive
 *
 * A reusable custom element that renders a client-type <select>.
 *
 * Usage:
 *   <client-type-selector
 *       selected-value="vm.typeFilter"   <!-- two-way bound value ("0", "1", or "") -->
 *       on-change="vm.onTypeChange()"    <!-- optional: called after every selection change -->
 *       show-all-option="true"           <!-- optional: prepend an "All types" option -->
 *       api="vm.typeSelectorApi">        <!-- optional: object populated with getData() -->
 *   </client-type-selector>
 *
 * The directive exposes a getData() method two ways:
 *   1. Via the api object:  vm.typeSelectorApi.getData()  → selected value
 *   2. Via the DOM element: element[0].getData()
 */
angular.module("myApp").directive("clientTypeSelector", function () {
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
        controller: function () {
            var vm = this;

            /**
             * Returns the currently selected client-type value.
             * Value is a string: "0" (Individual), "1" (Organization), or "" (all).
             */
            vm.getData = function () {
                return vm.selectedValue;
            };

            // Called by ng-change inside the template; passes the new value
            // immediately so the parent callback doesn't need to rely on the
            // two-way `=` binding having propagated yet.
            vm.handleChange = function () {
                if (vm.onChange) {
                    vm.onChange({ value: vm.selectedValue });
                }
            };
        },
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
            '        ng-change="vm.handleChange()">' +
            '  <option ng-if="vm.showAllOption" value="">All types</option>' +
            '  <option value="0">Individual</option>' +
            '  <option value="1">Organization</option>' +
            '</select>'
    };
});
