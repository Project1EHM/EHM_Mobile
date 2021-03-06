// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('ionic.utils', [])

  .factory('$localstorage', ['$window', function ($window) {
    return {
      set: function (key, value) {
        window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse(window.localStorage[key] || '{}');
      },
      clear: function () {
        window.localStorage.clear();
      },
      clearLogin: function () {
        delete window.localStorage['login'];
      }
    }
  }]);

angular.module('starter', ['ionic', 'ionic-datepicker', 'ionic-timepicker', 'ionic.service.core', 'starter.controllers', 'starter.services', 'ionic.utils', 'ui.rCalendar', 'ngCordova'])

  .config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      setLabel: 'ตกลง',
      todayLabel: 'วันนี้',
      closeLabel: 'ปิด',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'yyyy-mm-dd',
      closeOnSelect: false,
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })
  .config(function (ionicTimePickerProvider) {
    var timePickerObj = {
      inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
      format: 12,
      step: 1,
      setLabel: 'ตกลง',
      closeLabel: 'ปิด'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
  })

  .run(function ($ionicPlatform, $localstorage, $ionicPopup, $state, $rootScope, $timeout, LocationFromNotification) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      window.plugins.sqlDB.copy("niems.db", 0, function () {}, function (e) {
        console.log('Error : ' + JSON.stringify(e))
      });

      var push = PushNotification.init({
        android: {
          senderID: "1072546120442"
        },
        ios: {
          alert: "true",
          badge: "true",
          sound: "true",
          senderID: "1072546120442"
        },
        windows: {}
      });

      push.on('registration', function (data) {
        $localstorage.setObject('push', {
          token: data.registrationId,
        });
      });

      push.on('notification', function (data) {
        if (data.additionalData.defaults == 2) {
          var myPopup = $ionicPopup.show({
            title: data.title,
            template: data.message,
            scope: $rootScope,
            buttons: [{
              text: 'ปิด'
            }, {
              text: '<b>ดูสถานที่</b>',
              type: 'button-positive',
              onTap: function (e) {
                $timeout(function () {
                  LocationFromNotification.location = data.additionalData.location
                  $state.go('tab.map');
                }, 100);
              }
            }]
          });
        } else if (data.additionalData.defaults == 3) {
          // $timeout(function () {
          //   $state.go('tab.chats');
          // }, 100);
        } else {
          var alertPopup = $ionicPopup.alert({
            title: data.title,
            template: data.message,
          });
        }

        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
      });

      push.on('error', function (e) {
        var alertPopup = $ionicPopup.alert({
          title: 'เกิดความผิดพลาด!',
          template: e.message
        });
      });


      // var pushNotification = window.plugins.pushNotification;

      // var map;


      // window.successHandler = function (result) {
      //   //alert('Callback Success! Result = '+result)
      // }

      // window.onNotification = function (e) {


      //   switch (e.event) {
      //     case 'registered':
      //       if (e.regid.length > 0) {
      //         console.log("Regid " + e.regid);
      //         $localstorage.setObject('push', {
      //           token: e.regid,
      //         });
      //       }
      //       break;

      //     case 'message':

      //       var alertPopup = $ionicPopup.alert({
      //         title: 'ข้อความ!',
      //         template: '<div id="mapContainer" style="width:200px;height:100px;"><img src="img/maptest.png"></div>' + e.message
      //       });
      //       break;

      //     case 'error':
      //       alert('GCM error = ' + e.msg);
      //       break;

      //     default:
      //       alert('An unknown GCM event has occurred');
      //       break;
      //   }
      // }

      // window.errorHandler = function (error) {
      //   alert('an error occured');
      // }

      // pushNotification.register(
      //   successHandler,
      //   errorHandler, {
      //     'badge': 'true',
      //     'sound': 'true',
      //     'alert': 'true',
      //     'forceShow': 'true',
      //     'ecb': 'onNotification',
      //     'senderID': '1072546120442',
      //   }
      // );

    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.transformRequest = function (data) {
      if (data === undefined) {
        return data;
      }
      return $.param(data);
    }

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })

      .state('tab.hosnearby', {
        url: '/hosnearby',
        views: {
          'tab-hosnearby': {
            templateUrl: 'templates/tab-hosnearby.html',
            controller: 'HospitalNearbyCtrl'
          }
        }
      })

      .state('tab.hosdetail', {
        url: '/hosdetail/:hosId',
        views: {
          'tab-hosnearby': {
            templateUrl: 'templates/tab-hosdetail.html',
            controller: 'HospitalDetailCtrl'
          }
        }
      })

      .state('tab.newchat', {
        url: '/newchat',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-newchat.html',
            controller: 'NewChatCtrl'
          }
        }
      })

      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('tab.siren', {
        url: '/siren',
        views: {
          'tab-siren': {
            templateUrl: 'templates/tab-siren.html',
            controller: 'SirenCtrl'
          }
        }
      })
      .state('tab.listmenu', {
        url: '/listmenu',
        views: {
          'tab-listmenu': {
            templateUrl: 'templates/list-menu.html',
            controller: 'ListmenuCtrl'
          }
        }
      })
      .state('tab.account', {
        url: '/account/:chatId',
        views: {
          'tab-listmenu': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      })

      .state('tab.calendar', {
        url: '/calendar',
        views: {
          'tab-listmenu': {
            templateUrl: 'templates/tab-calendar.html',
            controller: 'CalendarCtrl'
          }
        }
      })

      .state('tab.addfriend', {
        url: '/addfriend',
        views: {
          'tab-listmenu': {
            templateUrl: 'templates/tab-addfriend.html',
            controller: 'AddfriendCtrl'
          }
        }
      })

      .state('tab.editaccount', {
        url: '/editaccount',
        views: {
          'tab-listmenu': {
            templateUrl: 'templates/tab-editaccount.html',
            controller: 'EditaccountCtrl'
          }
        }
      })

      .state('tab.addcall', {
        url: '/addcall',
        views: {
          'tab-listmenu': {
            templateUrl: 'templates/tab-addcall.html',
            controller: 'AddcallCtrl'
          }
        }
      })

      .state('tab.addcalendar', {
        url: '/addcalendar',
        views: {
          'tab-listmenu': {
            templateUrl: 'templates/tab-addcalendar.html',
            controller: 'AddcalendarCtrl'
          }
        }
      })

      .state('tab.emergencycall', {
        url: '/emergencycall',
        views: {
          'tab-listmenu': {
            templateUrl: 'templates/tab-emergencycall.html',
            controller: 'EmergencycallCtrl'
          }
        }
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/tab-member.html',
        controller: 'MemberCtrl'
      })

      .state('tab.map', {
        url: '/map',
        views: {
          'tab-siren': {
            templateUrl: 'templates/tab-map.html',
            controller: 'MapCtrl'
          }
        }
      })

      .state('register', {
        url: '/register',
        templateUrl: 'templates/tab-register.html',
        controller: 'RegisterCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  });
