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


.factory('Chats', function ($http,$state,$localstorage) {
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
    sticker: function() {
      return $http({
        url: "https://windows.kusumotolab.com/HelperSenior/index.php/chat/sticker",
        method: "POST"
      });
    }
  };
});
