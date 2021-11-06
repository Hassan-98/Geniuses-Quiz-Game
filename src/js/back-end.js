config({
    apiKey: "AIzaSyDaX6oEVx_3ZhRkuNaMBqpG7WIuzoyiCN0",
    authDomain: "smart-challange.firebaseapp.com",
    databaseURL: "https://smart-challange.firebaseio.com",
    projectId: "smart-challange",
    storageBucket: "smart-challange.appspot.com",
    messagingSenderId: "235103928809"
});

/*********************************************** BACK-END CODES ****************************************************/


/*--*--*--*--*--*--*--*--*--*--|> HIDE Pre-LOADER <|--*--*--*--*- *--*--*--*--*--*/
auth.onLoggedIn(() => {
    $(".preloader").fadeOut();
});

/*--*--*--*--*--*--*--*--*--*--|> CHECK LOGIN STATE <|--*--*--*--*- *--*--*--*--*--*/
auth.onLoggedIn(user => {
    if(user){
        db.update(`users/${auth.user().uid}`, {avail: true});
        auth.onDisconnect(`users/${auth.user().uid}`, {avail: false});
        $(".auth").fadeOut();
        $(".loading").fadeIn();
        setTimeout(() => {
            $(".auth").remove();
            $(".loading").fadeOut();
            $(".main-face").fadeIn();
        }, 4000);
        $(".authName").text(` ${auth.user().displayName} `);
        $(".reAuthPic").attr("src",` ${auth.user().photoURL} `);
        $(".reAuthPic").addClass("authPic");
        $("nav").fadeIn();
        $("header").css("border-bottom", "0");
    } else {
        $(".edit-modal").remove();
        $(".auth").show();
        $("nav").fadeOut();
        $("header").css("border-bottom", "1px solid #ccc");
    }
});


/*--*--*--*--*--*--*--*--*--*--|> LOGINING IN <|--*--*--*--*- *--*--*--*--*--*/
$(".login").click(function(){
    var email = $("#email-login").val(),
        password = $("#pass-login").val();

    auth.login(email, password).then(user => {
        Swal.fire({
            type: 'success',
            text: `تم تسجيل الدخول بنجاح كـ${auth.user().displayName}`
        }).then(() => {
            $(".login-modal").remove();
            $(".signup-modal").remove();
            $(".loginGoogle").remove();
            location.reload();
        });
    }).catch(err => {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: err.message
        });
    });
});


/*--*--*--*--*--*--*--*--*--*--|> LOGINING OUT <|--*--*--*--*- *--*--*--*--*--*/
$(".logout").click(function(){
    Swal.fire({
        title: 'هل أنت متأكد من أنك تريد تسجيل الخروج؟',
        type: 'question',
        customClass: {
          icon: 'swal2-arabic-question-mark'
        },
        confirmButtonText:  'نعم',
        cancelButtonText:  'لا',
        showCancelButton: true,
        showCloseButton: true
      }).then((result) => {
        if (result.value) {
            auth.logout().then(location.reload());
        }
      });
});

/*--*--*--*--*--*--*--*--*--*--|> SIGNING UP <|--*--*--*--*- *--*--*--*--*--*/
$(".signup").click(function(){
    $(this).text("Loading ...");
    var email = $("#email-signup").val(),
        password = $("#pass-signup").val(),
        username = $("#username-signup").val(),
        pic = $("#pic-signup").val();

    if( email != false && password != false && username != false && pic != false ){
        auth.signup(email, password).then(user => {

            storage.upload("#pic-signup", `users/${auth.user().uid}/profilePic`).then(url => {
                auth.updateProfile({
                    displayName: username,
                    photoURL: url
                }).then(() => {
                    db.add(`users/${auth.user().uid}`,{
                        name: auth.user().displayName,
                        email: auth.user().email,
                        picture: auth.user().photoURL,
                        uid: auth.user().uid,
                        exp: 0,
                        wins: 0,
                        equals: 0,
                        loses: 0
                    }).then(() => {
                        Swal.fire({
                            type: 'success',
                            text: `تم التسجيل بنجاح كـ${auth.user().displayName}`
                        }).then(() => {
                            $(".login-modal").remove();
                            $(".signup-modal").remove();
                            $(".loginGoogle").remove();
                        });
                    });
                });
                
            });
    
        }).catch(err => {
            $(".signup").text("التسجيل");
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: err.message
            });
        });
    } else {
        $(".signup").text("التسجيل");
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'لا يمكن ترك أي خانة فارغة'
        });
    }

});


/*--*--*--*--*--*--*--*--*--*--|> LOGINING IN WITH GOOGLE <|--*--*--*--*- *--*--*--*--*--*/
$(".loginGoogle").click(function(){
    auth.loginWithGoogle().then(user => {
        
        db.get("users").then(Data => {
            var users = Object.values(Data.val());
            
            for(var i = 0; i < users.length; i++){
                if (users[i].uid == auth.user().uid){
                    return;
                }
            }
    
            return regNewAcc();
        });
        
        function regNewAcc(){
            db.update(`users/${auth.user().uid}`,{
                name: auth.user().displayName,
                email: auth.user().email,
                picture: auth.user().photoURL,
                uid: auth.user().uid,
                exp: 0,
                wins: 0,
                equals: 0,
                loses: 0
            }).then(() => {
                Swal.fire({
                    type: 'success',
                    text: `تم تسجيل الدخول بنجاح كـ${auth.user().displayName}`
                }).then(() => {
                    $(".login-modal").remove();
                    $(".signup-modal").remove();
                    $(".loginGoogle").remove();
                });
            });
        }
    });
});



