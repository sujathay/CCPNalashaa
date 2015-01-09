
var ContactsApp = angular.module("ContactsApp", ['ngRoute','ngResource']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            when('/new', { controller: AddCtrl, templateUrl: 'details.html' }).
            when('/edit/:id', { controller: EditCtrl, templateUrl: 'details.html' }).
            when('/newTrip/:id', { controller: TripCtrl, templateUrl: 'AddCP.html' }).
            otherwise({ redirectTo: '/' });
       
    });

var ListCtrl = function ($scope, $location) {
    $scope.init = function () {
        $scope.kwd = '';
        $scope.contactItems = [];
        $scope.totalContacts = Contacts.length;
        $scope.isDesc = false;
        $scope.from = 0;
        $scope.range = 10;
        $scope.to = $scope.range;
        $scope.isMore = true;
    }

    $scope.init();

    $scope.setContacts = function () {
        $scope.contactItems = $scope.contactItems.concat(Contacts.slice($scope.from, $scope.to));
        $scope.isMore = $scope.to < $scope.totalContacts;
    }

    $scope.setContacts();

    $scope.orderBy = function (col) {
        var contacts = $scope.contactItems.sort(function (item1, item2) {
            if (item1[col] > item2[col]) {
                return $scope.isDesc ? -1 : 1;
            }
            if (item1[col] < item2[col]) {
                return $scope.isDesc ? 1 : -1;
            }
            return 0;
        });
        $scope.isDesc = !$scope.isDesc;
    }

    $scope.search = function () {
        if ($scope.kwd != '') {
            searchWord = $scope.kwd.toLowerCase();
            $scope.contactItems = $scope.contactItems.filter(function (item) {
                return item.FirstName.toLowerCase().indexOf(searchWord) != -1 ||
                        item.LastName.toLowerCase().indexOf(searchWord) != -1 ||
                        item.Email.toLowerCase().indexOf(searchWord) != -1 ||
                        item.Phone.toLowerCase().indexOf(searchWord) != -1
            });
        }
    }

    $scope.reset = function () {
        $scope.init();
        $scope.setContacts();
    }

    $scope.showMore = function () {
        $scope.from = $scope.from + $scope.range;
        $scope.to = $scope.to + $scope.range;
        $scope.setContacts();
    }
    $scope.showTrip = function () {
        $location.path('/newTrip/' + 1);
    }
    $scope.autoCompleteLocation = function (id) {

        var input = /** @type {HTMLInputElement} */(
            document.getElementById(id));
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addDomListener(window, 'load', initialize);
    }
    $scope.edit = function () {
        $location.path('/edit/' + this.item.ContactId);
    }

    $scope.delete = function () {
        var contactId = this.item.ContactId;
        var deleteContact = $scope.contactItems.filter(function (contact) {
            return contact.ContactId == contactId;
        })[0];
        var contactIndex = $scope.contactItems.indexOf(deleteContact);
        $scope.contactItems.splice(contactIndex, 1);
    }
};

var AddCtrl = function ($scope, $location) {
    $scope.action = 'Add';

    $scope.save = function () {
        $scope.contact.SlNo = Contacts.length + 1;
        $scope.contact.ContactId = createGuid();
        Contacts.push($scope.contact);
        $location.path('#/');
    };
};

var TripCtrl = function ($scope, $location) {
    $scope.action = 'Trip';

    $scope.save = function () {
        $scope.contact.SlNo = Contacts.length + 1;
        $scope.contact.ContactId = createGuid();
        Contacts.push($scope.contact);
        $location.path('#/');
    };
};


var EditCtrl = function ($scope, $location, $routeParams) {
    $scope.action = 'Edit';
    $scope.contact = Contacts.filter(function (contact) {
        return contact.ContactId == $routeParams.id;
    })[0];
    $scope.save = function () {
        var editContact = Contacts.filter(function (contact) {
            return contact.ContactId == $routeParams.id;
        })[0];
        var contactIndex = Contacts.indexOf(editContact);
        Contacts[contactIndex] = $scope.contact;
        $location.path('#/');
    };
};

function randomNo() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function createGuid() {
    return (randomNo() + randomNo() + "-" + randomNo() + "-4" + randomNo().substr(0, 3) + "-" + randomNo() + "-" + randomNo() + randomNo() + randomNo()).toLowerCase();
}