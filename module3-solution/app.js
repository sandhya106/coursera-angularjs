(function () {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', FoundItemsDirective);
  
    function FoundItemsDirective() {
      return {
        restrict: 'E',
        scope: {
          items: '<',
          onRemove: '&'
        },
        template: `
          <ul>
            <li ng-repeat="item in items">
              {{item.name}}, {{item.short_name}}, {{item.description}}
              <button ng-click="onRemove({index: $index})">Don't want this one!</button>
            </li>
          </ul>
        `
      };
    }
  
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var ctrl = this;
  
      ctrl.searchTerm = '';
      ctrl.nothingFound = false;
  
      ctrl.narrow = function () {
        if (!ctrl.searchTerm.trim()) {
          ctrl.found = [];
          ctrl.nothingFound = true;
          return;
        }
  
        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
          .then(function (foundItems) {
            ctrl.found = foundItems;
            ctrl.nothingFound = foundItems.length === 0;
          });
      };
  
      ctrl.removeItem = function (index) {
        ctrl.found.splice(index, 1);
      };
    }
  
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      var service = this;
  
      service.getMatchedMenuItems = function (searchTerm) {
        return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
          .then(function (response) {
            var allItems = response.data.menu_items;
            return allItems.filter(item =>
              item.description.toLowerCase().includes(searchTerm.toLowerCase()));
          });
      };
    }
  })();
  