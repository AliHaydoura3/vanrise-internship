/**
 * phoneNumberSelector directive
 *
 * A reusable custom element that renders a phone-number <select>.
 * Phone numbers are loaded automatically from PhoneNumbersService.
 *
 * Usage:
 *   <phone-number-selector
 *       selected-value="vm.phoneNumberFilter"   <!-- two-way bound value (integer ID or null) -->
 *       on-change="vm.onPhoneNumberChange()"    <!-- optional: called after every selection change -->
 *       show-all-option="true"                  <!-- optional: prepend an "All phone numbers" option -->
 *       api="vm.phoneNumberSelectorApi">        <!-- optional: object populated with getData() -->
 *   </phone-number-selector>
 *
 * getData() returns the selected phone number ID (integer) or null when the empty option is active.
 */
angular.module("myApp").directive("phoneNumberSelector", function () {
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
            "PhoneNumbersService",
            function (PhoneNumbersService) {
                var vm = this;
                vm.phoneNumbers = [];

                // Load all phone numbers from the API
                PhoneNumbersService.list()
                    .then(function (phoneNumbers) {
                        vm.phoneNumbers = phoneNumbers;
                    })
                    .catch(function () {
                        vm.phoneNumbers = [];
                    });

                /**
                 * Returns the currently selected phone number ID (integer) or null if none selected.
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
            '        ng-options="pn.id as pn.number for pn in vm.phoneNumbers">' +
            '  <option value="">{{vm.showAllOption ? \'All phone numbers\' : \'Select a phone number\'}}</option>' +
            '</select>'
    };
});
