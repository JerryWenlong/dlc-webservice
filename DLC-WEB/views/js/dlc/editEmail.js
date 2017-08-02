(function($) {
    'use strict';
    var that = null;
    DLC.EditEmail = DLC.derive(DLC.DLC, {
        create: function() {
            this.user = app.currentUser;
            this.account = app.account;
            that = this;
            window.app.initHeader(4);
        },
        init: function() {
            DLC.Util.initPage();
            var validator;
            var interval;
            var times = 60;
            $('input').placeholder({
                placeholderColor: '#8d8d8d',
                isUseSpan: true
            });
            that.user.getUserInfo(function() {
                var mail = that.user.userInfo.email;
                if ("" != mail) {
                    $('.editMailSpan').html(mail);
                } else {
                    $('.orgMailLi').hide();
                }
            }, function(errorCode, errorMsg) {});

            //sendMail
            $('#editMailCodeBtn').bind("click", function(e) {
                e.preventDefault();
                $(".validateError").html('');
                $(".tipEditMail").show();
                if (validator.element("#email")) {
                    that.user.getOtpEmail($('#email').val(), function(otp) {
                        $('#editMailCodeBtn').attr("disabled", true);
                        $('#editMailCodeBtn').addClass('btn_disabled').removeClass('btn_enabled');
                        // $("#emailCode").val(otp);
                        times--;
                        $('#editMailCodeBtn').text(times + " s");
                        $('#editMailCodeBtn').css("border-color", "#398be1");
                        interval = setInterval(verifyClock, 1000);
                        $(".tipEditMail2").css('display', 'block');
                        $(".tipEditMailError2").html('');
                    }, function(errorCode, errorMsg) {
                        $(".tipEditMail2").hide();
                        $(".tipEditMailError2").html("" + errorMsg);
                    })
                }
            });

            //bind
            $('#editMailBtn').bind("click", function(e) {
                e.preventDefault();
                $(".validateError").html('');
                $(".tipEditMail").show();
                if (validator.form()) {
                    that.user.setMail($('#email').val(), $('#emailCode').val(), function(otp) {
                        $('#editMailBtn').attr("disabled", true);
                        window.location.href = '/myCenter_account';
                    }, function(errorCode, errorMsg) {
                        $(".tipEditMail2").hide();
                        $(".tipEditMailError2").html("" + errorMsg);
                    })
                }
            });

            //sms clock
            function verifyClock() {
                if ($('#editMailCodeBtn').text() == '获取验证码') {
                    clearInterval(interval);
                    return;
                }
                $('#editMailCodeBtn').text(times + " s");
                if (times == 0) {
                    $('#editMailCodeBtn').text("获取验证码");
                    $('#editMailCodeBtn').removeAttr("disabled");
                    $('#editMailCodeBtn').addClass('btn_enabled').removeClass('btn_disabled');
                    clearInterval(interval);
                    times = 60;
                }
                times--;
            }

            $(':text').focus(function() {
                $(this).css("border-color", "#398be1");
            });

            validator = $('#editMailForm').validate({
                rules: {
                    email: {
                        required: true,
                        newEmail: true
                    },
                    emailCode: {
                        required: true,
                        rangelength: [6, 6]
                    }
                },
                messages: {
                    email: {
                        required: "请输入正确的邮箱地址"
                    },
                    emailCode: {
                        required: "请输入邮箱验证码",
                        rangelength: "请输入正确的邮箱验证码"
                    }
                },
                success: function(element) {
                    var id = element[0]['id'];
                    var index = id.indexOf("-error");
                    var success_id = id.substring(0, index);
                    $("#" + success_id).css("border-color", "");
                    if (id == 'email-error') {
                        $(".tipEditMailError").html('');
                        $(".tipEditMail").show();
                        $('#editMailCodeBtn').removeAttr("disabled");
                        $('#editMailCodeBtn').addClass('btn_enabled').removeClass('btn_disabled');
                    } else if (id == 'emailCode-error') {
                        $(".tipEditMailError2").html('');
                    }
                },
                errorPlacement: function(error, element) {
                    var id = element[0]['id'];
                    var error_html = error[0].innerHTML;
                    if ('' != error_html) {
                        if (id == 'email') {
                            $(".tipEditMailError").html(error_html);
                            $(".tipEditMail").hide();
                            $('#editMailCodeBtn').attr("disabled", true);
                            $('#editMailCodeBtn').addClass('btn_disabled').removeClass('btn_enabled');
                        } else if (id == 'emailCode') {
                            $(".tipEditMailError2").html(error_html);
                            $(".tipEditMail2").hide();
                        }
                        $("#" + id).css("border-color", "#ff0045");
                        $('#editMailBtn').removeAttr("disabled");
                    }
                },
            });
            $.validator.addMethod("newEmail", function(value, element) {
                return this.optional(element) || /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value);
            }, "请输入正确的邮箱地址");
        },

    }, {})
})($)
