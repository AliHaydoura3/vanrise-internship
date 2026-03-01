angular.module("myApp").service("ReportsService", [
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
         * Report 1 – number of clients per type.
         * @param {number|null} type  0 = Individual, 1 = Organization, null = all
         * @returns Promise<ClientsPerTypeDTO[]>
         */
        self.getClientsPerType = function (type) {
            var params = {};
            if (type !== null && type !== undefined && type !== "") params.type = type;
            return $http
                .get(apiUrl("/api/reports/clientspertype"), { params: params })
                .then(function (resp) { return resp.data || []; })
                .catch(function (err) {
                    console.error("Failed to fetch clients-per-type report:", err);
                    return $q.reject(err);
                });
        };

        /**
         * Report 2 – count of reserved / unreserved phone numbers per device.
         * @param {number|null}  deviceId  null = all devices
         * @param {string|null}  status    "Reserved", "Unreserved", or null = both
         * @returns Promise<PhoneNumberStatusReportDTO[]>
         */
        self.getPhoneNumberStatus = function (deviceId, status) {
            var params = {};
            if (deviceId != null) params.deviceId = deviceId;
            if (status) params.status = status;
            return $http
                .get(apiUrl("/api/reports/phonenumberstatus"), { params: params })
                .then(function (resp) { return resp.data || []; })
                .catch(function (err) {
                    console.error("Failed to fetch phone-number-status report:", err);
                    return $q.reject(err);
                });
        };
    }
]);
