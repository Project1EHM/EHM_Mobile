angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Friend,$http, $localstorage, $ionicPopup) {
 $scope.selection = [];
 $scope.comment;

 Friend.getfriend().success(function(data){
  console.log(data.data)
  $scope.friends = data.data;
  console.log($scope.friends[0].username)
});

   // toggle selection for a given employee by name
   $scope.toggleSelection = function toggleSelection(employeeName) {
    var idx = $scope.selection.indexOf(employeeName);

    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    } else {
      $scope.selection.push(employeeName);
    }
  };

  $scope.sendcomment = function () {
    $http({
      url: "https://lab.kusumotolab.com/HelperSenior/index.php/useraccount/notify",
      method: "POST", 
      data: {target_username : $scope.selection, message : $scope.comment, username: JSON.parse($localstorage.get('login')).username }
    }).success(function(response) {
      console.log(response)
      if (response.notify == 'fail') {
       var alertPopup = $ionicPopup.alert({
        title: 'พบข้อผิดพลาด!',
        template: 'กรุณาลองใหม่อีกครั้ง'
      });
     } else{
      var alertPopup = $ionicPopup.alert({
        title: 'เรียบร้อย!',
        template: 'ส่งข้อความสำเร็จ'
      });
      $scope.selection = [];
      $scope.comment = '';
      Friend.getfriend().success(function(data){
        console.log(data.data)
        $scope.friends = data.data;
        console.log($scope.friends[0].username)
      });

    }

  }).error(function(response) {
    var alertPopup = $ionicPopup.alert({
      title: 'พบข้อผิดพลาด!',
      template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
    });
  });
}

})

