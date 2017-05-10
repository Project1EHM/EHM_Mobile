angular.module('starter.services', [])

  .factory('Account', function ($http, $state, $localstorage) {
    var account = [];
    return {
      getaccount: function () {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/account",
          method: "POST",
          data: {
            username: JSON.parse($localstorage.get('login')).username
          }
        });
      }
    }
  })

  .factory('HospitalDetail', function () {
    return {
      gethospitalDetail: function (hosId, callback) {
        var db = window.sqlitePlugin.openDatabase({
          name: 'niems.db',
          location: 'default'
        });
        db.transaction(function(tx) {
          tx.executeSql('select * from hospitals where id = ?', [hosId], callback)
        }, function(error) {
          console.log('transaction error: ' + error.message);
          db.close();
        }, function() {
          db.close();
        });
      }
    }
  })

  .factory('HospitalLocation', function () {
    return {
      gethospital: function (position, callback) {
        var db = window.sqlitePlugin.openDatabase({
          name: 'niems.db',
          location: 'default'
        });
        db.transaction(function(tx) {
          tx.executeSql('select * from hospitals', [], callback)
        }, function(error) {
          console.log('transaction error: ' + error.message);
          db.close();
        }, function() {
          db.close();
        });
      },
      calculateDistance: function (gps1, gps2) {
        var BETWEEN_DEGREE = 15;
        var THOUSAND_METER = 1000;
        var SURFACE_DISTANCE_PER_ONE_DEGREE = [{
            latitude: 110.574,
            longitude: 111.320
          }, //0  degree
          {
            latitude: 110.649,
            longitude: 107.551
          }, //15 degree
          {
            latitude: 110.852,
            longitude: 96.486
          }, //30 degree
          {
            latitude: 111.132,
            longitude: 78.847
          }, //45 degree
          {
            latitude: 111.412,
            longitude: 55.800
          }, //60 degree  
          {
            latitude: 111.618,
            longitude: 28.902
          }, //75 degree
          {
            latitude: 111.694,
            longitude: 0.000
          } //90 degree
        ];
        var latitudeDistance1 = SURFACE_DISTANCE_PER_ONE_DEGREE[parseInt(gps1.latitude / BETWEEN_DEGREE)].latitude * THOUSAND_METER;
        var latitudeDistance2 = SURFACE_DISTANCE_PER_ONE_DEGREE[parseInt(gps2.latitude / BETWEEN_DEGREE)].latitude * THOUSAND_METER;
        var longitudeDistance1 = SURFACE_DISTANCE_PER_ONE_DEGREE[parseInt(gps1.latitude / BETWEEN_DEGREE)].longitude * THOUSAND_METER;
        var longitudeDistance2 = SURFACE_DISTANCE_PER_ONE_DEGREE[parseInt(gps2.latitude / BETWEEN_DEGREE)].longitude * THOUSAND_METER;
        var power1 = Math.pow((gps2.latitude * latitudeDistance2) - (gps1.latitude * latitudeDistance1), 2);
        var power2 = Math.pow((gps2.longitude * longitudeDistance2) - (gps1.longitude * longitudeDistance1), 2);
        return Math.sqrt(power1 + power2);
      }
    }
  })

  .factory('Notification', function ($http, $state, $localstorage) {
    return {
      send: function (position) {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/sendhelpall",
          method: "POST",
          data: {
            username: JSON.parse($localstorage.get('login')).username,
            location: position.coords.latitude + ',' + position.coords.longitude
          }
        })
      }
    }
  })

  .factory('LocationFromNotification', function () {
    return {
      username: "",
      location: ""
    }
  })

  .factory('Friend', function ($http, $state, $localstorage) {
    var friend = [];
    return {
      getfriend: function () {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/getfriend",
          method: "POST",
          data: {
            username: JSON.parse($localstorage.get('login')).username
          }
        });
      }
    }
  })

  .factory('Calendar', function ($http, $state, $localstorage) {
    var calendardata = [];
    return {
      getdata: function () {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/showcalendar",
          method: "POST",
          data: {
            username: JSON.parse($localstorage.get('login')).username
          }
        });
      },
      delete: function (calendar_id) {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/deletecalendatar",
          method: "POST",
          data: {
            username: JSON.parse($localstorage.get('login')).username,
            calendar_id: calendar_id
          }
        });
      }
    }
  })

  .factory('CustomCall', function ($http, $state, $localstorage) {
    var calldata = [];
    return {
      getcall: function () {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/getcall",
          method: "POST",
          data: {
            username: JSON.parse($localstorage.get('login')).username
          }
        });
      },
      savecall: function (namecall, numebercall) {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/addcall",
          method: "POST",
          data: {
            username: JSON.parse($localstorage.get('login')).username,
            namecall: namecall,
            numbercall: numebercall
          }
        });
      }
    }
  })


  .factory('Chats', function ($http, $state, $localstorage) {
    return {
      all: function () {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/chat/friendlist",
          method: "POST",
          data: {
            source_user: JSON.parse($localstorage.get('login')).user_account_id
          }
        });
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (desc_user) {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/chat/getmessage",
          method: "POST",
          data: {
            source_user: JSON.parse($localstorage.get('login')).user_account_id,
            target_user: desc_user
          }
        });
      },
      send: function (desc_user, message, message_type) {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/chat/send",
          method: "POST",
          data: {
            source_user: JSON.parse($localstorage.get('login')).user_account_id,
            target_user: desc_user,
            message: message,
            type: message_type
          }
        });
      },
      sticker: function () {
        return $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/chat/sticker",
          method: "POST"
        });
      }
    };
  });