/*--*--*--*--*--*--*--*--*--*--|> EDITING PERSONAL DATA <|--*--*--*--*- *--*--*--*--*--*/
/*--*--*--*--*--|> Edit Name <|--*--*- *--*--*/
$(".name-edit-btn").click(function(){
    var input = $("#name-edit").val();
    if(input != false){
        $(".name-edit-btn").text("جاري التعديل...");
        auth.updateProfile({
            displayName: input
        }).then(() => {
            db.update(`users/${auth.user().uid}`,{
                name: auth.user().displayName
            }).then(() => {
                Swal.fire({
                    type: 'success',
                    text: 'تم تغيير أسم المستخدم بنجاح'
                }).then(() => {
                    location.reload();
                });
            });
        }).catch(err => {
            $(".name-edit-btn").text("تعديل");
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: err.message
            });
        });
    } else {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'لا يمكن ترك الخانة فارغة'
        });
    }
});

/*--*--*--*--*--|> Edit Password <|--*--*- *--*--*/
$(".pass-edit-btn").click(function(){
    var input = $("#pass-edit").val();
    if(input != false){
        $(".pass-edit-btn").text("جاري التعديل...");
        auth.updatePassword(input).then(() => {
                Swal.fire({
                    type: 'success',
                    text: 'تم تغيير كلمة المرور بنجاح'
                }).then(() => {
                    location.reload();
                });
            }).catch(err => {
                $(".pass-edit-btn").text("تعديل");
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: err.message
                });
        });
    } else {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'لا يمكن ترك الخانة فارغة'
        });
    }
});

/*--*--*--*--*--|> Edit Picture <|--*--*- *--*--*/
$(".pic-edit-btn").click(function(){
    var input = $("#pic-edit").val();
    if(input != false){
        $(".pic-edit-btn").text("جاري رفع الصورة...");
        storage.upload("#pic-edit", `users/${auth.user().uid}/profilePic`).then(url => {
            auth.updateProfile({
                photoURL: url
            }).then(() => {
                db.update(`users/${auth.user().uid}`,{
                    picture: auth.user().photoURL
                }).then(() => {
                    Swal.fire({
                        type: 'success',
                        text: 'تم تغيير الصورة بنجاح'
                    }).then(() => {
                        location.reload();
                    });
                });
            });
            
        }).catch(err => {
            $(".pic-edit-btn").text("تعديل");
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: err.message
            });
        });
    } else {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'يجب اختيار صورة اولاً'
        });
    }
});


/*--*--*--*--*--*--*--*--*--*--|> Reseting Empty or Disconnected Rooms <|--*--*--*--*- *--*--*--*--*--*/
auth.onLoggedIn(user => {
    if(user){
        db.getting("rooms", Data => {
            Data.forEach(data => {
                if(data.val().playerOne && data.val().playerTwo){
                    if (data.val().playerOne == auth.user().uid){
                        auth.onDisconnect(`rooms/${data.key}`, {
                            playerOne: null,
                            playerOneScore: null
                        });
                    } else if (data.val().playerTwo == auth.user().uid){
                        auth.onDisconnect(`rooms/${data.key}`, {
                            playerTwo: null,
                            playerTwoScore: null
                        });
                    }
                } else if (data.val().playerOne && !data.val().playerTwo) {
                    if (data.val().playerOne == auth.user().uid){
                        auth.onDisconnect(`rooms/${data.key}`, {
                            state: "empty",
                            Qstate: "unset",
                            playerOne: null,
                            playerOneScore: null
                        });
                    }
                } else if (!data.val().playerOne && data.val().playerTwo) {
                    if (data.val().playerTwo == auth.user().uid){
                        auth.onDisconnect(`rooms/${data.key}`, {
                            state: "empty",
                            Qstate: "unset",
                            playerTwo: null,
                            playerTwoScore: null
                        });
                    }
                }
                auth.onDisconnect(`users/${auth.user().uid}`, {requset: null});
            });
        });
    }
});

/*--*--*--*--*--*--*--*--*--*--|> STARTING A NEW GAME ROOM <|--*--*--*--*- *--*--*--*--*--*/
$(".challengeDiv").click(function(){
    $(this).hide().siblings().hide();
    $(".loading").fadeIn();
    $(".match").fadeIn();

    /*--*--*--*--*--|> Joining A Room <|--*--*- *--*--*/
    db.get("rooms").then(Data => {
        if(Data){
            var data = Object.values(Data.val());
            for(var i = 0; i < data.length; i++){
                if (data[i].state == "matching"){
                    db.update(`rooms/${data[i].id}`, {
                        state: "full",
                        playerTwo: auth.user().uid
                    });
                    return;
                }
            }
    
            for(var i = 0; i < data.length; i++){
                if(data[i].state == "empty"){
                    db.update(`rooms/${data[i].id}`, {
                        state: "matching",
                        playerOne: auth.user().uid
                    });
                    return;
                }
            }

            return createNewRoom();

        } else {
            return createNewRoom();
        }
    });

    /*--*--*--*--*--|> Creating And Joining A New Room if All Current Rooms Are Full <|--*--*- *--*--*/
    function createNewRoom(){
        var ROOMID = Math.floor(Math.random() * 100000000000000);
        console.log(ROOMID);
        db.add(`rooms/${ROOMID}`, {
            state: "matching",
            Qstate: "unset",
            id: ROOMID,
            playerOne: auth.user().uid
        });
    }
    
    /*--*--*--*--*--|> Check if My Room Is Ready <|--*--*- *--*--*/
    db.getting("rooms", Data => {
        Data.forEach(data => {
            if (data.val().state == "full" && data.val().playerOne == auth.user().uid){
                db.get(`users/${data.val().playerTwo}`).then(playerTwo => {
                    setTimeout(() => {
                        $(".loading").hide();
                        $(".game-face").show();
                        $(".match").hide();
                        $(".p1img").attr("src", playerTwo.val().picture);
                        $(".p1name").text(playerTwo.val().name);
                        $(".p2img").attr("src", `${auth.user().photoURL}`);
                        $(".p2name").text(auth.user().displayName);
                        $(".playerOne").css("transform", "translateY(0px)");
                        $(".playerTwo").css("transform", "translateY(0px)");
                        $("nav").hide();
                        db.update(`rooms/${data.key}`, { state: "inGame" }).then(() => {
                            setTimeout(() => {
                                startNewGame(data.key, 1, playerTwo.val().picture, auth.user().photoURL);
                                $(".game-face").hide();
                                $(".game").show();
                                $(".player-two-score").html(`${playerTwo.val().name}: <span class="score">0</span> Point`);
                                $(".player-one-score").html(`${auth.user().displayName}: <span class="score">0</span> Point`);
                            }, 4000);
                        });
                    }, 2000);
                });
            } else if (data.val().state == "full" && data.val().playerTwo == auth.user().uid){
                db.get(`users/${data.val().playerOne}`).then(playerOne => {
                    setTimeout(() => {
                        $(".loading").hide();
                        $(".game-face").show();
                        $(".match").hide();
                        $(".p1img").attr("src", `${auth.user().photoURL}`);
                        $(".p1name").text(auth.user().displayName);
                        $(".p2img").attr("src", playerOne.val().picture);
                        $(".p2name").text(playerOne.val().name);
                        $(".playerOne").css("transform", "translateY(0px)");
                        $(".playerTwo").css("transform", "translateY(0px)");
                        $("nav").hide();
                        db.update(`rooms/${data.key}`, { state: "inGame" }).then(() => {
                            setTimeout(() => {
                                startNewGame(data.key, 2, auth.user().photoURL, playerOne.val().picture);
                                $(".game-face").hide();
                                $(".game").show();
                                $(".player-two-score").html(`${auth.user().displayName}: <span class="score">0</span> Point`);
                                $(".player-one-score").html(`${playerOne.val().name}: <span class="score">0</span> Point`);
                            }, 4000);
                        });
                    }, 2000);
                });
            }
        });
    });
});


