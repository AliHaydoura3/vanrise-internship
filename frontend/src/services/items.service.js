angular.module("myApp").service("ItemsService", [
  "$http",
  "$q",
  "$window",
  function ($http, $q, $window) {
    var self = this;
    var API_BASE = ($window && $window.API_BASE) || "";

    function apiUrl(path) {
      return (API_BASE && API_BASE.replace(/\/$/, "")) + path;
    }

    self.list = function (name) {
      var params = {};
      if (name && name.trim().length) params.name = name.trim();
      return $http
        .get(apiUrl("/api/devices"), { params: params })
        .then(function (resp) {
          return resp.data || [];
        })
        .catch(function (err) {
          console.error("Failed to fetch devices:", err);
          return $q.reject(err);
        });
    };

    self.add = function (item) {
      return $http
        .post(apiUrl("/api/devices"), item)
        .then(function (resp) {
          return resp.data;
        })
        .catch(function (err) {
          console.error("Failed to create device:", err);
          return $q.reject(err);
        });
    };

    self.update = function (item) {
      return $http
        .put(apiUrl("/api/devices/") + item.id, item)
        .then(function () {
          return item;
        })
        .catch(function (err) {
          console.error("Failed to update device:", err);
          return $q.reject(err);
        });
    };

    self.remove = function (item) {
      return $http
        .delete(apiUrl("/api/devices/") + item.id)
        .then(function () {
          return true;
        })
        .catch(function (err) {
          console.error("Failed to delete device:", err);
          return $q.reject(err);
        });
    };
  },
]);
