angular.module("myApp").controller("ClientModalCtrl", [
    "$uibModalInstance",
    "client",
    "title",
    function ($uibModalInstance, client, title) {
        var vm = this;
        vm.modalTitle = title;
        vm.item = client || { name: "", type: 0, birthDate: null };

        vm.save = function () {
            // normalize: if type != Individual, clear birthDate
            if (vm.item.type !== 0) vm.item.birthDate = null;
            $uibModalInstance.close(vm.item);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    },
]);
