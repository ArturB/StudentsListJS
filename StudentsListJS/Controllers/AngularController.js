/*
 * AngularJS Controller for StudentsList app
 * Copyright by Artur M. Brodzki, January 2017
 */

var app = angular.module("StudentsListJS", []);

/*app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "/Home/Students"
    })
    .when("/Groups", {
        templateUrl: "/Home/GroupsView"
    });
    $locationProvider.html5Mode(true);
});*/

app.controller('StudentsListController', function ($scope, $http, $location) {

    var studentsJsoned = "";
    $scope.ErrMsg = "";

    $scope.Data = null;

    $http({
        method: 'GET',
        url: "/Home/DataGet"
    }).then(function successCallback(response) {
        $scope.Data = response.data;
        $scope.Data.Students = $scope.Data.Students.sort(function (st1, st2) {
            var st1K = st1.LastName + st1.FirstName + st1.IndexNo;
            var st2K = st2.LastName + st2.FirstName + st2.IndexNo;
            var res = st1K > st2K;
            return res;
        });
        $scope.Data.Groups = $scope.Data.Groups.sort(function (gr1, gr2) {
            var gr1K = gr1.Name + gr1.IDGroup;
            var gr2K = gr2.Name + gr2.IDGroup;
            var res = gr1K > gr2K;
            return res;
        });

    }, function errCallback(response) {
        $scope.ErrMsg = "Error while connecting to the database!";
    });

    $scope.editedGroup = "";
    $scope.editedFirstName = "";
    $scope.editedLastName = "";
    $scope.editedBirthPlace = "";
    $scope.editedBirthDate = "";
    $scope.editedIndexNo = "";
    $scope.editedID = "";
    $scope.editedStamp = "";

    $scope.editedGroupID = "";
    $scope.editedGroupName = "";
    $scope.editedGroupStamp = "";

    $scope.filterGroup = "";
    $scope.filterCity = "";

    $scope.refresh = function () {
        $http({
            method: 'GET',
            url: "/Home/DataGet"
        }).then(function successCallback(response) {
            $scope.filterGroup = "";
            $scope.filterCity = "";

            $scope.Data = response.data;
            $scope.Data.Students = $scope.Data.Students.sort(function (st1, st2) {
                var st1K = st1.LastName + st1.FirstName + st1.IndexNo;
                var st2K = st2.LastName + st2.FirstName + st2.IndexNo;
                var res = st1K > st2K;
                return res;
            });
            $scope.Data.Groups = $scope.Data.Groups.sort(function (gr1, gr2) {
                var gr1K = gr1.Name + gr1.IDGroup;
                var gr2K = gr2.Name + gr2.IDGroup;
                var res = gr1K > gr2K;
                return res;
            });

        }, function errCallback(response) {
            $scope.ErrMsg = "Error while connecting to the database!";
        });


    }

    var updateView = function (response) {
        $scope.editedGroup = "";
        $scope.editedFirstName = "";
        $scope.editedLastName = "";
        $scope.editedBirthPlace = "";
        $scope.editedBirthDate = "";
        $scope.editedIndexNo = "";
        $scope.editedID = "";
        $scope.editedStamp = "";

        $scope.editedGroupID = "";
        $scope.editedGroupName = "";
        $scope.editedGroupStamp = "";

        $scope.ErrMsg = "";

        $scope.Data = response.data;
        $scope.Data.Students = $scope.Data.Students.sort(function (st1, st2) {
            var st1K = st1.LastName + st1.FirstName + st1.IndexNo;
            var st2K = st2.LastName + st2.FirstName + st2.IndexNo;
            var res = st1K > st2K;
            return res;
        });
        $scope.Data.Groups = $scope.Data.Groups.sort(function (gr1, gr2) {
            var gr1K = gr1.Name + gr1.IDGroup;
            var gr2K = gr2.Name + gr2.IDGroup;
            var res = gr1K > gr2K;
            return res;
        });

        if ($scope.filterGroup && $scope.filterGroup != "") {
            $scope.Data.Students = $scope.Data.Students.filter(function (st) {
                return st.IDGroup == $scope.filterGroup.IDGroup;
            });
        }

        if ($scope.filterCity && $scope.filterCity != "") {
            $scope.Data.Students = $scope.Data.Students.filter(function (st) {
                var r = new RegExp($scope.filterCity, 'i');
                var res = r.test(st.BirthPlace);
                return res;
            })
        }
    }

    $scope.clickFilter = function () {
        $http({
            method: 'GET',
            url: "/Home/DataGet"
        }).then(function successCallback(response) {
            updateView(response);
        }, function errCallback(response) {
            $scope.ErrMsg = "Error while connecting to the database!";
        });        
    }

    $scope.findGroupByID = function (id_) {
        var group;
        for (var i = 0; i < $scope.Data.Groups.length; ++i) {
            if ($scope.Data.Groups[i].IDGroup == id_) {
                group = $scope.Data.Groups[i];
                break;
            }
        }
        return group;
    }

    $scope.findStudentByID = function (id_) {
        var student;
        for (var i = 0; i < $scope.Data.Students.length; ++i) {
            if ($scope.Data.Students[i].IDStudent == id_) {
                student = $scope.Data.Students[i];
                break;
            }
        }
        return student;
    }

    $scope.clickStudent = function (st_) {
        $scope.editedGroup = $scope.findGroupByID(st_.IDGroup);
        $scope.editedFirstName = st_.FirstName;
        $scope.editedLastName = st_.LastName;
        $scope.editedBirthPlace = st_.BirthPlace;
        var bdate = new Date(st_.BirthDate);
        $scope.editedBirthDate = bdate.toLocaleDateString("en-US");
        $scope.editedIndexNo = st_.IndexNo;
        $scope.editedID = st_.IDStudent;
        $scope.editedStamp = st_.Stamp;
    }

    $scope.clickGroup = function (gr_) {
        $scope.editedGroupID = gr_.IDGroup;
        $scope.editedGroupName = gr_.Name;
        $scope.editedGroupStamp = gr_.Stamp;
    }

    $scope.clickSave = function () {
        if ($scope.editedID) {
            var st = JSON.parse(JSON.stringify($scope.findStudentByID($scope.editedID)));
            st.Group = $scope.editedGroup;
            st.FirstName = $scope.editedFirstName;
            st.LastName = $scope.editedLastName;
            st.BirthPlace = $scope.editedBirthPlace;
            st.BirthDate = $scope.editedBirthDate;
            st.IndexNo = $scope.editedIndexNo;

            var stJsoned = JSON.stringify(st);
            $http({
                method: 'POST',
                url: '/Home/DataPost',
                data: stJsoned,
                params: {
                    'type': 'student',
                    'action': 'update'
                }
            }).then(function successCallback(response) {
                if (response.data == "IndeksNonUnique") {
                    $scope.ErrMsg = "Student o takim indeksie istnieje już w bazie!";
                }
                else if (response.data == "NoGroup") {
                    $scope.ErrMsg = "Nie wybrano grupy!";
                }
                else if (response.data == "InvalidStudentName") {
                    $scope.ErrMsg = "Niepoprawne imię lub nazwisko studenta!";
                }
                else if (response.data == "InvalidBornCity") {
                    $scope.ErrMsg = "Niepoprawne miasto urodzenia!";
                }
                else if(response.data == "InvalidDate") {
                    $scope.ErrMsg = "Niepoprawna data!";
                }
                else if (response.data == "InvalidIndex") {
                    $scope.ErrMsg = "Niepoprawny numer indeksu!"
                }
                else if (response.data == "UpdateError") {
                    $scope.ErrMsg = "Studenta o takim indeksie nie ma już w bazie!";
                }
                else if (response.data == "DbUpdateConcurrencyException") {
                    $scope.ErrMsg = "Konflikt edycji! Proszę odświeżyć widok.";
                }
                else if (response.data == "DbUpdateException") {
                    $scope.ErrMsg = "Naruszono więzy spójności!";
                }
                else if (response.data == "Exception") {
                    $scope.ErrMsg = "Błąd podczas pracy na bazie danych!";
                }
                else updateView(response);
            }, function errCallback(response) {
                $scope.ErrMsg = "Error while connecting to the database!";
            });
        }
    }

    $scope.clickDelete = function () {
        if ($scope.editedID) {
            var st = JSON.parse(JSON.stringify($scope.findStudentByID($scope.editedID)));
            st.Group = $scope.editedGroup;
            st.FirstName = $scope.editedFirstName;
            st.LastName = $scope.editedLastName;
            st.BirthPlace = $scope.editedBirthPlace;
            st.BirthDate = $scope.editedBirthDate;
            st.IndexNo = $scope.editedIndexNo;
            var stJsoned = JSON.stringify(st);
            $http({
                method: 'POST',
                url: '/Home/DataPost',
                data: stJsoned,
                params: {
                    'type': 'student',
                    'action': 'delete'
                }
            }).then(function successCallback(response) {
                if (response.data == "DeleteError") {
                    $scope.ErrMsg = "Studenta o takim indeksie nie ma już w bazie!";
                }
                else if (response.data == "DbUpdateConcurrencyException") {
                    $scope.ErrMsg = "Konflikt edycji!";
                }
                else if (response.data == "DbUpdateException") {
                    $scope.ErrMsg = "Naruszono więzy spójności!";
                }
                else if (response.data == "Exception") {
                    $scope.ErrMsg = "Błąd podczas pracy na bazie danych!";
                }
                else updateView(response);
            }, function errCallback(response) {
                $scope.ErrMsg = "Error while connecting to the database!";
            });
        }
        
    }

    $scope.clickNew = function () {
        if ($scope.editedID) {
            var st = JSON.parse(JSON.stringify($scope.findStudentByID($scope.editedID)));
            st.Group = $scope.editedGroup;
            st.FirstName = $scope.editedFirstName;
            st.LastName = $scope.editedLastName;
            st.BirthPlace = $scope.editedBirthPlace;
            st.BirthDate = $scope.editedBirthDate;
            st.IndexNo = $scope.editedIndexNo;
            var stJsoned = JSON.stringify(st);
            $http({
                method: 'POST',
                url: '/Home/DataPost',
                data: stJsoned,
                params: {
                    'type': 'student',
                    'action': 'new'
                }
            }).then(function successCallback(response) {
                if (response.data == "IndeksNonUnique") {
                    $scope.ErrMsg = "Student o takim indeksie istnieje już w bazie!";
                }
                else if (response.data == "NoGroup") {
                    $scope.ErrMsg = "Nie wybrano grupy!";
                }
                else if (response.data == "InvalidStudentName") {
                    $scope.ErrMsg = "Niepoprawne imię lub nazwisko studenta!";
                }
                else if (response.data == "InvalidBornCity") {
                    $scope.ErrMsg = "Niepoprawne miasto urodzenia!";
                }
                else if (response.data == "InvalidDate") {
                    $scope.ErrMsg = "Niepoprawna data!";
                }
                else if (response.data == "DbUpdateConcurrencyException") {
                    $scope.ErrMsg = "Konflikt edycji! Proszę odświeżyć widok.";
                }
                else if (response.data == "DbUpdateException") {
                    $scope.ErrMsg = "Naruszono więzy spójności!";
                }
                else if (response.data == "Exception") {
                    $scope.ErrMsg = "Błąd podczas pracy na bazie danych!";
                }
                else updateView(response);
            }, function errCallback(response) {
                $scope.ErrMsg = "Error while connecting to the database!";
            });
        }
        
    }

    $scope.clickGroupSave = function () {
        if ($scope.editedGroupID) {
            var st = JSON.parse(JSON.stringify($scope.findGroupByID($scope.editedGroupID)));
            st.Name = $scope.editedGroupName;
            var stJsoned = JSON.stringify(st);
            $http({
                method: 'POST',
                url: '/Home/DataPost',
                data: stJsoned,
                params: {
                    'type': 'group',
                    'action': 'update'
                }
            }).then(function successCallback(response) {
                if (response.data == "GroupNameNonUnique") {
                    $scope.ErrMsg = "Nazwa jest już w użyciu!";
                }
                else if (response.data == "NoGroupName") {
                    $scope.ErrMsg = "Nie podano nazwy grupy!";
                }
                else if (response.data == "InvalidGroupName") {
                    $scope.ErrMsg = "Niepoprawna nazwa grupy!";
                }
                else if (response.data == "GroupUpdateError") {
                    $scope.ErrMsg = "Grupy nie ma już w bazie!";
                }
                else if (response.data == "DbUpdateConcurrencyException") {
                    $scope.ErrMsg = "Konflikt edycji! Proszę odświeżyć widok.";
                }
                else if (response.data == "DbUpdateException") {
                    $scope.ErrMsg = "Naruszenie więzów spójności!";
                }
                else if (response.data == "Exception") {
                    $scope.ErrMsg = "Błąd podczas pracy na bazie danych!";
                }
                else updateView(response);
            }, function errCallback(response) {
                $scope.ErrMsg = "Error while connecting to the database!";
            });
        }
        
    }

    $scope.clickGroupDelete = function () {
        if ($scope.editedGroupID) {
            var st = JSON.parse(JSON.stringify($scope.findGroupByID($scope.editedGroupID)));
            st.Name = $scope.editedGroupName;
            var stJsoned = JSON.stringify(st);
            $http({
                method: 'POST',
                url: '/Home/DataPost',
                data: stJsoned,
                params: {
                    'type': 'group',
                    'action': 'delete'
                }
            }).then(function successCallback(response) {
                if (response.data == "DeleteError") {
                    $scope.ErrMsg = "Grupy nie ma już w bazie!";
                }
                else if (response.data == "DbUpdateConcurrencyException") {
                    $scope.ErrMsg = "Konflikt edycji!";
                }
                else if (response.data == "DbUpdateException") {
                    $scope.ErrMsg = "Przed usunięciem grupy należy wypisać z niej wszystkich studentów!";
                }
                else if (response.data == "Exception") {
                    $scope.ErrMsg = "Błąd podczas pracy na bazie danych!";
                }
                else updateView(response);
            }, function errCallback(response) {
                $scope.ErrMsg = "Error while connecting to the database!";
            });
        }
       
    }

    $scope.clickGroupNew = function () {
        if($scope.editedGroupID) {
            var st = JSON.parse(JSON.stringify($scope.findGroupByID($scope.editedGroupID)));
            st.Name = $scope.editedGroupName;
            var stJsoned = JSON.stringify(st);
            $http({
                method: 'POST',
                url: '/Home/DataPost',
                data: stJsoned,
                params: {
                    'type': 'group',
                    'action': 'new'
                }
            }).then(function successCallback(response) {
                if (response.data == "GroupNameNonUnique") {
                    $scope.ErrMsg = "Nazwa jest już w użyciu!";
                }
                else if (response.data == "NoGroupName") {
                    $scope.ErrMsg = "Nie podano nazwy grupy!";
                }
                else if (response.data == "InvalidGroupName") {
                    $scope.ErrMsg = "Niepoprawna nazwa grupy!";
                }
                else if (response.data == "GroupUpdateError") {
                    $scope.ErrMsg = "Grupy nie ma już w bazie!";
                }
                else if (response.data == "DbUpdateConcurrencyException") {
                    $scope.ErrMsg = "Konflikt edycji! Proszę odświeżyć widok.";
                }
                else if (response.data == "DbUpdateException") {
                    $scope.ErrMsg = "Naruszenie więzów spójności!";
                }
                else if (response.data == "Exception") {
                    $scope.ErrMsg = "Błąd podczas pracy na bazie danych!";
                }
                else updateView(response);
            }, function errCallback(response) {
                $scope.ErrMsg = "Error while connecting to the database!";
            });
        }
    }


})