(function($) {
    'use strict';
    var that = null;
    DLC.UserInfo = DLC.derive(DLC.DLC, {
        create: function() {
            this.user = app.currentUser;
            this.account = app.account;
            that = this;
        },
        init: function() {
            DLC.Util.initPage();
            window.app.initHeader(4);
            //getUserInfo
            that.user.getUserInfo(function() {
                that.initUserInfo();
            }, function(errorCode, errorMsg) {
                $('#uploadPortraitResult').html(' ' + errorMsg);
            });

            //uploadPortrait
            $('#uploadPortrait').bind('change', function() {
                if ($.support.leadingWhitespace) {
                    var file = $('#uploadPortrait')[0].files[0];
                } else {
                  $('.uploadTip').hide();
                  $('#uploadPortraitResult').html(" 请使用IE10以上,chrome,firefox等高版本浏览器");
                  return;
                }
                if (file) {
                    var index = file.name.lastIndexOf(".") + 1;
                    var document_type = file.name.substring(index);
                    $('.uploadTip').show();
                    $('#uploadPortraitResult').html("");
                    if (!(('jpg' == document_type || 'jpeg' == document_type || 'png' == document_type) && file.size <= 2097152)) {
                        $('.uploadTip').hide();
                        $('#uploadPortraitResult').html(" 图片格式仅限jpg、jpeg、png，单张图片大小不大于2MB");
                        return;
                    }
                    that.user.uploadPortrait(file, function(thumbnailSrc) {
                        that.user.updateUserInfo({
                            avatar: thumbnailSrc
                        }, function() {
                            if ($.support.leadingWhitespace) {
                                $('#uppDiv').hide();
                                $('.file').css("background", "#fff url(" + thumbnailSrc + ") right no-repeat");
                            } else {
                                $('.file').hide();
                                $('#uppDiv').css("background", "#fff url(" + thumbnailSrc + ") right no-repeat");
                            }
                        }, function(errorCode, errorMsg) {
                            $('.uploadTip').hide();
                            $('#uploadPortraitResult').html(' ' + errorMsg);
                        })
                    }, function(errorCode, errorMsg) {
                        $('.uploadTip').hide();
                        $('#uploadPortraitResult').html(' ' + errorMsg);
                    })
                }
            });
            $("#uppDiv").bind('click', function() {
                $("#uploadPortrait").trigger("click");
            });
            //updateUserInfo
            $('#submitBtn').bind('click', function() {
                var param = {
                    marriage: $('#marriage').val(),
                    gender: $('#gender').val(),
                    education: $('#education').val(),
                    profession: $('#profession').val(),
                    province: $('#province').val(),
                    city: $('#city').val(),
                }
                that.user.updateUserInfo(param, function() {
                    $(this).attr("disabled", true);
                    window.location.href = '/myCenter_account';
                }, function() {
                    $('#uploadPortraitResult').html(' ' + errorMsg);
                })
            });


        },

        initUserInfo: function() {
            var that = this;
            if (!this.user.userInfo) return;

            var marriage = this.user.userInfo.marriage;
            $('#marriage').val(marriage);
            $('#marriage_sel').val($(".marSel[tag=" + marriage + "]").html());

            var gender = this.user.userInfo.gender;
            $('#gender').val(gender);
            $('#gender_sel').val($(".genSel[tag=" + gender + "]").html());

            var education = this.user.userInfo.education;
            if (education == "" || education == 0) {
                education = 4;
            }
            $('#education').val(education);
            $('#education_sel').val($(".eduSel[tag=" + education + "]").html());

            var profession = this.user.userInfo.profession;
            if (profession == "" || profession == 0) {
                profession = 4;
            }
            $('#profession').val(profession);
            $('#profession_sel').val($(".profSel[tag=" + profession + "]").html());

            $('#provinceList').html('<div class="inputSelectListOne normal_sel proSel" tag="0">---请选择---</div>');

            var avatar = this.user.userInfo.avatar;
            if (avatar != '') {
                if ($.support.leadingWhitespace) {
                    $('#uppDiv').hide();
                    $('.file').css("background", "#fff url(" + avatar + ") right no-repeat");
                } else {
                    $('.file').css("background", "#fff");
                    $('#uppDiv').css("background", " url(" + avatar + ") right no-repeat");
                }
            }

            this.account.getProvinceCity(function(dataList) {
                $.each(dataList, function(index) {
                    var province = this;
                    $('#provinceList').append('<div class="inputSelectListOne normal_sel proSel" tag="' + province.code + '">' + province.province + '</div>')
                });
                $('.proSel').bind('click', function() {
                  // console.log('3');
                    var selectedProvince = $(this).attr("tag");
                    $("#city").val("0");
                    $("#city_sel").val("---请选择---");
                    $('#cityList').html('<div class="inputSelectListOne normal_sel citySel" tag="0">---请选择---</div>');
                    $.each(dataList, function(index) {
                        var province = this;
                        if (province.code == selectedProvince) {
                            $.each(province.cities, function() {
                                var city = this;
                                $('#cityList').append('<div class="inputSelectListOne normal_sel citySel" tag="' + city.code + '">' + city.city + '</div>')
                            })
                        }
                    });

                    $(".citySel").bind("click", function() {
                        $(this).parent().prev("input").val($(this).attr("tag"));
                        $(this).parent().prev("input").prev("input").val($(this).html());
                        $(this).parent().fadeOut(200);
                    });
                });
                if (that.user.userInfo.province) {
                    $('#province').val(that.user.userInfo.province);
                    $('#province_sel').val($(".proSel[tag=" + that.user.userInfo.province + "]").html());
                    $(".proSel[tag=" + that.user.userInfo.province + "]").trigger('click');
                    $('#city').val(that.user.userInfo.city);
                    $('#city_sel').val($(".citySel[tag=" + that.user.userInfo.city + "]").html());
                }
                that.inintSelect();
            }, function(errorCode, errorMsg) {
                $('#province_result').text(' ' + errorMsg);
            });

        },
        inintSelect: function() {
            $(".inputSelectListOne").bind("mousemove", function() {
                $(this).addClass("bgc");
            });
            $(".inputSelectListOne").bind("mouseout", function() {
                $(this).removeClass("bgc");
            });
            $(".inputSelectListOne").bind("click", function() {
                $(this).parent().prev("input").val($(this).attr("tag"));
                $(this).parent().prev("input").prev("input").val($(this).html());
                $(this).parent().fadeOut(200);
            });

            $('.inputSelInput').bind('click', function() {
                var next_obj = $(this).next().next();
                if (next_obj.css("display") == 'none') {
                    $(".inputSelList").hide();
                    next_obj.fadeIn(200);
                } else {
                    next_obj.fadeOut(200);
                }
            });
        },

    }, {})
})($)
