angular.module("myApp").service("ReservationsService", [
    "$http",
    "$q",
    "$window",
    function ($http, $q, $window) {
        var self = this;
        var API_BASE = ($window && $window.API_BASE) || "";

        function apiUrl(path) {
            return (API_BASE && API_BASE.replace(/\/$/, "")) + path;
        }

        /**
         * List all reservations with optional filters.
         * @param {number|null} clientId
         * @param {number|null} phoneNumberId
         * @returns Promise<PhoneNumberReservationDTO[]>
         */
        self.list = function (clientId, phoneNumberId) {
            var params = {};
            if (clientId != null) params.clientId = clientId;
            if (phoneNumberId != null) params.phoneNumberId = phoneNumberId;
            return $http
                .get(apiUrl("/api/phonenumberreservations"), { params: params })
                .then(function (resp) {
                    return resp.data || [];
                })
                .catch(function (err) {
                    console.error("Failed to fetch reservations:", err);
                    return $q.reject(err);
                });
        };

        /**
         * List only currently active reservations.
         * @param {number|null} clientId  — pass null to get all active reservations
         * @returns Promise<PhoneNumberReservationDTO[]>
         */
        self.listActive = function (clientId) {
            var params = {};
            if (clientId != null) params.clientId = clientId;
            return $http
                .get(apiUrl("/api/phonenumberreservations/active"), { params: params })
                .then(function (resp) {
                    return resp.data || [];
                })
                .catch(function (err) {
                    console.error("Failed to fetch active reservations:", err);
                    return $q.reject(err);
                });
        };

        /**
         * Create a new reservation. BED and EED are set server-side.
         * @param {{ clientId: number, phoneNumberId: number }} reservation
         * @returns Promise<PhoneNumberReservation>
         */
        self.add = function (reservation) {
            return $http
                .post(apiUrl("/api/phonenumberreservations"), reservation)
                .then(function (resp) {
                    return resp.data;
                })
                .catch(function (err) {
                    console.error("Failed to create reservation:", err);
                    return $q.reject(err);
                });
        };

        /**
         * End the active reservation for a client+phone number pair (sets EED = now).
         * @param {{ clientId: number, phoneNumberId: number }} request
         * @returns Promise
         */
        self.unreserve = function (request) {
            return $http
                .post(apiUrl("/api/phonenumberreservations/unreserve"), request)
                .then(function () {
                    return true;
                })
                .catch(function (err) {
                    console.error("Failed to unreserve:", err);
                    return $q.reject(err);
                });
        };

        /**
         * Delete a reservation record entirely by ID.
         * @param {number} id
         * @returns Promise
         */
        self.remove = function (id) {
            return $http
                .delete(apiUrl("/api/phonenumberreservations/") + id)
                .then(function () {
                    return true;
                })
                .catch(function (err) {
                    console.error("Failed to delete reservation:", err);
                    return $q.reject(err);
                });
        };
    }
]);
