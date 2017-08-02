(function ($) {
    'use strict'
    DLC.EditLoginPwd = DLC.derive(DLC.DLC, {
        create: function () {
            this.User = app.currentUser;
            window.app.initHeader(4);
        },
        init: function () {
            DLC.Util.initPage();
            var that = this;
            $('input').placeholder({isUseSpan:true,placeholderColor:'#d2d2d2'});
            $("#oldEye").click(function () {
                if ($(this).hasClass("eye")) {
                    $(this).removeClass("eye");
                    $(this).addClass("eye1");
                    $("#oldPassword").attr("type", "text");
                } else {
                    $(this).removeClass("eye1");
                    $(this).addClass("eye");
                    $("#oldPassword").attr("type", "password");
                }
                //                app.keyWordShow("oldPassword", 1);
            });
            $("#newEye").click(function () {
                if ($(this).hasClass("eye")) {
                    $(this).removeClass("eye");
                    $(this).addClass("eye1");
                    $("#newPassword").attr("type", "text");
                } else {
                    $(this).removeClass("eye1");
                    $(this).addClass("eye");
                    $("#newPassword").attr("type", "password");
                }
            });
            $("#newAgainEye").click(function () {
                if ($(this).hasClass("eye")) {
                    $(this).removeClass("eye");
                    $(this).addClass("eye1");
                    $("#newAgainPassword").attr("type", "text");
                } else {
                    $(this).removeClass("eye1");
                    $(this).addClass("eye");
                    $("#newAgainPassword").attr("type", "password");
                }
            });
            $('#oldPassword').focus(function () {
                $(this).css("border-color", "#398be1");
                $("#oldPwdShowErr").html('');
            }).blur(function () {
                $(this).css("border-color", "");
//                that.oldPwdFun($(this).val());
            });
            $('#newPassword').focus(function () {
                $(this).css("border-color", "#398be1");
                $("#newPwdShowErr").html('');
            }).blur(function () {
                $(this).css("border-color", "");
//                that.newPwdFun($("#oldPassword").val(), $(this).val());
            });
            $('#newAgainPassword').focus(function () {
                $(this).css("border-color", "#398be1");
                $("#newAgainPwdShowErr").html('');
            }).blur(function () {
                $(this).css("border-color", "");
//                that.newAgainPwdFun($("#newPassword").val(), $(this).val());
            });
            $("#editBotton").click(function () {
                var oldPwd = $("#oldPassword").val();
                var newPwd = $("#newPassword").val();
                var newAgainPwd = $("#newAgainPassword").val();
                var isOk = true;
                if (!that.oldPwdFun(oldPwd)) {
                    isOk = false;
                }
                if (!that.newPwdFun(oldPwd, newPwd)) {
                    isOk = false;
                }
                if (!that.newAgainPwdFun(newPwd, newAgainPwd)) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                $(this).attr("disabled", "true");
                //验证原始密码是否有效
                that.User.passwordValidate(oldPwd, function () {
                    that.User.passwordChange(newPwd, function () {
                        that.User.logout(function () {
                            window.app = null;
                            //刷新当前页
                            window.location.reload();
                        }, function () {});
                    }, function (errorCode, errorMsg) {
                        $("#newAgainPwdShowErr").html(errorMsg);
                        $("#editBotton").removeAttr("disabled");
                    });
                }, function (errorCode, errorMsg) {
                    $("#newAgainPwdShowErr").html(errorMsg);
                    $("#editBotton").removeAttr("disabled");
                });
            });
        },
        oldPwdFun: function (oldPwd) {
            var isOk = true;
            var passwordRule = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/; //密码验证规则
            if (oldPwd.trim() == "" || oldPwd == null) {
                $("#oldPwdShowErr").html("请输入原登录密码");
                $('#oldPassword').css("border-color", "#ff0045");
                isOk = false;
            } else if (!passwordRule.test(oldPwd)) {
                $("#oldPwdShowErr").html("请输入8-16位数字和字母组合的密码");
                $('#oldPassword').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#oldPwdShowErr").html('');
            }
            return isOk;
        },
        newPwdFun: function (oldPwd, newPwd) {
            var isOk = true;
            var passwordRule = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/; //密码验证规则
            if (newPwd.trim() == "" || newPwd == null) {
                $("#newPwdShowErr").html("请输入新登录密码");
                $('#newPassword').css("border-color", "#ff0045");
                isOk = false;
            } else if (!passwordRule.test(newPwd)) {
                $("#newPwdShowErr").html("请输入8-16位数字和字母组合的密码");
                $('#newPassword').css("border-color", "#ff0045");
                isOk = false;
            } else if (newPwd == oldPwd) {
                $("#newPwdShowErr").html("新登录密码不可与原登录密码相同");
                $('#newPassword').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#newPwdShowErr").html('');
            }
            return isOk;
        },
        newAgainPwdFun: function (newPwd, newAgainPwd) {
            var isOk = true;
            if (newAgainPwd.trim() == "" || newAgainPwd == null) {
                $("#newAgainPwdShowErr").html("请再次输入新登录密码");
                $('#newAgainPassword').css("border-color", "#ff0045");
                isOk = false;
            } else if (newPwd != newAgainPwd) {
                $("#newAgainPwdShowErr").html("新密码与确认密码不匹配");
                $('#newAgainPassword').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#newAgainPwdShowErr").html('');
            }
            return isOk;
        }
    }, {})
})($)
