(function($) {
    'use strict'
    DLC.InsuranceCenter = DLC.derive(DLC.DLC, {
        create: function(loadPage) {
            $("#aboutUsRightMain").load(loadPage);
        },
        init: function(showMenu) {
            document.getElementById('mainContent').scrollIntoView();
            $("#aboutUsA").click(function() {
                window.location.href = "/myCenter_insurancePro";
            });
            $("#aboutUsB").click(function() {
                window.location.href = "/myCenter_insuranceMoney";
            });

            switch (showMenu) {
                case "A":
                    $("#aboutUsA").addClass("auCMOLine");
                    break;
                case "B":
                    $("#aboutUsB").addClass("auCMOLine");
                    break;
                default:
                    $("#aboutUsA").addClass("auCMOLine");
                    break;
            }

            DLC.Util.initPage();
            window.scrollTo(0, 0);
        },
    }, {})
})($)
