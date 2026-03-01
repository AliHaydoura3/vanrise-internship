angular.module("myApp").controller("PhoneNumberModalCtrl", [
    "$uibModalInstance",
    "phoneNumber",
    "devices",
    "title",
    function ($uibModalInstance, phoneNumber, devices, title) {
        var modal = this;
        modal.item = phoneNumber;
        modal.devices = devices;
        modal.modalTitle = title;

        // Populated by the deviceSelector directive via its api attribute
        modal.deviceSelectorApi = {};

        modal.save = function () {
            // Use getData() from the directive to retrieve the selected device ID
            if (modal.deviceSelectorApi.getData) {
                modal.item.deviceId = modal.deviceSelectorApi.getData();
            }
            $uibModalInstance.close(modal.item);
        };

        modal.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    },
]);
