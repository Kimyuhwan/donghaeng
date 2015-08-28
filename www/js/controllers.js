angular.module('starter.controllers', [])

.controller('AppCtrl', function() {

})

.controller('IntroCtrl', function($scope, $state, $localstorage, $ionicHistory) {

    // 여기에 로그인이 되어있으면 자동 로그인 기능을 추가해야겠지 (local storage를 이용해서 )
    $ionicHistory.clearHistory();

    $scope.signUp = function() {
        $state.go('dh-signup');
    };

    $scope.signIn = function() {
        $state.go('dh-signin');
    };

})

.controller('StartCtrl', function($scope, $state, $ionicHistory, $stateParams, $communication, $localstorage, notifications) {
    // History Clear
    $ionicHistory.clearHistory();

    /** Initialize Variables **/
    $scope.isValid = false;
    $scope.isConfirmed = false;

    // For UI (necessary)
    $scope.user_id = "0";
    $scope.user_nick_name = "0";
    $scope.sender = "0";

    var invitation_code = $stateParams.invitationCode;
    // HTTP-CALL - Invitation Code Validation
    $communication.validcode({ invitation_code : invitation_code }, function(res) {
        if(res.type) {
            // valid code
            $scope.isValid = true;

            // update UI
            $scope.user_id = res.data.user_id;
            $scope.user_nick_name = res.data.user_nick_name;
            $scope.sender_nick_name = res.data.sender_nick_name;

        } else{
            // no valid code
            notifications.showWarning({message: res.data});
        }
    }, function() {
        console.log('Failed to sign up');
    });

    // Local functions
    $scope.confirm = function() {
        $scope.isConfirmed = true;
    };

    // Sign up
    $scope.submit = function() {

        // check it is valid
        $scope.result_valid = $scope.validateForm();

        if($scope.result_valid) {
            var body = {
                id: $scope.user_id,
                nickname: $scope.user_nick_name,
                password: $scope.user_password
            };

             // HTTP-CALL - USERS - SIGN UP
            $communication.signup(body, function(res) {
                if(res.type) { // sign up success
                    //save token
                    $localstorage.setToken(res.token);
                    // show pop up
                    notifications.showSuccess({message: '회원가입 성공'});
                    // move after 3000 ms
                    setTimeout(function() {
                        $state.go('app.dh-list');
                    }, 2000);
                } else {
                    notifications.showWarning({message: res.data});
                }
            }, function() {
                console.log('Failed to sign up');
            });
        }
    };

    // validation functions
    $scope.validateForm = function() {
        var result = true;
        //check required
        if ($scope.donghangForm.fieldId.$error.required)
            result = false;
        if($scope.donghangForm.fieldPassword.$error.required)
            result = false;
        if($scope.donghangForm.fieldNickName.$error.required)
            result = false;
        if(!result)
            $scope.required_message = "생략된 정보가 있습니다.";
        else
            $scope.required_message = "";

        return result;
    };

    $scope.signIn = function() {
        $state.go('dh-signin');
    };


})

