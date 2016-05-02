angular.module('starter.services', [])

.factory('Account',  function($http,$state,$localstorage){
  var account = [];
  return {
    getaccount : function (){
     return $http({
      url: "http://lab.kusumotolab.com/HelperSenior/index.php/useraccount/account",
      method: "POST", 
      data: {username: JSON.parse($localstorage.get('login')).username}
    });
   }
 }
})

.factory('Friend',  function($http,$state,$localstorage){
  var friend = [];
  return {
    getfriend : function (){
     return $http({
      url: "http://lab.kusumotolab.com/HelperSenior/index.php/useraccount/getfriend",
      method: "POST", 
      data: {username: JSON.parse($localstorage.get('login')).username}
    });
   }
 }
})

.factory('CustomCall',  function($http,$state,$localstorage){
  var calldata = [];
  return {
     getcall : function (){
     return $http({
      url: "http://lab.kusumotolab.com/HelperSenior/index.php/useraccount/getcall",
      method: "POST", 
      data: {username: JSON.parse($localstorage.get('login')).username}
      });
   },
   savecall : function (namecall,numebercall){
     return $http({
      url: "http://lab.kusumotolab.com/HelperSenior/index.php/useraccount/addcall",
      method: "POST", 
      data: {username: JSON.parse($localstorage.get('login')).username, namecall: namecall, numbercall: numebercall}
    });
   }
 }
})


.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Nusra Kapong',
    lastText: 'ซันนี่คนสวยยยยยยยยยยยย',
    face: 'https://scontent.fbkk5-1.fna.fbcdn.net/hprofile-xpf1/v/t1.0-1/p160x160/12508679_973684826045561_8489825460830239364_n.jpg?oh=af46d205fc6993e760bd5ac61d0ec560&oe=5703A024'
  }, {
    id: 1,
    name: 'Weerayut Hongsa',
    lastText: 'สวัสดี',
    face: 'https://scontent.fbkk5-1.fna.fbcdn.net/hprofile-xaf1/v/t1.0-1/c0.0.160.160/p160x160/1043976_592907174086980_1473098538_n.jpg?oh=4a49f62a70c185e428184c40773f2ef8&oe=573F3A93'
  }, {
    id: 2,
    name: 'Raweewan Sukkham',
    lastText: 'เจ๊ซันคนสวยมากกกกกกกก',
    face: 'https://scontent.fbkk5-1.fna.fbcdn.net/hprofile-xft1/v/t1.0-1/p160x160/12004784_620768961395913_7897233052155840966_n.jpg?oh=0d04fb44c716d1a0b82e194dcfa1d689&oe=570C9746'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});