/*--*--*--*--*--*--*--*--*--*--|> GETTING THE GENERAL RANKINGS <|--*--*--*--*- *--*--*--*--*--*/
auth.onLoggedIn(u => {
    if(u){
        db.get("users", "child", "exp").then(Data => {
            var count = 1;
            var Datas = [];
            Data.forEach(ds => {
                Datas.push(ds.val());
            });
            var counts = Datas.length;
            var countss = counts;
            Data.forEach(d => {
                var data = d.val();
                if(count == counts){
                    var tr = `
                    <tr class="${data.uid}" style="background:#ffff008a">
                        <td><img src="images/1st.svg"></td>
                        <td>${data.name} <img src="${data.picture}" class="pimg"></td>
                        <td>${data.wins}</td>
                        <td>${data.equals}</td>
                        <td>${data.loses}</td>
                        <td>${data.exp}</td>
                    </tr>
                    `;
                } else if (count == counts - 1){
                    var tr = `
                    <tr class="${data.uid}" style="background:#c0c0c08c">
                        <td><img src="images/2nd.svg"></td>
                        <td>${data.name} <img src="${data.picture}" class="pimg"></td>
                        <td>${data.wins}</td>
                        <td>${data.equals}</td>
                        <td>${data.loses}</td>
                        <td>${data.exp}</td>
                    </tr>
                    `;
                } else if (count == counts - 2){
                    var tr = `
                    <tr class="${data.uid}" style="background:#ff85339c">
                        <td><img src="images/3rd.svg"></td>
                        <td>${data.name} <img src="${data.picture}" class="pimg"></td>
                        <td>${data.wins}</td>
                        <td>${data.equals}</td>
                        <td>${data.loses}</td>
                        <td>${data.exp}</td>
                    </tr>
                    `;
                } else {
                    var tr = `
                    <tr class="${data.uid}">
                        <td>${countss}</td>
                        <td>${data.name} <img src="${data.picture}" class="pimg"></td>
                        <td>${data.wins}</td>
                        <td>${data.equals}</td>
                        <td>${data.loses}</td>
                        <td>${data.exp}</td>
                    </tr>
                    `;
                }
                countss--;
                count++;
                $(".general tr:first-child").after(tr);
                if(countss > 19){
                    $(".general tr:nth-child(2)").hide();
                }
            });
            
        }).then(() => {
            var myTR = $(`.general tr.${auth.user().uid}`).clone().show();
            $(".me-general").html(myTR);
        });
    }
});