.controller('SignUpCtrl', function($scope, $ionicHistory, $localstorage, $state, notifications, $communication) {


    $scope.submit = function() {
        // check it is valid
        $scope.result_valid = $scope.validateForm();

        if($scope.result_valid) {
            // make sign up body
            var body = {
                id: $scope.user_id,
                nickname: $scope.user_nick_name,
                password: $scope.user_password
            };
            console.log(body);

            // HTTP-CALL - USERS - SIGN UP
            $communication.signup(body, function(res) {
                if(res.type) { // sign up success
                    //save token
                    $localstorage.setToken(res.token);
                    // show pop up
                    notifications.showSuccess({message: '회원가입 성공'});
                    // move after 3000 ms
                    setTimeout(function() {
                        $state.go('app.dh-list');
                    }, 2000);
                } else {
                    notifications.showWarning({message: res.data});
                }
            }, function() {
                console.log('Failed to sign up');
            });
        }
    };

    // validation functions
    $scope.validateForm = function() {

        //check required
        var required_result = true;
        if ($scope.donghangForm.fieldId.$error.required)
            required_result = false;
        if ($scope.donghangForm.fieldPassword.$error.required)
            required_result = false;
        if ($scope.donghangForm.fieldNickName.$error.required)
            required_result = false;
        if (!required_result)
            $scope.required_message = "생략된 정보가 있습니다.";
        else
            $scope.required_message = "";

        // check phone number
        var phone_result = true;
        if($scope.user_id) {
            var phone_len = $scope.user_id.length;
            var first_digits = $scope.user_id.substring(0,2);
            if(first_digits !== "01" || !(phone_len == 10 || phone_len == 11))
                phone_result = false;

            if (!phone_result)
                $scope.number_message = "올바르지 않은 번호입니다.";
            else
                $scope.number_message = "";
        }


        return phone_result && required_result;
    };


    $scope.goBack = function() {
        $ionicHistory.goBack();
    };


})

.controller('SignInCtrl', function($scope, $ionicHistory, $localstorage, $state, notifications, $communication) {

    $scope.submit = function() {
        // check it is valid
        $scope.result_valid = $scope.validateForm();

        // if valid
        if($scope.result_valid) {
            // make sign up body
            var body = {
                id: $scope.user_id,
                password: $scope.user_password
            };

            console.log(body);

            // HTTP-CALL - USERS - SIGN IN
            $communication.signin(body, function(res) {
                if(res.type) {
                    //save id
                    $localstorage.setToken(res.token);
                    // show pop up
                    notifications.showSuccess({message: '로그인 성공'});
                    // move after 3000 ms
                    setTimeout(function() {
                        $state.go('app.dh-list');
                    }, 2000);
                } else{
                    notifications.showWarning({message: res.data});
                }
            }, function() {
                console.log('Failed to sign up');
            });

        }
    };

    // validation functions
    $scope.validateForm = function() {

        //check required
        var required_result = true;
        if ($scope.donghangForm.fieldId.$error.required)
            required_result = false;
        if ($scope.donghangForm.fieldPassword.$error.required)
            required_result = false;

        if (!required_result)
            $scope.required_message = "생략된 정보가 있습니다.";
        else
            $scope.required_message = "";

        // check phone number
        var phone_result = true;
        if($scope.user_id) {
            var phone_len = $scope.user_id.length;
            var first_digits = $scope.user_id.substring(0,2);
            if(first_digits !== "01" || !(phone_len == 10 || phone_len == 11))
                phone_result = false;

            if (!phone_result)
                $scope.number_message = "올바르지 않은 번호입니다.";
            else
                $scope.number_message = "";
        }


        return phone_result && required_result;
    };

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

})

.controller('ListCtrl', function($scope, ionicMaterialInk, ionicMaterialMotion, $state, $ionicHistory, $ionicModal, $localstorage, notifications, $rootScope, $http, $communication) {

    // set environment variables
    $ionicHistory.clearHistory();

    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    // initialize variables
    $scope.page_num = 1;

    /** Initial Functions **/
    // HTTP-CALL - CAMPAIGN LIST

    $communication.campaignlist(function(res) {
        $scope.campaignList = res.data;
        console.log(res.data);
    }, function(err) {
        $state.go('dh-intro');
    });


    /** Local Functions **/
    // Go Info Page
    $scope.nextPage = function(campaign_id) {
        $state.go('app.dh-info', {campaign_info: {campaign_id: campaign_id}});
    };

    // Show Image FullScreen
    $scope.showImages = function(src) {
        // full screen image source
        $scope.full_image_src = src;
        $scope.showModal('templates/modal-image.html');
    };

    // Play video

    $scope.thumbnail = function(src){
        if (src==null) return;
        var sub = src.substring(0,src.length-4);
        $scope.targetThumbnailPath = sub + '.jpg'
        console.log('thumbnail path: ' + $scope.targetThumbnailPath);

        //create video thumbnail, and save as image under /img directory
        //window.PKVideoThumbnail.createThumbnail ( src , $scope.targetThumbnailPath, true, true );
    }

    $scope.playVideo = function(src) {
        $scope.clipSrc = src;
        $scope.showModal('templates/video-popover.html');
    }

    // show Modal
    $scope.showModal = function(templateUrl) {
     $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope,
        animation: 'slide-in-up'
     }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
     });
    };

    // Close Modal
    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
    };
})

