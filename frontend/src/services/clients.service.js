angular.module("myApp").service("ClientsService", [
    "$http",
    "$q",
    "$window",
    function ($http, $q, $window) {
        var self = this;
        var API_BASE = ($window && $window.API_BASE) || "";

        function apiUrl(path) {
            return (API_BASE && API_BASE.replace(/\/$/, "")) + path;
        }

        self.list = function (name, type) {
            var params = {};
            if (name && name.trim().length) params.name = name.trim();
            if (typeof type !== "undefined" && type !== null && type !== "") params.type = type;
            return $http
                .get(apiUrl("/api/clients"), { params: params })
                .then(function (resp) {
                    return resp.data || [];
                })
                .catch(function (err) {
                    console.error("Failed to fetch clients:", err);
                    return $q.reject(err);
                });
        };

        self.add = function (client) {
            return $http
                .post(apiUrl("/api/clients"), client)
                .then(function (resp) {
                    return resp.data;
                })
                .catch(function (err) {
                    console.error("Failed to create client:", err);
                    return $q.reject(err);
                });
        };

        self.update = function (client) {
            return $http
                .put(apiUrl("/api/clients/") + client.id, client)
                .then(function () {
                    return client;
                })
                .catch(function (err) {
                    console.error("Failed to update client:", err);
                    return $q.reject(err);
                });
        };

        self.remove = function (client) {
            return $http
                .delete(apiUrl("/api/clients/") + client.id)
                .then(function () {
                    return true;
                })
                .catch(function (err) {
                    console.error("Failed to delete client:", err);
                    return $q.reject(err);
                });
        };
    },
]);