/*--*--*--*--*--*--*--*--*--*--|> GETTING THE FRIENDS RANKINGS <|--*--*--*--*- *--*--*--*--*--*/
auth.onLoggedIn(u => {
    if(u){
        var myFriends = [];
        db.get(`users/${auth.user().uid}`).then(medata => {

            myFriends.push(medata.val());

            db.get(`users/${auth.user().uid}/friends`).then(Data => {
                if(Data){
                    Data.forEach(data => {
                        db.get(`users/${data.key}`).then(userData => {
                            myFriends.push(userData.val());
                        }).then(() => {
                            myFriends.sort(function(a, b){return b.exp - a.exp});
                            $(".friends-ranking-table tr:not(:first-child)").remove();
                            for(var i = 0; i < myFriends.length; i++){
                                if(i == 0){
                                    var tr = `
                                    <tr class="${myFriends[i].uid}" style="background:#ffff008a">
                                        <td><img src="images/1st.svg"></td>
                                        <td>${myFriends[i].name} <img src="${myFriends[i].picture}" class="pimg"></td>
                                        <td>${myFriends[i].wins}</td>
                                        <td>${myFriends[i].equals}</td>
                                        <td>${myFriends[i].loses}</td>
                                        <td>${myFriends[i].exp}</td>
                                    </tr>
                                    `;
                                } else if (i == 1){
                                    var tr = `
                                    <tr class="${myFriends[i].uid}" style="background:#c0c0c08c">
                                        <td><img src="images/2nd.svg"></td>
                                        <td>${myFriends[i].name} <img src="${myFriends[i].picture}" class="pimg"></td>
                                        <td>${myFriends[i].wins}</td>
                                        <td>${myFriends[i].equals}</td>
                                        <td>${myFriends[i].loses}</td>
                                        <td>${myFriends[i].exp}</td>
                                    </tr>
                                    `;
                                } else if (i == 2){
                                    var tr = `
                                    <tr class="${myFriends[i].uid}" style="background:#ff85339c">
                                        <td><img src="images/3rd.svg"></td>
                                        <td>${myFriends[i].name} <img src="${myFriends[i].picture}" class="pimg"></td>
                                        <td>${myFriends[i].wins}</td>
                                        <td>${myFriends[i].equals}</td>
                                        <td>${myFriends[i].loses}</td>
                                        <td>${myFriends[i].exp}</td>
                                    </tr>
                                    `;
                                } else {
                                    var tr = `
                                    <tr class="${myFriends[i].uid}">
                                        <td>${i + 1}</td>
                                        <td>${myFriends[i].name} <img src="${myFriends[i].picture}" class="pimg"></td>
                                        <td>${myFriends[i].wins}</td>
                                        <td>${myFriends[i].equals}</td>
                                        <td>${myFriends[i].loses}</td>
                                        <td>${myFriends[i].exp}</td>
                                    </tr>
                                    `;
                                }
                                $(".friends-ranking-table").append(tr);
                                if(i > 19){
                                    $(".friends-ranking-table tr:last-child").hide();
                                }
                                var myTR = $(`.friends-ranking-table tr.${auth.user().uid}`).clone().show();
                                $(".me-friend").html(myTR);
                                if($(".me-friend tr").length > 1){
                                    $(".me-friend tr:not(:first-child)").remove();
                                }
                            }
                        });;
                    });
                } else {
                    var tr = `
                            <tr>
                                <td colspan="6">لا يوجد أصدقاء حتى الان</td>
                            </tr>
                            `;
                    $(".friends").append(tr);
                }
            });

        });
    }
});



/*--*--*--*--*--*--*--*--*--*--|> Get Friends List <|--*--*--*--*- *--*--*--*--*--*/
auth.onLoggedIn(user => {
    if(user){
        $(".friendListDiv").click(function(){
            $(".friends-table tr:not(:first-child)").remove();
            db.get(`users/${auth.user().uid}/friends`).then(Data => {
                if(Data){
                    Data.forEach(d => {
                        var user = d.val().ID;
                        db.get(`users/${user}`).then(data => {
                            if(data.val().avail){
                                var tr = `<tr class="${data.key}">
                                            <td>${data.val().name} <img class="pimg" src="${data.val().picture}"></td>
                                            <td>${data.val().exp}</td>
                                            <td><img src="images/challengeFriend.svg" title="Challenge" class="challange-start" id="${data.key}"></td>
                                        </tr>`;
                            } else {
                                var tr = `<tr class="${data.key}">
                                            <td>${data.val().name} <img class="pimg" src="${data.val().picture}"></td>
                                            <td>${data.val().exp}</td>
                                            <td><img src="images/no-friends.svg" title="Not Available"></td>
                                        </tr>`;
                            }
                            $(".friends-table").append(tr);
                        });
                    });
                    $(".friends-table").on("click", ".challange-start", function(){
                        var UserID = $(".challange-start").attr("id");
                        var RoomID = Math.floor(Math.random() * 100000000000000);
                        db.update(`users/${UserID}/requset`, {
                            id: auth.user().uid,
                            room: RoomID
                        }).then(() => {
                            $(".challengeDiv").hide().siblings().hide();
                            $(".main-face").fadeIn();
                            $(".friend-list").hide();
                            $(".loading").fadeIn();
                            $(".match").fadeIn();
                            $(".match h2").html(`بإنتظار قبول طلب التحدي
                            <br><button onclick="location.reload()">إنسحاب</button>`);
        
                            db.add(`rooms/${RoomID}`, {
                                state: "matching",
                                Qstate: "unset",
                                id: RoomID,
                                playerOne: auth.user().uid
                            }).then( () => {
                                db.getting(`rooms/${RoomID}`, data => {
                                    if (data.val().state == "full"){
                                        db.get(`users/${data.val().playerTwo}`).then(playerTwo => {
                                            setTimeout(() => {
                                                $(".loading").hide();
                                                $(".game-face").show();
                                                $(".match").hide();
                                                $(".p1img").attr("src", playerTwo.val().picture);
                                                $(".p1name").text(playerTwo.val().name);
                                                $(".p2img").attr("src", `${auth.user().photoURL}`);
                                                $(".p2name").text(auth.user().displayName);
                                                $(".playerOne").css("transform", "translateY(0px)");
                                                $(".playerTwo").css("transform", "translateY(0px)");
                                                $("nav").hide();
                                                db.update(`rooms/${data.key}`, { state: "inGame" }).then(() => {
                                                    setTimeout(() => {
                                                        startNewGame(data.key, 1, playerTwo.val().picture, auth.user().photoURL);
                                                        $(".game-face").hide();
                                                        $(".game").show();
                                                        $(".player-two-score").html(`${playerTwo.val().name}: <span class="score">0</span> Point`);
                                                        $(".player-one-score").html(`${auth.user().displayName}: <span class="score">0</span> Point`);
                                                    }, 4000);
                                                });
                                            }, 2000);
                                        });
                                    }
                                });
                            
                            });
                        });
                    });
                } else {
                    $(".friends").hide();
                    $(".noFriends").show();
                }
            });
        });
    }
});



