angular.module("myApp").service("AuthService", [
    "$http", "$q", "$window",
    function ($http, $q, $window) {
        var self = this;
        var API_BASE = ($window && $window.API_BASE) || "";
        var STORAGE_KEY = "vanrise_user";

        function apiUrl(path) {
            return (API_BASE && API_BASE.replace(/\/$/, "")) + path;
        }

        /**
         * POST /api/auth/login with pre-hashed password.
         * Stores the user in localStorage on success.
         * @param {string} username
         * @param {string} passwordHash  — SHA-256 lowercase hex
         */
        self.login = function (username, passwordHash) {
            return $http
                .post(apiUrl("/api/auth/login"), {
                    username: username,
                    passwordHash: passwordHash
                })
                .then(function (resp) {
                    if (resp.data && resp.data.success) {
                        $window.localStorage.setItem(
                            STORAGE_KEY,
                            JSON.stringify({ username: resp.data.username })
                        );
                    }
                    return resp.data;
                })
                .catch(function (err) {
                    // 401 → return the error body so the controller can display it
                    if (err.status === 401 && err.data) return err.data;
                    return $q.reject(err);
                });
        };

        self.logout = function () {
            $window.localStorage.removeItem(STORAGE_KEY);
        };

        self.getUser = function () {
            var raw = $window.localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        };

        self.isLoggedIn = function () {
            return !!self.getUser();
        };
    }
]);
