(function ($) {
    'use strict';
    var that = null;
    DLC.Auth = DLC.derive(DLC.DLC, {
        create: function () {
            this.user = app.currentUser;
            this.account = app.account;
            that = this;
            window.app.initHeader(4);
        },
        init: function () {
            DLC.Util.initPage();
            var validator;
            $('input').placeholder({
                placeholderColor: '#8d8d8d',
                isUseSpan: true
            });
            //get accountInfo
            that.account.getBizAccountInfo(function () {
                that.initAccountInfo();
            }, function (errorCode, errorMsg) {
                $('.tipCardNumError').html('' + errorMsg);
            })

            $('#verifyBtn').bind("click", function (e) {
                e.preventDefault();
                if (validator.form()) {
                    $('#verifyBtn').attr("disabled", true);
                    that.account.certification($('#realName').val(), $('#cardNum').val(), function () {
                        app.initHeader();
                        that.goToComePage();
                    }, function (errorCode, errorMsg) {
                        $('#verifyBtn').removeAttr("disabled");
                        $('.tipCardNumError').html('' + errorMsg);
                    })
                }
            });

            $(':text').focus(function () {
                $(this).css("border-color", "#398be1");
            });

            validator = $('#authForm').validate({
                rules: {
                    realName: {
                        required: true,
                        realName: true
                    },
                    cardNum: {
                        required: true,
                        cardNum: true
                    },
                },
                messages: {
                    realName: {
                        required: "请输入真实姓名"
                    },
                    cardNum: {
                        required: "请输入身份证号",
                        cardNum: "请输入18位正确的身份证号"
                    },
                },
                success: function (element) {
                    var id = element[0]['id'];
                    if (id == 'realName-error') {
                        $(".tipRealNameError").html('');
                    } else if (id == 'cardNum-error') {
                        $(".tipCardNumError").html('');
                    }
                    var index = id.indexOf("-error");
                    var success_id = id.substring(0, index);
                    $("#" + success_id).css("border-color", "");
                },
                errorPlacement: function (error, element) {
                    var id = element[0]['id'];
                    var error_html = error[0].innerHTML;
                    if ('' != error_html) {
                        if (id == 'realName') {
                            $(".tipRealNameError").html(error_html);
                        } else if (id == 'cardNum') {
                            $(".tipCardNumError").html(error_html);
                        }
                        $("#" + id).css("border-color", "#ff0045");
                    }
                },
            });
            $.validator.addMethod("cardNum", function (idCard, element) {
                return DLC.Util.validateIdCard(idCard);
            }, "请输入18位正确的身份证号");

            $.validator.addMethod("realName", function (realName, element) {
                if (realName.length <= 1) {
                    return false;
                }
                var reg = /^([\u4e00-\u9fa5])*$/;
                if (!reg.test(realName)) {
                    return false;
                }
                return true;
            }, "请输入中文真实姓名");
        },
        initAccountInfo: function () {
            var data = that.account.accountInfo;
            if (data == null) return;
            if (data['authed'] == true) {
                $('#realName').val(data["name"]);
                $('#cardNum').val(data["idNo"]);
                $('#verifyBtn').hide();
                $('#realName').attr("readonly", "readonly");
                $('#cardNum').attr("readonly", "readonly");
                $.validator.addMethod("cardNum", function (value, element) {
                    return true;
                }, "");
                $.validator.addMethod("realName", function (value, element) {
                    return true;
                }, "");
            }
        },
        goToComePage: function () {
            //获取来源页面
            var hash = '/myCenter_account';
            if (app.route.oldHash) {
                hash = '/' + app.route.oldHash;
            }
            window.location.href = hash;
        },
    }, {})
})($)