/*--*--*--*--*--*--*--*--*--*--|> Add a New Friend <|--*--*--*--*- *--*--*--*--*--*/
auth.onLoggedIn(user => {
    if(user){
        $(".search-btn").click(function(){
            var search = $("#search-input").val();
            db.get("users").then(Data => {
                Data.forEach(data => {
                    $(".result-table tr:not(:first-child)").remove();
                    if(data.val().uid != auth.user().uid){
                        if(data.val().email == search){
                            $(".add-friend-modal h4").show();
                            $(".result-table").show();
                            $(".noResults").hide();
                            $("#search-input").val("");
                            db.get(`users/${data.val().uid}`).then(searchUser => {
                                var tr = `
                                        <tr>
                                            <td>${searchUser.val().name} <img class="pimg" src="${searchUser.val().picture}"></td>
                                            <td>${searchUser.val().exp}</td>
                                            <td><i class="fas fa-plus-circle addThis" title="Add A Friend" id="${searchUser.val().uid}"></i></td>
                                        </tr>`;
                                $(".result-table").append(tr);
                                $(".result-table tr").on("click", ".addThis", function(){
                                    var thisAdd = $(this).parent();
                                    var userID = $(this).attr("id");
                                    db.add(`users/${auth.user().uid}/friends/${userID}`, {
                                        ID: userID
                                    }).then(() => {

                                        thisAdd.html("ADDED");
                                        $(".friends-table tr:not(:first-child)").remove();
                                        db.get(`users/${auth.user().uid}/friends`).then(Data => {
                                            Data.forEach(d => {
                                                var user = d.val().ID;
                                                db.get(`users/${user}`).then(data => {
                                                    if(data.val().avail){
                                                        var tr = `<tr>
                                                                    <td>${data.val().name} <img class="pimg" src="${data.val().picture}"></td>
                                                                    <td>${data.val().exp}</td>
                                                                    <td><img src="images/challengeFriend.svg" title="Challenge" class="challange-start" id="${data.key}"></td>
                                                                </tr>`;
                                                    } else {
                                                        var tr = `<tr class="${data.key}">
                                                                    <td>${data.val().name} <img class="pimg" src="${data.val().picture}"></td>
                                                                    <td>${data.val().exp}</td>
                                                                    <td><img src="images/no-friends.svg" title="Not Available"></td>
                                                                </tr>`;
                                                    }
                                                    $(".friends-table").append(tr);
                                                });
                                            });
                                        });

                                    });
                                });
                            });
                        }
                    } else {
                        if( $(".result-table tr:nth-child(2)").length == 0 ){
                            $(".noResults").show();
                            $(".result-table").hide();
                        }
                    }
                });
            });
        });
    }
});



/*--*--*--*--*--*--*--*--*--*--|> Get My Friend Game Requsets <|--*--*--*--*- *--*--*--*--*--*/
auth.onLoggedIn(user => {
    if(user){
        db.getting(`users/${auth.user().uid}/requset`, data => {
            if(data.val()){
                if( $(".game").css("display") == "none" ){
                    db.get(`users/${data.val().id}`).then(userData => {
                        $(".game-request").show();
                        $(".game-request .body img").attr("src", userData.val().picture);
                        $(".game-request .body h4").text(userData.val().name);
                        $(".game-request .body span").text(userData.val().name);
                        $(".cancel").click(function(){
                            db.update(`users/${auth.user().uid}`, {requset: null});
                        });
                        $(".accept").click(function(){
                            db.update(`rooms/${data.val().room}`, {
                                state: "full",
                                playerTwo: auth.user().uid
                            }).then( () => {
                                $(".challengeDiv").hide().siblings().hide();
                                $(".friend-list").hide();
                                $(".rankings-section").hide();
                                $(".settings-section").hide();
                                $(".game-request").hide();
                                $(".loading").fadeIn();
                                $(".match").fadeIn();
                                setTimeout(() => {
                                    $(".loading").hide();
                                    $(".main-face").show();
                                    $(".game-face").show();
                                    $(".match").hide();
                                    $(".p1img").attr("src", `${auth.user().photoURL}`);
                                    $(".p1name").text(auth.user().displayName);
                                    $(".p2img").attr("src", userData.val().picture);
                                    $(".p2name").text(userData.val().name);
                                    $(".playerOne").css("transform", "translateY(0px)");
                                    $(".playerTwo").css("transform", "translateY(0px)");
                                    $("nav").hide();
                                    db.update(`users/${auth.user().uid}`,{requset: null});
                                    db.update(`rooms/${data.val().room}`, { state: "inGame" }).then(() => {
                                        setTimeout(() => {
                                            startNewGame(data.val().room, 2, auth.user().photoURL, userData.val().picture);
                                            $(".game-face").hide();
                                            $(".game").show();
                                            $(".player-two-score").html(`${auth.user().displayName}: <span class="score">0</span> Point`);
                                            $(".player-one-score").html(`${userData.val().name}: <span class="score">0</span> Point`);
                                        }, 4000);
                                    });
                                }, 2000);
                            });
                        });
                    });
                }
            }
        });
    }
});


