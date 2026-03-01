angular.module("myApp").controller("ClientModalCtrl", [
    "$uibModalInstance",
    "client",
    "title",
    function ($uibModalInstance, client, title) {
        var vm = this;
        vm.modalTitle = title;
        vm.item = client || { name: "", type: null, birthDate: null };

        // Populated by the clientTypeSelector directive via its api attribute
        vm.typeSelectorApi = {};

        vm.save = function () {
            // Use getData() from the directive to retrieve the selected type
            var rawType = vm.typeSelectorApi.getData
                ? vm.typeSelectorApi.getData()
                : vm.item.type;
            vm.item.type = parseInt(rawType, 10);

            // if individual, birth date is mandatory
            if (vm.item.type === 0 && !vm.item.birthDate) {
                // keep modal open; the Save button should already be disabled via template
                return;
            }

            if (vm.item.type !== 0) vm.item.birthDate = null;
            $uibModalInstance.close(vm.item);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    },
]);