.controller('MemberCtrl', function ($scope,$http,$rootScope,$state, $ionicPopup,$localstorage) {
  // if($localstorage.get('login')){
  //   $scope.login = {
  //     username : ,
  //     password : JSON.parse($localstorage.get('login')).password
  //   }
  // } else {
    //  $scope.login = {
    //   username : '',
    //   password : ''
    // }
  // }

  
  // $localstorage.set('name', 'Max');
  // console.log($localstorage.get('name'));


  // var post = $localstorage.getObject('post');
  // console.log(post);


  $scope.autologin = function() {
    if($localstorage.get('login')) {
     $http({
      url: "https://lab.kusumotolab.com/HelperSenior/index.php/useraccount/login",
      method: "POST", 
      data: {username: JSON.parse($localstorage.get('login')).username, password: JSON.parse($localstorage.get('login')).password, device_token: JSON.parse($localstorage.get('push')).token}
    }).success(function(response) {
      if (response.login == 'success') {

        $state.go('tab.siren')
      // Ionic.Auth.login(authProvider, authSettings, loginDetails)
      // .then(authSuccess, authFailure);

    } else {
      var alertPopup = $ionicPopup.alert({
        title: 'พบข้อผิดพลาด!',
        template: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }
  }).error(function(response) {
    var alertPopup = $ionicPopup.alert({
      title: 'พบข้อผิดพลาด!',
      template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
    });
  });
} 
}


$scope.login = function() {
  $http({
    url: "https://lab.kusumotolab.com/HelperSenior/index.php/useraccount/login",
    method: "POST", 
    data: {username: $scope.login.username, password: $scope.login.password, device_token: JSON.parse($localstorage.get('push')).token}
  }).success(function(response) {

    if (response.login == 'success') {

      $localstorage.setObject('login', {
        username: $scope.login.username,
        password: $scope.login.password,
        email:  response.email
      });

      $state.go('tab.siren')
        // Ionic.Auth.login(authProvider, authSettings, loginDetails).then(authSuccess, authFailure);

      } else {
        var alertPopup = $ionicPopup.alert({
          title: 'พบข้อผิดพลาด!',
          template: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        });
      }
    }).error(function(response) {
      var alertPopup = $ionicPopup.alert({
        title: 'พบข้อผิดพลาด!',
        template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
      });
    }); 
  }
})

.controller('ListmenuCtrl', function($scope,$localstorage, $state) {

  $scope.logout = function() {
   $localstorage.clear();
   $state.go('login')
 }
})

.controller('AddcalendarCtrl', function($scope,$localstorage, $state,ionicDatePicker) {
  $scope.dateData = '';
  var ipObj1 = {
      callback: function (val) {  //Mandatory
        var today = new Date(val);
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
           mm='0'+mm
        } 
        var today2 = yyyy+'-'+mm+'-'+dd;
        $scope.dateData = today2;
        // alert(today2)
  },
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      dateFormat: 'yyyy-mm-dd',
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };

  })

.controller('AccountCtrl', function($scope,$stateParams, Account, $http,$localstorage,$state, $ionicPopup, Friend, $timeout) {


  $scope.account;
  $scope.friends;
  $scope.$on('$ionicView.enter', function() {

    Account.getaccount().success(function(data){
      console.log(data.data)
      $scope.account = data.data;
      console.log($scope.account.username)
    });

    $timeout(function() {
      Friend.getfriend().success(function(data){
        console.log(data.data)
        $scope.friends = data.data;
        console.log($scope.friends[0].username)
      });
    }, 3000);



  });


  // $scope.getfriend = Chats.get($stateParams.chatId);
  // console.log(Chats.get($stateParams.chatId));
  // $scope.chats = Chats.all();
  // $scope.chats.remove(0);

})


.controller('CalendarCtrl', function($scope) {
 'use strict';

 $scope.calendar = {};
 $scope.viewTitle = ""
 $scope.changeMode = function (mode) {
  $scope.calendar.mode = mode;
};
$scope.onViewTitleChanged = function (title) {
  $scope.viewTitle = title;
};

$scope.today = function () {
  $scope.calendar.currentDate = new Date();
};
})


.controller('RegisterCtrl', function($scope,$http,$rootScope,$state, $ionicPopup,$ionicActionSheet) {

 $scope.register = {
  username : '',
  firstname : '',
  lastname : '',
  email : '',
  disease :'',
  drug_allergy : '',
  treatment : '' ,
  personaldoctor : '',
  hospital : '',
  password : '',
  lastPhoto : ''
}

$scope.select_pic = function() {

   // Show the action sheet

   var hideSheet = $ionicActionSheet.show({
     buttons: [
     { text: 'ถ่ายรูปจากกล้อง' },
     { text: 'อัพโหลดรูปภาพ' }
     ],
     titleText: 'อัพโหลดรูปโปรไฟล์',
     cancelText: '<font color="red">ยกเลิก</font>',
     cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          console.log(index)
          if (index === 0) {
            var options = {
              quality: 50,
              destinationType:0
            };
          } else {
           var options = {
            quality: 50,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType:0
          };

        }

        navigator.camera.getPicture(onSuccess, onFail, options); 
        //destination type was a base64 encoding
        function onSuccess(imageData) {
        //preview image on img tag
        $('#image-preview').attr('src', "data:image/jpeg;base64,"+imageData);
        //setting scope.lastPhoto 
        $scope.register.lastPhoto = dataURItoBlob("data:image/jpeg;base64,"+imageData);
      }
      function onFail(message) {
        // alert('Failed because: ' + message);
      } 
      return true;  
    }
  });
 };

 $scope.register = function() {
  $http({
    url: "https://lab.kusumotolab.com/HelperSenior/index.php/useraccount/register",
    method: "POST", 
    data: {username: $scope.register.username,firstname: $scope.register.firstname,lastname: $scope.register.lastname,
      email: $scope.register.email,disease: $scope.register.disease,drug_allergy: $scope.register.drug_allergy,
      treatment: $scope.register.treatment, personaldoctor: $scope.register.personaldoctor, hospital: $scope.register.hospital, password: $scope.register.password ,images: $('#image-preview').attr('src')}
    }).success(function(response) {
      if (response.register == 'success') {

       var users = {
        'email':  $scope.register.email,
        'password': $scope.register.password
      }

      // Ionic.Auth.signup(users).then(signupSuccess, signupFailure);
      $state.go('login')
    } else {
     var alertPopup = $ionicPopup.alert({
      title: 'พบข้อผิดพลาด!',
      template: response.messagefail
    });
   }
 }).error(function(response) {
   var alertPopup = $ionicPopup.alert({
    title: 'พบข้อผิดพลาด!',
    template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
  });
 }); 
}
})

.controller('EmergencycallCtrl', function($scope,CustomCall) {
  $scope.$on('$ionicView.enter', function() {
    CustomCall.getcall().success(function(response) {
      $scope.calldatas = response.data;
    });
  });

})


