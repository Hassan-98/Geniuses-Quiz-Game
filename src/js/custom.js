/*--*--*--*--*--*--*--*--*--*--|> Navigation Bar <|--*--*--*--*- *--*--*--*--*--*/
/*--*--*--*--*--|> Main Items Hover <|--*--*- *--*--*/
$(".main-nav ul li").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
});
/*--*--*--*--*--|> Home Item <|--*--*- *--*--*/
$("li.home").click(function(){
    $(".settings-section").fadeOut();
    $(".rankings-section").fadeOut();
    $(".main-face").fadeOut();
    $(".friend-list").fadeOut();
    $(".loading").fadeIn();
    setTimeout(() => {
        $(".loading").fadeOut();
        $(".main-face").fadeIn();
    }, 3000);
});
/*--*--*--*--*--|> Settings Item <|--*--*- *--*--*/
$("li.settings").click(function(){
    $(".main-face").fadeOut();
    $(".rankings-section").fadeOut();
    $(".settings-section").fadeOut();
    $(".friend-list").fadeOut();
    $(".loading").fadeIn();
    setTimeout(() => {
        $(".loading").fadeOut();
        $(".settings-section").fadeIn();
    }, 3000);
});
/*--*--*--*--*--|> Rankings Item <|--*--*- *--*--*/
$("li.rankings").click(function(){
    $(".main-face").fadeOut();
    $(".settings-section").fadeOut();
    $(".rankings-section").fadeOut();
    $(".friend-list").fadeOut();
    $(".loading").fadeIn();
    setTimeout(() => {
        $(".loading").fadeOut();
        $(".rankings-section").fadeIn();
    }, 3000);
});
/*--*--*--*--*--|> General Rankings <|--*--*- *--*--*/
$(".general-rankings-btn").click(function(){
    $(this).addClass("active").siblings(".friends-rankings-btn").removeClass("active");
    $(".general-rankings").show();
    $(".friends-rankings").hide();
});
/*--*--*--*--*--|> Friends Rankings <|--*--*- *--*--*/
$(".friends-rankings-btn").click(function(){
    $(this).addClass("active").siblings(".general-rankings-btn").removeClass("active");
    $(".friends-rankings").show();
    $(".general-rankings").hide();
});
/*--*--*--*--*--|> Challange a Friend <|--*--*- *--*--*/
$(".challengeFriendDiv").click(function(){
    $(".friendListDiv").click();
});
/*--*--*--*--*--|> Friend List <|--*--*- *--*--*/
$(".friendListDiv").click(function(){
    $(".main-face").fadeOut();
    $(".settings-section").fadeOut();
    $(".rankings-section").fadeOut();
    $(".friend-list").fadeOut();
    $(".loading").fadeIn();
    setTimeout(() => {
        $(".loading").fadeOut();
        $(".friend-list").fadeIn();
    }, 3000);
});
/*--*--*--*--*--|> Back To Home From Friend List <|--*--*- *--*--*/
$(".friend-list .backToHome").click(function(){
    $("li.home").click();
});

/*--*--*--*--*--|> Cancel Game Request <|--*--*- *--*--*/
$(".game-request .cancel").click(function(){
    $(".game-request").hide();
});

/*--*--*--*--*--*--*--*--*--*--|> Game Functions <|--*--*--*--*- *--*--*--*--*--*/
/*--*--*--*--*--|> Start A New Round Game <|--*--*- *--*--*/
$(".new-game").click(function(){
    location.reload();
});

/*--*--*--*--*--*--*--*--*--*--|> MODALS <|--*--*--*--*- *--*--*--*--*--*/
/*--*--*--*--*--|> Close Any Modal <|--*--*- *--*--*/
$(".modals .close").click(function(){
    $(this).parent().removeClass("show");
});

/*--*--*--*--*--|> Open Login Modal <|--*--*- *--*--*/
$(".loginDiv").click(function(){
    $(".login-modal").addClass("show");
});

/*--*--*--*--*--|> Open SignUp Modal <|--*--*- *--*--*/
$(".signupDiv").click(function(){
    $(".signup-modal").addClass("show");
});

/*--*--*--*--*--|> Open Edit Modal <|--*--*- *--*--*/
$(".change-data").click(function(){
    $(".edit-modal").addClass("show");
});

/*--*--*--*--*--|> Open Add Friend Modal <|--*--*- *--*--*/
$(".addNewFriend").click(function(){
    $(".add-friend-modal").addClass("show");
});

/*--*--*--*--*--*--*--*--*--*--|> ALERTS <|--*--*--*--*- *--*--*--*--*--*/
/*--*--*--*--*--|> Red Alert Close <|--*--*- *--*--*/
$(".redClose").click(function(){
    $(this).parent().css("right", "-2000px");
});
/*--*--*--*--*--|> Green Alert Close <|--*--*- *--*--*/
$(".greenClose").click(function(){
    $(this).parent().css("right", "-2000px");
});