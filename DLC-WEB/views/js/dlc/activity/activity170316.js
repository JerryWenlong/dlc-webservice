(function ($, window) {
    'use strict'
    DLC.Activity170316 = DLC.derive(null, {
        create: function () {
            DLC.Util.initPage();
            window.app.initHeader(1);
            app.product.getPromNew(function (newhandProduct) {
                console.log(newhandProduct);
                $('.ac170316A').attr("href", '/experienceProduct_' + newhandProduct.prodCodeId);
            }, function () {

            })
        }
    }, {});
})($, window);