.controller('AddcallCtrl', function($scope,CustomCall,$state, $ionicPopup) {

  $scope.call = {
    'name' : '',
    'tel' : ''
  }
  $scope.doAddCall = function () {
    CustomCall.savecall($scope.call.name,$scope.call.tel).success(function(response) {
      if (response.addcall == 'success') {

        $state.go('tab.emergencycall', {}, {reload: true})
      } else {
       var alertPopup = $ionicPopup.alert({
        title: 'พบข้อผิดพลาด!',
        template: response.messagefail
      });
     }
   }).error(function(response) {
    var alertPopup = $ionicPopup.alert({
      title: 'พบข้อผิดพลาด!',
      template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
    });
  });

 }
})
.controller('EditaccountCtrl', function($scope,$http,$rootScope,$state, $ionicPopup,$ionicActionSheet, Account) {

  $scope.editaccount;
  $scope.$on('$ionicView.enter', function() {
    Account.getaccount().success(function(data){
      console.log(data.data)
      $scope.editaccount = data.data;
      $('#image-preview').attr('src', $scope.editaccount.images);
      console.log($scope.editaccount.username)
    });
  });

  $scope.select_pic = function() {

   // Show the action sheet

   var hideSheet = $ionicActionSheet.show({
     buttons: [
     { text: 'ถ่ายรูปจากกล้อง' },
     { text: 'อัพโหลดรูปภาพ' }
     ],
     titleText: 'อัพโหลดรูปโปรไฟล์',
     cancelText: '<font color="red">ยกเลิก</font>',
     cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          console.log(index)
          if (index === 0) {
            var options = {
              quality: 50,
              destinationType:0
            };
          } else {
           var options = {
            quality: 50,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType:0
          };

        }

        navigator.camera.getPicture(onSuccess, onFail, options); 
        //destination type was a base64 encoding
        function onSuccess(imageData) {
        //preview image on img tag
        $('#image-preview').attr('src', "data:image/jpeg;base64,"+imageData);
        //setting scope.lastPhoto 
        $scope.editaccount.lastPhoto = dataURItoBlob("data:image/jpeg;base64,"+imageData);
      }
      function onFail(message) {
        // alert('Failed because: ' + message);
      } 
      return true;  
    }
  });
 };

 $scope.editaccount_submit = function() {
  $http({
    url: "https://lab.kusumotolab.com/HelperSenior/index.php/useraccount/editaccount",
    method: "POST", 
    data: {username: $scope.editaccount.username, firstname: $scope.editaccount.firstname,lastname: $scope.editaccount.lastname,
      email: $scope.editaccount.email,disease: $scope.editaccount.disease,drug_allergy: $scope.editaccount.drug_allergy,
      treatment: $scope.editaccount.treatment, personaldoctor: $scope.editaccount.personaldoctor, hospital: $scope.editaccount.hospital, password: $scope.editaccount.password ,images: $('#image-preview').attr('src')}
    }).success(function(response) {
      if (response.editaccount == 'success') {
       $state.go('login')
     } else {
       var alertPopup = $ionicPopup.alert({
        title: 'พบข้อผิดพลาด!',
        template: response.messagefail
      });
     }
   }).error(function(response) {
     var alertPopup = $ionicPopup.alert({
      title: 'พบข้อผิดพลาด!',
      template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
    });
   }); 
 }
})


.controller('AddfriendCtrl', function($scope,$http,$rootScope,$state, $ionicPopup,$localstorage) {
  $scope.addfriend = {
    username : ''
  }
  $scope.doAddfriend = function () {
    $http({
      url: "https://lab.kusumotolab.com/HelperSenior/index.php/useraccount/addfriend",
      method: "POST", 
      data: {username: JSON.parse($localstorage.get('login')).username, usernamefriend: $scope.addfriend.username}
    }).success(function(response) {
      if (response.addfriend == 'success') {
       $state.go('tab.siren')
     } else {
      var alertPopup = $ionicPopup.alert({
        title: 'พบข้อผิดพลาด!',
        template: 'ไม่พบชื่อผู้ใช้งานในระบบ'
      });
    }
  }).error(function(response) {
    var alertPopup = $ionicPopup.alert({
      title: 'พบข้อผิดพลาด!',
      template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
    });
  }); 
};
})



.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats =  Chats.all();

  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SirenCtrl', function($scope,$http,$localstorage,$state, $ionicPopup) {

  $scope.sendnotify = function() {
    $http({
      url: "https://lab.kusumotolab.com/HelperSenior/index.php/useraccount/sendhelpall",
      method: "POST", 
      data: {username: JSON.parse($localstorage.get('login')).username}
    }).success(function(response) {

      if (response.sendhelpall == 'success') {
       var alertPopup = $ionicPopup.alert({
        title: 'เรียบร้อย!',
        template: 'แจ้งเตือนเรียบร้อย'
      });

     } else {
      var alertPopup = $ionicPopup.alert({
        title: 'พบข้อผิดพลาด!',
        template: 'มีข้อผิดพลาดระหว่างส่งข้อมูล'
      });
    }
  }).error(function(response) {
    var alertPopup = $ionicPopup.alert({
      title: 'พบข้อผิดพลาด!',
      template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
    });
  }); 
}

$scope.settings = {
  enableFriends: true
};

});
