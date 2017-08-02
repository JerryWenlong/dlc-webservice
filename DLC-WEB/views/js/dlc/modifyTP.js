(function ($) {
    'use strict'
    DLC.ModifyTstPwd = DLC.derive(DLC.DLC, {
        create: function () {
            this.user = app.currentUser;
            window.app.initHeader(4);
        },
        init: function () {
            DLC.Util.initPage();
            var that = this;
            $('input').placeholder({
                placeholderColor:'#d2d2d2',
                isUseSpan: true,
                onInput:true,
            });
            //交易密码的可见与不可见事件
            $('#eye1').bind('click', function () {
                var inp,cid,val,pler;
                if ($('#oldTstPwd').attr('type') == 'password') {
                    $('#eye1').removeClass('e_one').addClass('e_two');
                    $('#oldTstPwd').attr('type', 'text');
                } else {
                    $('#eye1').removeClass('e_two').addClass('e_one');
                    $('#oldTstPwd').attr('type', 'password');
                }
            });
            $('#eye2').bind('click', function () {
                if ($('#newTstPwd').attr('type') == 'password') {
                    $('#eye2').removeClass('e_one').addClass('e_two');
                    $('#newTstPwd').attr('type', 'text');
                } else {
                    $('#eye2').removeClass('e_two').addClass('e_one');
                    $('#newTstPwd').attr('type', 'password');
                }
            });
            $('#eye3').bind('click', function () {
                if ($('#angieNewPwd').attr('type') == 'password') {
                    $('#eye3').removeClass('e_one').addClass('e_two');
                    $('#angieNewPwd').attr('type', 'text');
                } else {
                    $('#eye3').removeClass('e_two').addClass('e_one');
                    $('#angieNewPwd').attr('type', 'password');
                }
            });

            //            $('#oldTstPwd').bind('blur', function () {
            //                var oldTstPwd = $('#oldTstPwd').val();
            //                if (oldTstPwd.length != 0) {
            //                    that.user.setTradePwValidate(oldTstPwd, function () {
            //                        that.oldTP = true;
            //                        $('#oldTstPwd').css('border', '1px solid #398be1');
            //                        $('#cTSEOne').html('');
            //                    }, function (errorCode, errorMsg) {
            //                        that.oldTP = false;
            //                        $('#oldTstPwd').css('border', '1px solid #ff0045');
            //                        $('#cTSEOne').html('！ ' + errorMsg);
            //                    })
            //                } else {
            //                    that.oldTP = false;
            //                    $('#oldTstPwd').css('border', '1px solid #ff0045');
            //                    $('#cTSEOne').html('！ 请输入原交易密码默认与初始登录密码一致');
            //                }
            //            });

            $('#oldTstPwd').focus(function () {
                $(this).css('border-color', '#398be1');
                $('#cTSEOne').html('');
            }).blur(function () {
                $(this).css('border-color', '');
            });
            $('#newTstPwd').focus(function () {
                $(this).css('border-color', '#398be1');
                $('#cTSETwo').html('');
            }).blur(function () {
                $(this).css('border-color', '');
            });
            $('#angieNewPwd').focus(function () {
                $(this).css('border-color', '#398be1');
                $('#cTSEThree').html('');
            }).blur(function () {
                $(this).css('border-color', '');
            });

            //修改交易密码
            $('#m_but').bind('click', function () {
                var oldTstPwd = $('#oldTstPwd').val();
                var newTstPwd = $('#newTstPwd').val();
                var angieNewPwd = $('#angieNewPwd').val();

                var isOK = true;
                if (!that.checkOldTstPwd(oldTstPwd)) {
                    isOK = false;
                }
                if (!that.checkNewTstPwd(oldTstPwd, newTstPwd)) {
                    isOK = false;
                }
                if (!that.checkAgainNewTstPwd(newTstPwd, angieNewPwd)) {
                    isOK = false;
                }
                if (!isOK) {
                    return;
                }
                $('#m_but').attr('disabled', 'true');
                //验证原交易密码
                that.user.setTradePwValidate(oldTstPwd, function () {
                    //设置新交易密码
                    that.user.setTradePw(newTstPwd, function () {
                        $('#cTSEThree').html('修改成功').css('color', 'green');
                        window.location.href = "/myCenter_account";
                    }, function (errorCode, errorMsg) {
                        $('#m_but').removeAttr('disabled');
                        $('#cTSEThree').html(errorMsg);
                    })
                }, function (errorCode, errorMsg) {
                    $('#m_but').removeAttr('disabled');
                    $('#oldTstPwd').css('border', '1px solid #ff0045');
                    $('#cTSEOne').html(errorMsg);
                })
            });
        },

        //旧交易密码验证
        checkOldTstPwd: function (password) {
            //var reg = /((?=.*[a-zA-Z])(?=.*[0-9]))\S{8,16}$/;
            var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
            var isOk = true;
            if (password.trim() == "" || password == null) {
                $('#cTSEOne').html('请输入原交易密码默认与初始登录密码一致');
                $('#oldTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else if (!reg.test(password)) {
                $('#cTSEOne').html('请输入8-16位数字和字母组合的密码');
                $('#oldTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $('#cTSEOne').html('');
            }
            return isOk;
        },
        //新交易密码验证
        checkNewTstPwd: function (oldTstPwd, newTstPwd) {
            var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
            var isOk = true;
            if (newTstPwd.trim() == "" || newTstPwd == null) {
                $('#cTSETwo').html('请输入新交易密码');
                $('#newTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else if (!reg.test(newTstPwd)) {
                $('#cTSETwo').html('请输入8-16位数字和字母组合的密码');
                $('#newTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else if (newTstPwd == oldTstPwd) {
                $("#cTSETwo").html("新交易密码不可与原交易密码相同");
                $('#newTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $('#cTSETwo').html('');
            }
            return isOk;
        },
        //确认交易密码验证
        checkAgainNewTstPwd: function (newPwd, newAgainPwd) {
            var isOk = true;
            if (newAgainPwd.trim() == "" || newAgainPwd == null) {
                $("#cTSEThree").html("请再次输入新交易密码");
                $('#angieNewPwd').css("border-color", "#ff0045");
                isOk = false;
            } else if (newPwd != newAgainPwd) {
                $("#cTSEThree").html("两次输入的新交易密码不一致");
                $('#angieNewPwd').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#cTSEThree").html('');
            }
            return isOk;
        },

    }, {})
})($)
