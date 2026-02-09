angular.module("myApp").controller("ItemModalCtrl", [
  "$uibModalInstance",
  "item",
  "title",
  function ($uibModalInstance, item, title) {
    var modal = this;
    modal.item = item;
    modal.modalTitle = title;

    modal.save = function () {
      $uibModalInstance.close(modal.item);
    };

    modal.cancel = function () {
      $uibModalInstance.dismiss("cancel");
    };
  },
]);