.controller('InfoCtrl', function($scope, $cordovaContacts, $communication, $localstorage, $ionicModal, $ionicLoading, $ionicPopup, mapboxService, cordovaDeviceMotionService, $stateParams, $rootScope, $http, notifications) {

    /** Home TAB **/
    // Get Campaign ID
    var campaign_id = 1;
    if($stateParams.campaign_info !== null)
        campaign_id = $stateParams.campaign_info.campaign_id;

    // HTTP-CALL - SINGLE CAMPAIGN
    $communication.campaigninfo(campaign_id, function(res) {
        if(res.type) {
            $scope.campaignInfo = res.data;
        } else{
            notifications.showWarning({message: res.data});
        }
    }, function() {
        console.log('Failed to sign up');
    });

    /** INVITE MODAL **/
    // variables
    $scope.confirmedContact = []; // confirmed list
    $scope.isLoaded = false; // to check contact list is loaded or not

    // Add Contacts
    $scope.addContact = function(contact) {
        // initialize variable
        var re = new RegExp('-', 'g');
        var selectedContact = {
            name: contact.displayName || contact.name.givenName,
            phoneNumber: contact.phoneNumbers[0].value.replace(re, '')
        };

        var isMobile = true;
        // check the number is mobile
        var phone_len = selectedContact.phoneNumber.length;
        var first_digits = selectedContact.phoneNumber.substring(0,2);
        if(first_digits !== "01" || !(phone_len == 10 || phone_len == 11))
            isMobile = false;

        var isNonDuplicate = true;
        // check currently selected contact is already added to confirmedContact.
        for(var i = 0; i < $scope.confirmedContact.length; i++){
            if($scope.confirmedContact[i].phoneNumber === selectedContact.phoneNumber)
                isNonDuplicate = false;
        }

        // show result
        if(isMobile == false) {
            $ionicPopup.alert({
              title: '친구 추가 에러',
              template: "모바일 번호가 아닙니다."
            });
        } else if(isNonDuplicate == false) {
            $ionicPopup.alert({
              title: '친구 추가 에러',
              template: "이미 추가된 번호입니다."
            });
        } else {
            $scope.confirmedContact.push(selectedContact);
        }
    };

    // Fake data
    //$scope.contacts = [ {displayName : "김유환", phoneNumbers: [{value: "010-9913-1824"}]},
    //{displayName : "김유환", phoneNumbers: [{value: "010-9913-1824123"}]},
    //{displayName : "김유환", phoneNumbers: [{value: "12443"}]} ];

    // Open modal
    $scope.openInvite = function(animation) {

        // check is Loaded
        if($scope.confirmedContact.length > 0)
            $scope.isLoaded = true;

        $scope.contactNotSelected = true;

        // get contacts
        var options = {};
        options.filter = "01";
        options.multiple = true;
        options.fields = ['phoneNumbers'];

        if($scope.isLoaded == false) {
            // progress bar
            $scope.loadingIndicator = $ionicLoading.show({
                content: 'Loading Data',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200
            });

            // find contacts
            $cordovaContacts.find(options).then(function(result) {
                $scope.contacts = result;
                $scope.isLoaded = true;
                $scope.loadingIndicator.hide();
                }, function(error) {
                    alert("ERROR: " + error);
            });
        }

        // open modal
         $ionicModal.fromTemplateUrl('templates/modal-invite.html', {
            scope: $scope,
            animation: animation
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    // Close modal
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    // On Info View, cancel a contact which is added before
    $scope.cancelContact = function(contact) {
        for(var i = 0; i < $scope.confirmedContact.length; i++){
            if($scope.confirmedContact[i].name === contact.name)
                $scope.confirmedContact.splice(i, 1);
        }
    };

    // send invitation
    $scope.invite = function() {
        // make a body
        var recipients = [];
        for(var i = 0; i < $scope.confirmedContact.length; i++){
            var recipient = {
                name: $scope.confirmedContact[i].name,
                phone_number: $scope.confirmedContact[i].phoneNumber
            };
            recipients.push(recipient);
        }
        var body = {
          'campaign_id': campaign_id,
          'recipients': recipients
        };

        // HTTP CALL - SEND AN INVITATION
        $communication.invite(body, function(res) {
            if(res.type) { // sign up success
                notifications.showSuccess({message: '동행 초대하기 성공'});
                $scope.modal.hide();
            } else {
                notifications.showWarning({message: res.data});
            }
        }, function() {
            console.log('Failed to sign up');
        });

    };

    ///** Donghang List TAB **/
    //$http.get($rootScope.BASE_API_URL + "donghangs?donghang_id=" + campaign_id + "&access_token=" + current_user.access_token).then(function(resp) {
    //    // set response data into campaignList
    //    $scope.donghang_list = resp.data;
    //    $scope.active_list = [];
    //    $scope.inactive_from_list = [];
    //    $scope.inactive_by_list = [];
    //
    //
    //    // 예정된 동행
    //    for(var i  = 0; i < $scope.donghang_list.length; i++) {
    //        var donghang_info = $scope.donghang_list[i];
    //        if(donghang_info.status === "active")  {
    //            $scope.active_list.push($scope.make_active_info(donghang_info));
    //        } else {
    //            if(donghang_info.publisher === true) {
    //                $scope.inactive_from_list.push($scope.make_inactive_info(donghang_info));
    //            } else {
    //                $scope.inactive_by_list.push($scope.make_inactive_info(donghang_info));
    //            }
    //        }
    //    }
    //
    //}, function(err) {
    //    console.error('ERR', err);
    //});

    $scope.make_active_info = function(donghang_info) {
        var result = {
            participants: [donghang_info.participants[0].nickname, donghang_info.participants[1].nickname],
            time: donghang_info.time,
            status: donghang_info.status
        };
        return result;
    };

    $scope.make_inactive_info = function(donghang_info) {
        console.log(donghang_info);
        var result = {
            participants: [donghang_info.participants[0].nickname, donghang_info.participants[1].nickname],
            participants_status: [donghang_info.participants[0].joined, donghang_info.participants[1].joined],
            time: donghang_info.time,
            status: donghang_info.status,
            publisher: donghang_info.publisher_name
        };
        return result;
    };


    /** Map TAB **/
    // mapbox
    mapboxService.init({ accessToken: 'pk.eyJ1IjoibGljeWV1cyIsImEiOiJuZ1gtOWtjIn0.qaaGvywaJ_kCmwmlTSNyVw' });


});


    /** Gesture Functions
    //Gesture
    $scope.openGesture = function(animation) {

        //open modal
        $ionicModal.fromTemplateUrl('templates/modal-gesture.html', {
            scope: $scope,
            animation: animation
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
     };

    $scope.accel = {x: 0, y:0, z:0, timestamp: 0};

    var watchID;
    $scope.getCurrentAcceleration = function() {
        var options = { frequency: 2000 };  // Update every 3 seconds
        watchID = cordovaDeviceMotionService.watchAcceleration(function(acceleration){
            $scope.accel.x = acceleration.x;
            $scope.accel.y = acceleration.y;
            $scope.accel.z = acceleration.z;
            $scope.accel.timestamp = acceleration.timestamp;
        },function(err) {alert(err)}, options);
    };


    $scope.stopAccelerometerData = function() {
        cordovaDeviceMotionService.clearWatch(watchID);
    };
    **/