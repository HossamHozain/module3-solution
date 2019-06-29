(function () {
  'use strict';
  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItems);
  // controller
  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController(service) {
    let ctrl = this;
    ctrl.searchTerm = "";
    ctrl.found;
    ctrl.loader;
    ctrl.errorMessage;
    ctrl.search = () => {
      ctrl.loader = true;
      if (ctrl.searchTerm !== "") {
        let promise = service.getMatchedMenuItems(ctrl.searchTerm);
        promise.then(
          response => {
            if(response.length>0){
              ctrl.found = response;
              ctrl.errorMessage = false;
              ctrl.loader = false;
            }
            else{
              ctrl.errorMessage = true; ctrl.loader = false ;ctrl.found="";
            }
          })
      }
      else { ctrl.errorMessage = true; ctrl.loader = false; ctrl.found="";}
    }
    ctrl.onRemove = function (index) {
      ctrl.found.splice(index, 1);
      return ctrl.found
    }
  }
  // service
  MenuSearchService.$inject = ['$http']
  function MenuSearchService($http) {
    let service = this;
    service.getMatchedMenuItems = (searchTerm) => {
      return $http({
        method: "GET",
        url: "https://davids-restaurant.herokuapp.com/menu_items.json"
      })
        .then(resolve => {
          let allMenuIteams = resolve.data.menu_items;
          let foundItems = allMenuIteams.filter(item => { if (item.description.toLowerCase().includes(searchTerm.toLowerCase())) { return item; } })
          return foundItems;
        })
        .catch(reject => { console.log(reject.message) })
    }
  }
  // directive
  function FoundItems() {
    let ddo = {
      restrict: 'E',
      templateUrl: 'loader/itemsloaderindicator.template.html',
      scope: {
        items: '<foundItems',
        remove: '&onRemove',
        loader: "<",
        error: "<"
      }
    };
    return ddo
  }
})();
