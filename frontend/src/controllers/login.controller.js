angular.module("myApp").controller("LoginCtrl", [
    "$scope",
    "$rootScope",
    "AuthService",
    function ($scope, $rootScope, AuthService) {
        var vm = this;
        vm.username = "";
        vm.password = "";
        vm.error = "";
        vm.loading = false;

        vm.submit = function () {
            if (!vm.username || !vm.password) {
                vm.error = "Please enter your username and password.";
                return;
            }

            vm.loading = true;
            vm.error = "";

            // Hash password with SHA-256 using CryptoJS (loaded via CDN)
            var hash = CryptoJS.SHA256(vm.password).toString(); // lowercase hex

            AuthService.login(vm.username.trim(), hash)
                .then(function (result) {
                    if (result && result.success) {
                        console.log("LoginCtrl: broadcasting userLoggedIn", result.username);
                        // Broadcast login event to all scopes (including MainCtrl)
                        $rootScope.$broadcast("userLoggedIn", { username: result.username });
                    } else {
                        vm.error = (result && result.message) || "Invalid credentials.";
                    }
                })
                .catch(function () {
                    vm.error = "Login failed. Please check your connection and try again.";
                })
                .finally(function () {
                    vm.loading = false;
                });
        };
    }
]);