/*--*--*--*--*--|> Start The Game Room <|--*--*- *--*--*/
function startNewGame(roomID, meNumber, p1pic, p2pic){
    db.get(`rooms/${roomID}`).then(Data => {
        const data = Data.val();
        getNextQuestion(1);

        /*--*--|> GETTING AND LISTENING FOR THE OPENENT RESULTS <|--*--*/
        if(meNumber == 1){
            db.getting(`rooms/${roomID}`, d => { $(".player-two-score .score").text( d.val().playerTwoScore ) });
        } else if (meNumber == 2){
            db.getting(`rooms/${roomID}`, d => { $(".player-one-score .score").text( d.val().playerOneScore ) });
        }

        var sec = 11;
        var timer = setInterval(() => {
            sec--;
            $(".timer").html(`0:${sec} <i class="far fa-clock"></i>`);
            if(sec == 0){
                clearInterval(timer);
                sec = 11;
                getNextQuestion(2);
            }
        }, 1000);

        /*--*--|> GO SHOW NEXT QUESTION <|--*--*/
        function getNextQuestion(num){
            $(".options span").removeClass("correct").removeClass("end").css({
                "color": "#000000",
                "background-color": "rgb(233, 232, 232)"
            });

            /*--*--|> CHECK if THE ANSWER IS CORRECT <|--*--*/
            function checkAnswer(){
                $(".options span").click(function(){
                    if( $(this).hasClass("correct") && !$(this).hasClass("end") ){
                        $(this).css({
                            "color": "#FFFFFF",
                            "background-color": "green"
                        });
                        $(".options span").removeClass("correct").addClass("end");
                        if(meNumber == 1){
                            var oldScore = Number($(".player-one-score .score").text());
                            $(".player-one-score .score").text(oldScore + 10);
                            db.update(`rooms/${roomID}`, { playerOneScore: oldScore + 10 });
                        } else if (meNumber == 2){
                            var oldScore = Number($(".player-two-score .score").text());
                            $(".player-two-score .score").text(oldScore + 10);
                            db.update(`rooms/${roomID}`, { playerTwoScore: oldScore + 10 });
                        }
                    } else if ( !$(this).hasClass("correct") && !$(this).hasClass("end")) {
                        $(this).css({
                            "color": "#FFFFFF",
                            "background-color": "red"
                        });
                        $(".options span").removeClass("correct").addClass("end");
                    }
                });
            }
            
            /*--*--|> CHECKING AND SHOWING THE QUESTION NUMBER <|--*--*/
            if(num == 1){

                $(".questionNumber").html(`${num}<i class="fas fa-hashtag fa-sm"></i>`);

                $(".question").text(data.q1.question);
                $(".optOne").text(data.q1.answers[0]);
                $(".optTwo").text(data.q1.answers[1]);
                $(".optThree").text(data.q1.answers[2]);
                $(".optFour").text(data.q1.answers[3]);

                if ( $(".optOne").text() == data.q1.correct ){
                    $(".optOne").addClass("correct");
                } else if ( $(".optTwo").text() == data.q1.correct ){
                    $(".optTwo").addClass("correct");
                } else if ( $(".optThree").text() == data.q1.correct ){
                    $(".optThree").addClass("correct");
                } else if ( $(".optFour").text() == data.q1.correct ){
                    $(".optFour").addClass("correct");
                }

                checkAnswer();

            } else if (num == 2){
                $(".questionNumber").html(`${num}<i class="fas fa-hashtag fa-sm"></i>`);

                $(".question").text(data.q2.question);
                $(".optOne").text(data.q2.answers[0]);
                $(".optTwo").text(data.q2.answers[1]);
                $(".optThree").text(data.q2.answers[2]);
                $(".optFour").text(data.q2.answers[3]);
    
                if ( $(".optOne").text() == data.q2.correct ){
                    $(".optOne").addClass("correct");
                } else if ( $(".optTwo").text() == data.q2.correct ){
                    $(".optTwo").addClass("correct");
                } else if ( $(".optThree").text() == data.q2.correct ){
                    $(".optThree").addClass("correct");
                } else if ( $(".optFour").text() == data.q2.correct ){
                    $(".optFour").addClass("correct");
                }

                checkAnswer();

                var timer = setInterval(() => {
                    sec--;
                    $(".timer").html(`0:${sec} <i class="far fa-clock"></i>`);
                    if(sec == 0){
                        clearInterval(timer);
                        sec = 11;
                        getNextQuestion(3);
                    }
                }, 1000);

            } else if (num == 3){
                $(".questionNumber").html(`${num}<i class="fas fa-hashtag fa-sm"></i>`);

                $(".question").text(data.q3.question);
                $(".optOne").text(data.q3.answers[0]);
                $(".optTwo").text(data.q3.answers[1]);
                $(".optThree").text(data.q3.answers[2]);
                $(".optFour").text(data.q3.answers[3]);
    
                if ( $(".optOne").text() == data.q3.correct ){
                    $(".optOne").addClass("correct");
                } else if ( $(".optTwo").text() == data.q3.correct ){
                    $(".optTwo").addClass("correct");
                } else if ( $(".optThree").text() == data.q3.correct ){
                    $(".optThree").addClass("correct");
                } else if ( $(".optFour").text() == data.q3.correct ){
                    $(".optFour").addClass("correct");
                }

                checkAnswer();

                var timer = setInterval(() => {
                    sec--;
                    $(".timer").html(`0:${sec} <i class="far fa-clock"></i>`);
                    if(sec == 0){
                        clearInterval(timer);
                        sec = 11;
                        getNextQuestion(4);
                    }
                }, 1000);
            } else if (num == 4){
                $(".questionNumber").html(`${num}<i class="fas fa-hashtag fa-sm"></i>`);

                $(".question").text(data.q4.question);
                $(".optOne").text(data.q4.answers[0]);
                $(".optTwo").text(data.q4.answers[1]);
                $(".optThree").text(data.q4.answers[2]);
                $(".optFour").text(data.q4.answers[3]);
    
                if ( $(".optOne").text() == data.q4.correct ){
                    $(".optOne").addClass("correct");
                } else if ( $(".optTwo").text() == data.q4.correct ){
                    $(".optTwo").addClass("correct");
                } else if ( $(".optThree").text() == data.q4.correct ){
                    $(".optThree").addClass("correct");
                } else if ( $(".optFour").text() == data.q4.correct ){
                    $(".optFour").addClass("correct");
                }

                checkAnswer();

                var timer = setInterval(() => {
                    sec--;
                    $(".timer").html(`0:${sec} <i class="far fa-clock"></i>`);
                    if(sec == 0){
                        clearInterval(timer);
                        sec = 11;
                        getNextQuestion(5);
                    }
                }, 1000);
            } else if (num == 5){
                $(".questionNumber").html(`${num}<i class="fas fa-hashtag fa-sm"></i>`);

                $(".question").text(data.q5.question);
                $(".optOne").text(data.q5.answers[0]);
                $(".optTwo").text(data.q5.answers[1]);
                $(".optThree").text(data.q5.answers[2]);
                $(".optFour").text(data.q5.answers[3]);
    
                if ( $(".optOne").text() == data.q5.correct ){
                    $(".optOne").addClass("correct");
                } else if ( $(".optTwo").text() == data.q5.correct ){
                    $(".optTwo").addClass("correct");
                } else if ( $(".optThree").text() == data.q5.correct ){
                    $(".optThree").addClass("correct");
                } else if ( $(".optFour").text() == data.q5.correct ){
                    $(".optFour").addClass("correct");
                }

                checkAnswer();

                var timer = setInterval(() => {
                    sec--;
                    $(".timer").html(`0:${sec} <i class="far fa-clock"></i>`);
                    if(sec == 0){
                        clearInterval(timer);
                        sec = 11;
                        getNextQuestion(6);
                    }
                }, 1000);
            } else if (num == 6){
                $(".questionNumber").html(`${num}<i class="fas fa-hashtag fa-sm"></i>`);

                $(".question").text(data.q6.question);
                $(".optOne").text(data.q6.answers[0]);
                $(".optTwo").text(data.q6.answers[1]);
                $(".optThree").text(data.q6.answers[2]);
                $(".optFour").text(data.q6.answers[3]);
    
                if ( $(".optOne").text() == data.q6.correct ){
                    $(".optOne").addClass("correct");
                } else if ( $(".optTwo").text() == data.q6.correct ){
                    $(".optTwo").addClass("correct");
                } else if ( $(".optThree").text() == data.q6.correct ){
                    $(".optThree").addClass("correct");
                } else if ( $(".optFour").text() == data.q6.correct ){
                    $(".optFour").addClass("correct");
                }

                checkAnswer();

                var timer = setInterval(() => {
                    sec--;
                    $(".timer").html(`0:${sec} <i class="far fa-clock"></i>`);
                    if(sec == 0){
                        clearInterval(timer);
                        sec = 11;
                        getNextQuestion(7);
                    }
                }, 1000);
            } else if (num == 7){
                $(".questionNumber").html(`${num}<i class="fas fa-hashtag fa-sm"></i>`);

                $(".question").text(data.q7.question);
                $(".optOne").text(data.q7.answers[0]);
                $(".optTwo").text(data.q7.answers[1]);
                $(".optThree").text(data.q7.answers[2]);
                $(".optFour").text(data.q7.answers[3]);
    
                if ( $(".optOne").text() == data.q7.correct ){
                    $(".optOne").addClass("correct");
                } else if ( $(".optTwo").text() == data.q7.correct ){
                    $(".optTwo").addClass("correct");
                } else if ( $(".optThree").text() == data.q7.correct ){
                    $(".optThree").addClass("correct");
                } else if ( $(".optFour").text() == data.q7.correct ){
                    $(".optFour").addClass("correct");
                }

                checkAnswer();

                var timer = setInterval(() => {
                    sec--;
                    $(".timer").html(`0:${sec} <i class="far fa-clock"></i>`);
                    if(sec == 0){
                        clearInterval(timer);
                        sec = 11;
                        getNextQuestion(8);
                    }
                }, 1000);
            } else if (num == 8){
                $(".questionNumber").html(`${num}<i class="fas fa-hashtag fa-sm"></i>`);

                $(".question").text(data.q8.question);
                $(".optOne").text(data.q8.answers[0]);
                $(".optTwo").text(data.q8.answers[1]);
                $(".optThree").text(data.q8.answers[2]);
                $(".optFour").text(data.q8.answers[3]);
    
                if ( $(".optOne").text() == data.q8.correct ){
                    $(".optOne").addClass("correct");
                } else if ( $(".optTwo").text() == data.q8.correct ){
                    $(".optTwo").addClass("correct");
                } else if ( $(".optThree").text() == data.q8.correct ){
                    $(".optThree").addClass("correct");
                } else if ( $(".optFour").text() == data.q8.correct ){
                    $(".optFour").addClass("correct");
                }

                checkAnswer();

                var timer = setInterval(() => {
                    sec--;
                    $(".timer").html(`0:${sec} <i class="far fa-clock"></i>`);
                    if(sec == 0){
                        clearInterval(timer);
                        sec = 11;
                        getNextQuestion(9);
                    }
                }, 1000);
            } else if (num == 9){
                $(".questionNumber").html(`${num}<i class="fas fa-hashtag fa-sm"></i>`);

                $(".question").text(data.q9.question);
                $(".optOne").text(data.q9.answers[0]);
                $(".optTwo").text(data.q9.answers[1]);
                $(".optThree").text(data.q9.answers[2]);
                $(".optFour").text(data.q9.answers[3]);
    
                if ( $(".optOne").text() == data.q9.correct ){
                    $(".optOne").addClass("correct");
                } else if ( $(".optTwo").text() == data.q9.correct ){
                    $(".optTwo").addClass("correct");
                } else if ( $(".optThree").text() == data.q9.correct ){
                    $(".optThree").addClass("correct");
                } else if ( $(".optFour").text() == data.q9.correct ){
                    $(".optFour").addClass("correct");
                }

                checkAnswer();

                var timer = setInterval(() => {
                    sec--;
                    $(".timer").html(`0:${sec} <i class="far fa-clock"></i>`);
                    if(sec == 0){
                        clearInterval(timer);
                        sec = 11;
                        getNextQuestion(10);
                    }
                }, 1000);
            } else if (num == 10){
                $(".questionNumber").html(`${num}<i class="fas fa-hashtag fa-sm"></i>`);

                $(".question").text(data.q10.question);
                $(".optOne").text(data.q10.answers[0]);
                $(".optTwo").text(data.q10.answers[1]);
                $(".optThree").text(data.q10.answers[2]);
                $(".optFour").text(data.q10.answers[3]);
    
                if ( $(".optOne").text() == data.q10.correct ){
                    $(".optOne").addClass("correct");
                } else if ( $(".optTwo").text() == data.q10.correct ){
                    $(".optTwo").addClass("correct");
                } else if ( $(".optThree").text() == data.q10.correct ){
                    $(".optThree").addClass("correct");
                } else if ( $(".optFour").text() == data.q10.correct ){
                    $(".optFour").addClass("correct");
                }

                checkAnswer();

                var timer = setInterval(() => {
                    sec--;
                    $(".timer").html(`0:${sec} <i class="far fa-clock"></i>`);
                    if(sec == 0){
                        clearInterval(timer);
                        checkResults(data.playerOne, data.playerTwo);
                    }
                }, 1000);
            }
            
        }

        /*--*--|> CHECK AND SAVE FINAL GAME RESULTS <|--*--*/
        function checkResults(IdOne, IdTwo){
            $(".game").hide();
            $(".game-end").show();
            if(meNumber == 1){
                $(".p1result i.addThisFriend").remove();
                $(".p2result i.meUser").remove();
                $(".p2result").attr("id", IdTwo);
                var myScore = Number($(".player-one-score .score").text());
                var otherScore = Number($(".player-two-score .score").text());
                
                if(myScore > otherScore){
                    if(myScore == 100){
                        $(".game-end .winner-ultimate").show();
                        $(".game-end .p1result").css({ "color": "#000", "background-color": "yellow", "border-color": "yellow" });
                        $(".game-end .p2result").css({ "background-color": "#000", "border-color": "#000" });
                    } else {
                        $(".game-end .winner").show();
                        $(".game-end .p1result").css({ "background-color": "#28B446", "border-color": "#28B446" });
                        $(".game-end .p2result").css({ "background-color": "#B42828", "border-color": "#B42828" });
                    }
                    db.get(`users/${auth.user().uid}`).then(dd => {
                        db.update(`users/${auth.user().uid}`, { exp: dd.val().exp + myScore, wins: dd.val().wins + 1 });
                    });
                } else if (myScore == otherScore) {
                    $(".game-end .equal").show();
                    $(".game-end .p1result").css({ "color": "#000", "background-color": "#ccc", "border-color": "#ccc" });
                    $(".game-end .p2result").css({ "color": "#000", "background-color": "#ccc", "border-color": "#ccc" });
                    db.get(`users/${auth.user().uid}`).then(dd => {
                        db.update(`users/${auth.user().uid}`, { exp: dd.val().exp + myScore, equals: dd.val().equals + 1 });
                    });
                } else {
                    $(".game-end .loser").show();
                    $(".game-end .p1result").css({ "background-color": "#B42828", "border-color": "#B42828" });
                    $(".game-end .p2result").css({ "background-color": "#28B446", "border-color": "#28B446" });
                    db.get(`users/${auth.user().uid}`).then(dd => {
                        db.update(`users/${auth.user().uid}`, { exp: dd.val().exp + myScore, loses: dd.val().loses + 1 });
                    });
                }
                
                $(".p1result h3").text(`${myScore} نقطة`);
                $(".p1result img").attr("src", p2pic);
                $(".p2result h3").text(`${otherScore} نقطة`);
                $(".p2result img").attr("src", p1pic);

                db.update(`rooms/${roomID}`, {
                    playerOne: null,
                    playerOneScore: null
                });
                
            } else if (meNumber == 2){
                $(".p2result i.addThisFriend").remove();
                $(".p1result i.meUser").remove();
                $(".p1result").attr("id", IdOne);
                var myScore = Number($(".player-two-score .score").text());
                var otherScore = Number($(".player-one-score .score").text());

                if(myScore > otherScore){
                    if(myScore == 100){
                        $(".game-end .winner-ultimate").show();
                        $(".game-end .p1result").css({ "background-color": "#000", "border-color": "#000" });
                        $(".game-end .p2result").css({ "color": "#000", "background-color": "yellow", "border-color": "yellow" });
                    } else {
                        $(".game-end .winner").show();
                        $(".game-end .p1result").css({ "background-color": "#B42828", "border-color": "#B42828" });
                        $(".game-end .p2result").css({ "background-color": "#28B446", "border-color": "#28B446" });
                    }
                    db.get(`users/${auth.user().uid}`).then(dd => {
                        db.update(`users/${auth.user().uid}`, { exp: dd.val().exp + myScore, wins: dd.val().wins + 1 });
                    });
                } else if (myScore == otherScore) {
                    $(".game-end .equal").show();
                    $(".game-end .p1result").css({ "color": "#000", "background-color": "#ccc", "border-color": "#ccc" });
                    $(".game-end .p2result").css({ "color": "#000", "background-color": "#ccc", "border-color": "#ccc" });
                    db.get(`users/${auth.user().uid}`).then(dd => {
                        db.update(`users/${auth.user().uid}`, { exp: dd.val().exp + myScore, equals: dd.val().equals + 1 });
                    });
                } else {
                    $(".game-end .loser").show();
                    $(".game-end .p1result").css({ "background-color": "#28B446", "border-color": "#28B446" });
                    $(".game-end .p2result").css({ "background-color": "#B42828", "border-color": "#B42828" });
                    db.get(`users/${auth.user().uid}`).then(dd => {
                        db.update(`users/${auth.user().uid}`, { exp: dd.val().exp + myScore, loses: dd.val().loses + 1 });
                    });
                }
                
                $(".p1result h3").text(`${otherScore} نقطة`);
                $(".p1result img").attr("src", p2pic);
                $(".p2result h3").text(`${myScore} نقطة`);
                $(".p2result img").attr("src", p1pic);
                
                db.update(`rooms/${roomID}`, {
                    playerTwo: null,
                    playerTwoScore: null
                });
            }
        }

    });
    
}

/*--*--*--*--*--*--*--*--*--*--|> Add a Friend After A Game <|--*--*--*--*- *--*--*--*--*--*/
$(".addThisFriend").on("click", function(){
    var userID = $(this).parent().attr("id");
    db.add(`users/${auth.user().uid}/friends/${userID}`, {
        ID: userID
    }).then(() => {
        Swal.fire({
            type: 'success',
            text: 'تمت إضافة المنافس إلى قائمة الاصدقاء بنجاح!'
        });
    });
});