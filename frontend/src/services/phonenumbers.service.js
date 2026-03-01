angular.module("myApp").service("PhoneNumbersService", [
    "$http",
    "$q",
    "$window",
    function ($http, $q, $window) {
        var self = this;
        var API_BASE = ($window && $window.API_BASE) || "";

        function apiUrl(path) {
            return (API_BASE && API_BASE.replace(/\/$/, "")) + path;
        }

        self.list = function (number, deviceId) {
            var params = {};
            if (number && number.trim().length) params.number = number.trim();
            if (typeof deviceId !== "undefined" && deviceId !== null && deviceId !== "") params.deviceId = deviceId;
            return $http
                .get(apiUrl("/api/phonenumbers"), { params: params })
                .then(function (resp) {
                    return resp.data || [];
                })
                .catch(function (err) {
                    console.error("Failed to fetch phone numbers:", err);
                    return $q.reject(err);
                });
        };

        self.add = function (phoneNumber) {
            return $http
                .post(apiUrl("/api/phonenumbers"), phoneNumber)
                .then(function (resp) {
                    return resp.data;
                })
                .catch(function (err) {
                    console.error("Failed to create phone number:", err);
                    return $q.reject(err);
                });
        };

        self.update = function (phoneNumber) {
            return $http
                .put(apiUrl("/api/phonenumbers/") + phoneNumber.id, phoneNumber)
                .then(function () {
                    return phoneNumber;
                })
                .catch(function (err) {
                    console.error("Failed to update phone number:", err);
                    return $q.reject(err);
                });
        };

        self.remove = function (id) {
            return $http
                .delete(apiUrl("/api/phonenumbers/") + id)
                .then(function () {
                    return true;
                })
                .catch(function (err) {
                    console.error("Failed to delete phone number:", err);
                    return $q.reject(err);
                });
        };

        return self;
    }
]);
