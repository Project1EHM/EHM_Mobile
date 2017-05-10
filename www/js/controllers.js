angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, Friend, $http, $localstorage, $ionicPopup) {
    $scope.selection = [];
    $scope.comment;
    $scope.$on('$ionicView.enter', function () {
      Friend.getfriend().success(function (data) {
        console.log(data.data)
        $scope.friends = data.data;
        console.log($scope.friends[0].username)
      });
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
        url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/notify",
        method: "POST",
        data: {
          target_username: $scope.selection,
          message: $scope.comment,
          username: JSON.parse($localstorage.get('login')).username
        }
      }).success(function (response) {
        if (response.notify == 'fail') {
          var alertPopup = $ionicPopup.alert({
            title: 'พบข้อผิดพลาด!',
            template: 'กรุณาลองใหม่อีกครั้ง'
          });
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'เรียบร้อย!',
            template: 'ส่งข้อความสำเร็จ'
          });
          $scope.selection = [];
          $scope.comment = '';
          Friend.getfriend().success(function (data) {
            $scope.friends = data.data;
          });

        }

      }).error(function (response) {
        var alertPopup = $ionicPopup.alert({
          title: 'พบข้อผิดพลาด!',
          template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
        });
      });
    }

  })

  .controller('MemberCtrl', function ($scope, $http, $rootScope, $state, $ionicPopup, $localstorage, $ionicLoading) {
    $scope.autologin = function () {
      if ($localstorage.get('login')) {
        $ionicLoading.show({
          template: 'กำลังโหลด...'
        })
        $http({
          url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/login",
          method: "POST",
          data: {
            username: JSON.parse($localstorage.get('login')).username,
            password: JSON.parse($localstorage.get('login')).password,
            device_token: (typeof $localstorage.get('push') === "undefined" ? "" : JSON.parse($localstorage.get('push')).token)
          }
        }).success(function (response) {
          $ionicLoading.hide()
          if (response.login == 'success') {
            $state.go('tab.siren')
          } else {
            var alertPopup = $ionicPopup.alert({
              title: 'พบข้อผิดพลาด!',
              template: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
            });
          }
        }).error(function (response) {
          $ionicLoading.hide()
          var alertPopup = $ionicPopup.alert({
            title: 'พบข้อผิดพลาด!',
            template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
          });
        });
      }
    }


    $scope.login = function () {
      $ionicLoading.show({
        template: 'กำลังโหลด...'
      })
      $http({
        url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/login",
        method: "POST",
        data: {
          username: $scope.login.username,
          password: $scope.login.password,
          device_token: (typeof $localstorage.get('push') === "undefined" ? "" : JSON.parse($localstorage.get('push')).token)
        }
      }).success(function (response) {
        $ionicLoading.hide()
        if (response.login == 'success') {
          $localstorage.setObject('login', {
            username: $scope.login.username,
            password: $scope.login.password,
            user_account_id: response.user_id,
            email: response.email
          });
          $state.go('tab.siren')
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'พบข้อผิดพลาด!',
            template: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
          });
        }
      }).error(function (response) {
        $ionicLoading.hide()
        var alertPopup = $ionicPopup.alert({
          title: 'พบข้อผิดพลาด!',
          template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
        });
      });
    }
  })

  .controller('ListmenuCtrl', function ($scope, $localstorage, $state, $http) {

    $scope.logout = function () {
      $http({
        url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/logout",
        method: "POST",
        data: {
          username: JSON.parse($localstorage.get('login')).username
        }
      }).success(function (response) {
        $localstorage.clearLogin();
        $state.go('login', {}, {
          reload: true
        })
      });
    }
  })

  .controller('AddcalendarCtrl', function ($scope, $localstorage, $state, ionicDatePicker, ionicTimePicker, $http, $rootScope, $ionicPopup) {
    $scope.dateData = '';
    $scope.timeData = '';
    $scope.data = {
      event: "",
      location: ""
    }
    $scope.$on('$ionicView.enter', function () {
      $scope.dateData = '';
      $scope.timeData = '';
      $scope.data = {
        event: "",
        location: ""
      }
    });
    var ipObj1 = {
      callback: function (val) { //Mandatory
        var today = new Date(val);
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
          dd = '0' + dd
        }
        if (mm < 10) {
          mm = '0' + mm
        }
        var today2 = yyyy + '-' + mm + '-' + dd;
        $scope.dateData = today2;
        // alert(today2)
      },
      from: new Date(2012, 1, 1), //Optional
      //to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      dateFormat: 'yyyy-mm-dd',
      closeOnSelect: false, //Optional
      templateType: 'popup' //Optional
    };

    var ipObj2 = {
      callback: function (val) { //Mandatory
        if (typeof (val) === 'undefined') {

        } else {
          var selectedTime = new Date(val * 1000);
          $scope.timeData = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes()
        }
      },
      format: 24, //Optional
      setLabel: 'ตกลง' //Optional
    };

    $scope.openDatePicker = function () {
      ionicDatePicker.openDatePicker(ipObj1);
    };

    $scope.openTimePicker = function () {
      ionicTimePicker.openTimePicker(ipObj2);
    };

    $scope.saveEvent = function () {
      $http({
        url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/addcalendar",
        method: "POST",
        data: {
          username: JSON.parse($localstorage.get('login')).username,
          event: $scope.data.event,
          date: $scope.dateData,
          time: $scope.timeData,
          location: $scope.data.location
        }
      }).success(function (response) {

        if (response.addcalendar == 'success') {

          var alertPopup = $ionicPopup.alert({
            title: 'สำเร็จ!',
            template: 'บันทึกข้อมูลเรียบร้อยแล้ว'
          });

          $state.go('tab.calendar', {}, {
            reload: true
          })

        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'พบข้อผิดพลาด!',
            template: response.messagefail
          });
        }
      }).error(function (response) {
        var alertPopup = $ionicPopup.alert({
          title: 'พบข้อผิดพลาด!',
          template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
        });
      });
    }

  })

  .controller('AccountCtrl', function ($scope, $stateParams, Account, $http, $localstorage, $state, $ionicPopup, Friend, $timeout) {
    $scope.account;
    $scope.friends;
    $scope.$on('$ionicView.enter', function () {
      Account.getaccount().success(function (data) {
        $scope.account = data.data;
      });
      $timeout(function () {
        Friend.getfriend().success(function (data) {
          $scope.friends = data.data;
        });
      }, 3000);
    });
  })


  .controller('CalendarCtrl', function ($scope, Calendar, $state, $ionicPopup, $cordovaLocalNotification) {

    $scope.calendar = {};
    $scope.viewTitle = "";

    $scope.$on('$ionicView.enter', function () {
      Calendar.getdata().success(function (response) {
        var calendardata = [];
        response.forEach(function (entry) {
          calendardata.push({
            id: entry.calendar_id,
            title: entry.event + ' - ' + entry.location,
            startTime: new Date(entry.datetime),
            endTime: new Date(entry.datetime),
            allDay: false
          });
          $cordovaLocalNotification.cancelAll().then(function (result) {
            var correntDate = new Date();
            var targetDate = new Date(entry.datetime);
            if (targetDate >= correntDate) {
              $cordovaLocalNotification.schedule({
                id: entry.calendar_id,
                title: 'แจ้งเตือนปฏิทิน',
                text: entry.event + ' - ' + entry.location,
                at: new Date(entry.datetime)
              }).then(function (result) {
                // ...
              });
            }
          });
        });
        $scope.calendar.eventSource = calendardata
      });
    });

    $scope.changeMode = function (mode) {
      $scope.calendar.mode = mode;
    };

    $scope.addEvent = function () {
      $state.go('tab.addcalendar', {}, {
        reload: true
      });
    };

    $scope.onEventSelected = function (event) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'คำเตือน',
        template: 'คุณแน่ใจหรือไม่ว่าต้องการลบ?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          Calendar.delete(event.id).success(function (response) {
            var alertPopup = $ionicPopup.alert({
              title: 'เรียบร้อย!',
              template: 'ดำเนินการลบข้อมูฃเรียบร้อยแล้ว'
            });
            $state.go($state.current, {}, {
              reload: true
            });
          }).error(function (response) {
            var alertPopup = $ionicPopup.alert({
              title: 'พบข้อผิดพลาด!',
              template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
            });
          });
        }
      });
    };

    $scope.onViewTitleChanged = function (title) {
      $scope.viewTitle = title;
    };

    $scope.today = function () {
      $scope.calendar.currentDate = new Date();
    };

  })


  .controller('RegisterCtrl', function ($scope, $http, $rootScope, $state, $ionicPopup, $ionicActionSheet) {

    $scope.register = {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      disease: '',
      drug_allergy: '',
      treatment: '',
      personaldoctor: '',
      hospital: '',
      password: '',
      lastPhoto: ''
    }

    $scope.select_pic = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: 'ถ่ายรูปจากกล้อง'
        }, {
          text: 'อัพโหลดรูปภาพ'
        }],
        titleText: 'อัพโหลดรูปโปรไฟล์',
        cancelText: '<font color="red">ยกเลิก</font>',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          console.log(index)
          if (index === 0) {
            var options = {
              quality: 50,
              destinationType: 0
            };
          } else {
            var options = {
              quality: 50,
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: 0
            };

          }

          navigator.camera.getPicture(onSuccess, onFail, options);

          function onSuccess(imageData) {
            $('#image-preview').attr('src', "data:image/jpeg;base64," + imageData);
            $scope.register.lastPhoto = dataURItoBlob("data:image/jpeg;base64," + imageData);
          }

          function onFail(message) {}
          return true;
        }
      });
    };

    $scope.register = function () {
      $http({
        url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/register",
        method: "POST",
        data: {
          username: $scope.register.username,
          firstname: $scope.register.firstname,
          lastname: $scope.register.lastname,
          email: $scope.register.email,
          disease: $scope.register.disease,
          drug_allergy: $scope.register.drug_allergy,
          treatment: $scope.register.treatment,
          personaldoctor: $scope.register.personaldoctor,
          hospital: $scope.register.hospital,
          password: $scope.register.password,
          images: $('#image-preview').attr('src')
        }
      }).success(function (response) {
        if (response.register == 'success') {

          var users = {
            'email': $scope.register.email,
            'password': $scope.register.password
          }
          $state.go('login')
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'พบข้อผิดพลาด!',
            template: response.messagefail
          });
        }
      }).error(function (response) {
        var alertPopup = $ionicPopup.alert({
          title: 'พบข้อผิดพลาด!',
          template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
        });
      });
    }
  })

  .controller('EmergencycallCtrl', function ($scope, CustomCall) {
    $scope.$on('$ionicView.enter', function () {
      CustomCall.getcall().success(function (response) {
        $scope.calldatas = response.data;
      });
    });

  })


  .controller('AddcallCtrl', function ($scope, CustomCall, $state, $ionicPopup) {

    $scope.call = {
      'name': '',
      'tel': ''
    }
    $scope.doAddCall = function () {
      CustomCall.savecall($scope.call.name, $scope.call.tel).success(function (response) {
        if (response.addcall == 'success') {

          $state.go('tab.emergencycall', {}, {
            reload: true
          })
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'พบข้อผิดพลาด!',
            template: response.messagefail
          });
        }
      }).error(function (response) {
        var alertPopup = $ionicPopup.alert({
          title: 'พบข้อผิดพลาด!',
          template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
        });
      });

    }
  })
  .controller('EditaccountCtrl', function ($scope, $http, $rootScope, $state, $ionicPopup, $ionicActionSheet, Account) {

    $scope.editaccount;
    $scope.$on('$ionicView.enter', function () {
      Account.getaccount().success(function (data) {
        console.log(data.data)
        $scope.editaccount = data.data;
        $('#image-preview').attr('src', $scope.editaccount.images);
        console.log($scope.editaccount.username)
      });
    });

    $scope.select_pic = function () {

      // Show the action sheet

      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: 'ถ่ายรูปจากกล้อง'
        }, {
          text: 'อัพโหลดรูปภาพ'
        }],
        titleText: 'อัพโหลดรูปโปรไฟล์',
        cancelText: '<font color="red">ยกเลิก</font>',
        cancel: function () {},
        buttonClicked: function (index) {
          console.log(index)
          if (index === 0) {
            var options = {
              quality: 50,
              destinationType: 0
            };
          } else {
            var options = {
              quality: 50,
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: 0
            };

          }

          navigator.camera.getPicture(onSuccess, onFail, options);

          function onSuccess(imageData) {
            $('#image-preview').attr('src', "data:image/jpeg;base64," + imageData);
            $scope.editaccount.lastPhoto = dataURItoBlob("data:image/jpeg;base64," + imageData);
          }

          function onFail(message) {}
          return true;
        }
      });
    };

    $scope.editaccount_submit = function () {
      $http({
        url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/editaccount",
        method: "POST",
        data: {
          username: $scope.editaccount.username,
          firstname: $scope.editaccount.firstname,
          lastname: $scope.editaccount.lastname,
          id_card: $scope.editaccount.id_card,
          email: $scope.editaccount.email,
          disease: $scope.editaccount.disease,
          drug_allergy: $scope.editaccount.drug_allergy,
          treatment: $scope.editaccount.treatment,
          personaldoctor: $scope.editaccount.personaldoctor,
          hospital: $scope.editaccount.hospital,
          password: $scope.editaccount.password,
          images: $('#image-preview').attr('src')
        }
      }).success(function (response) {

        if (response.editaccount == 'success') {
          $state.go('tab.listmenu', {}, {
            reload: true
          })
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'พบข้อผิดพลาด!',
            template: response.messagefail
          });
        }
      }).error(function (response) {
        var alertPopup = $ionicPopup.alert({
          title: 'พบข้อผิดพลาด!',
          template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
        });
      });
    }
  })


  .controller('AddfriendCtrl', function ($scope, $http, $rootScope, $state, $ionicPopup, $localstorage) {
    $scope.addfriend = {
      username: ''
    }

    $scope.$on('$ionicView.enter', function () {
      $scope.addfriend = {
        username: ''
      }
    });

    $scope.doAddfriend = function () {
      $http({
        url: "https://windows.kusumotolab.com/HelperSenior/index.php/useraccount/addfriend",
        method: "POST",
        data: {
          username: JSON.parse($localstorage.get('login')).username,
          usernamefriend: $scope.addfriend.username
        }
      }).success(function (response) {
        if (response.addfriend == 'success') {
          $state.go('tab.siren')
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'พบข้อผิดพลาด!',
            template: 'ไม่พบชื่อผู้ใช้งานในระบบ'
          });
        }
      }).error(function (response) {
        var alertPopup = $ionicPopup.alert({
          title: 'พบข้อผิดพลาด!',
          template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
        });
      });
    };
  })



  .controller('ChatsCtrl', function ($scope, Chats, $interval) {
    var intervalChatPromise;
    $scope.$on('$ionicView.enter', function () {
      Chats.all().success(function (data) {
        $scope.chats = data.data;
      });
      intervalChatPromise = $interval(function () {
        Chats.all().success(function (data) {
          $scope.chats = data.data;
        });
      }, 5000);
    });

    $scope.remove = function (chat) {
      Chats.remove(chat);
    };

    $scope.$on("$ionicView.leave", function (event) {
      if (intervalChatPromise) {
        $interval.cancel(intervalChatPromise);
      }
    });
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats, $localstorage, $ionicScrollDelegate, $interval, $ionicModal) {

    $scope.data = {};
    $scope.data.user_id = JSON.parse($localstorage.get('login')).user_account_id;
    var intervalChatDetailPromise;

    $scope.$on('$ionicView.enter', function () {
      Chats.get($stateParams.chatId).success(function (response) {
        $scope.messages = response.data;
        $ionicScrollDelegate.scrollBottom();
      });
    });

    var intervalChatDetailPromise = $interval(function () {
      Chats.get($stateParams.chatId).success(function (response) {
        $scope.messages = response.data;
      });
    }, 1000);

    $scope.messageIsMine = function (user_id) {
      return $scope.data.user_id === user_id;
    };

    $ionicModal.fromTemplateUrl('templates/sticker.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function () {
      $scope.modal.show();
      Chats.sticker().success(function (data) {
        $scope.sticker = data.data;
      });
    };
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.sendSticker = function (sticker_path) {
      Chats.send($stateParams.chatId, sticker_path, 'sticker').success(function (response) {
        Chats.get($stateParams.chatId).success(function (response) {
          $scope.messages = response.data;
          $ionicScrollDelegate.scrollBottom();
          $scope.data.message = "";
          $scope.modal.hide()
        });
      });
    }

    $scope.createContact = function (u) {
      $scope.contacts.push({
        name: u.firstName + ' ' + u.lastName
      });
      $scope.modal.hide();
    };

    $scope.getBubbleClass = function (user_id, message_type) {
      var classname = 'from-them';
      if ($scope.messageIsMine(user_id)) {
        if (message_type == 'sticker') {
          classname = 'from-me-img';
        } else {
          classname = 'from-me';
        }
      } else {
        if (message_type == 'sticker') {
          classname = 'from-them-img';
        }
      }
      return classname;
    };

    $scope.$on("$ionicView.leave", function (event) {
      if (intervalChatDetailPromise) {
        $interval.cancel(intervalChatDetailPromise);
      }
    });

    $scope.sendMessage = function (msg) {
      Chats.send($stateParams.chatId, msg, 'message').success(function (response) {
        Chats.get($stateParams.chatId).success(function (response) {
          $scope.messages = response.data;
          $ionicScrollDelegate.scrollBottom();
          $scope.data.message = "";
        });
      });
    };
  })

  .controller('NewChatCtrl', function ($scope, $stateParams, Friend) {
    $scope.$on('$ionicView.enter', function () {
      Friend.getfriend().success(function (response) {
        $scope.chats = response.data;
      });
    });
  })

  .controller('MapCtrl', function ($scope, $state, $cordovaGeolocation, LocationFromNotification) {
    var latLngTemp = LocationFromNotification.location.split(',');
    var latLng = new google.maps.LatLng(latLngTemp[0], latLngTemp[1])
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    marker = new google.maps.Marker({
      position: latLng,
      map: $scope.map,
      animation: google.maps.Animation.DROP,
    });
  })

  .controller('HospitalNearbyCtrl', function ($scope, $state, HospitalLocation, $cordovaGeolocation, $ionicLoading) {
    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    $scope.hospitallist_temp = [];
    $scope.hospitallist = [];
    $ionicLoading.show({
      template: 'กำลังโหลด...'
    })

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        HospitalLocation.gethospital(position, function (rs) {
          for (var i = 0; i < rs.rows.length; i++) {
            $scope.hospitallist_temp.push({
              result: rs.rows.item(i),
              distance: HospitalLocation.calculateDistance({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }, {
                latitude: rs.rows.item(i).latitude,
                longitude: rs.rows.item(i).longitude
              }).toFixed(2)
            })
          }

          $scope.hospitallist = $scope.hospitallist_temp.sort(function (a, b) {
            return a.distance - b.distance;
          });

          $ionicLoading.hide()
        })
      }),
      function (error) {
        var alertPopup = $ionicPopup.alert({
          title: 'พบข้อผิดพลาด!',
          template: 'ไม่สามารถดึงข้อมููลที่อยู่ได้'
        });
      }
  })

  .controller('SirenCtrl', function ($scope, $http, $localstorage, $state, $ionicPopup, $cordovaGeolocation, Notification, $ionicLoading) {
    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    $scope.sendnotify = function () {
      $ionicLoading.show({
        template: 'กำลังโหลด...'
      })
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
          Notification.send(position).success(function (response) {
            if (response.sendhelpall == 'success') {
              $ionicLoading.hide()
              var alertPopup = $ionicPopup.alert({
                title: 'เรียบร้อย!',
                template: 'แจ้งเตือนเรียบร้อย'
              });
            } else {
              $ionicLoading.hide()
              var alertPopup = $ionicPopup.alert({
                title: 'พบข้อผิดพลาด!',
                template: 'มีข้อผิดพลาดระหว่างส่งข้อมูล'
              });
            }
          }).error(function (response) {
            $ionicLoading.hide()
            var alertPopup = $ionicPopup.alert({
              title: 'พบข้อผิดพลาด!',
              template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
            });
          });
        }),
        function (error) {
          $ionicLoading.hide()
          var alertPopup = $ionicPopup.alert({
            title: 'พบข้อผิดพลาด!',
            template: 'ไม่สามารถดึงข้อมููลที่อยู่ได้'
          });

          position = {
            coords: {
              latitude: '',
              longitude: ''
            }
          }
          Notification.send(position).success(function (response) {
            if (response.sendhelpall == 'success') {
              $ionicLoading.hide()
              var alertPopup = $ionicPopup.alert({
                title: 'เรียบร้อย!',
                template: 'แจ้งเตือนเรียบร้อย'
              });
            } else {
              $ionicLoading.hide()
              var alertPopup = $ionicPopup.alert({
                title: 'พบข้อผิดพลาด!',
                template: 'มีข้อผิดพลาดระหว่างส่งข้อมูล'
              });
            }
          }).error(function (response) {
            $ionicLoading.hide()
            var alertPopup = $ionicPopup.alert({
              title: 'พบข้อผิดพลาด!',
              template: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
            });
          });
        }
    }
  });
