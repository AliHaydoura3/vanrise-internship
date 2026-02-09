angular.module("myApp").service("ItemsService", [
  "$window",
  function ($window) {
    var self = this;
    var STORAGE_KEY = "devices";

    self._items = [];
    self._nextId = 1;

    function persist() {
      try {
        $window.localStorage.setItem(
          STORAGE_KEY,
          angular.toJson({ items: self._items, nextId: self._nextId }),
        );
      } catch (e) {
        console.error("Failed to persist items:", e);
      }
    }

    function load() {
      try {
        var raw = $window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          var data = angular.fromJson(raw);
          self._items = data.items || [];
          self._nextId = data.nextId || self._items.length + 1;
          return;
        }
      } catch (e) {
        console.error("Failed to load items:", e);
      }

      persist();
    }

    load();

    self.list = function () {
      return self._items;
    };

    self.add = function (item) {
      item.id = self._nextId++;
      self._items.push(angular.copy(item));
      persist();
    };

    self.update = function (item) {
      for (var i = 0; i < self._items.length; i++) {
        if (self._items[i].id === item.id) {
          self._items[i] = angular.copy(item);
          persist();
          return;
        }
      }
    };

    self.remove = function (item) {
      for (var i = 0; i < self._items.length; i++) {
        if (self._items[i].id === item.id) {
          self._items.splice(i, 1);
          persist();
          return;
        }
      }
    };
  },
]);
