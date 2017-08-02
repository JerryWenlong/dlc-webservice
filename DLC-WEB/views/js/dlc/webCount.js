(function ($, window) {
    'use strict'
    var that = null;
    DLC.WebCount = DLC.derive(null, {
        create: function () {
            that = this;
            this.user = app.currentUser;
            this.account = app.account;
            this.initPage();
            DLC.Util.initPage();
            window.app.initHeader(5);
        },
        initPage: function () {
            app.account.getStats(function (data) {
                that.numFormat(data.investAmount, 'wcDC1D1Text');
                that.numFormat(data.profitAmount, 'wcDC1D4Text');
                that.numFormat(data.returnProfit, 'wcDC1D5Text');
                $(".wcDC2D1Text").html("<span>" + data.registerCount + "</span> 人");
                $(".wcDC2D2Text").html("<span>" + data.investCount + "</span> 人");
                that.numFormat(data.avgInvestPerMan, 'wcDC2D4Text');
                that.numFormat(data.avgInvestPerNum, 'wcDC2D5Text');
                
                //投资单户比例
                var investAmount = data.investAmount; //投资总金额
                var topInvestAmount = data.topInvestAmount; //最大单户投资金额
                var top10InvestAmount = data.top10InvestAmount; //最大10户投资金额
                var data_3_1 = {
                    seriesName: '最大单户投资余额占比',
                    legendData: ['最大单户', '其他'],
                    seriesColor: ['#56dde0', '#39a6ff'],
                    seriesData: [{
                        value: topInvestAmount,
                        name: '最大单户'
                    }, {
                        value: (investAmount - topInvestAmount).toFixed(2),
                        name: '其他'
                    }]
                };
                that.pieChart('wcD3Div1', data_3_1);
                var data_3_2 = {
                    seriesName: '最大10户投资余额占比',
                    legendData: ['最大10户', '其他'],
                    seriesColor: ['#56dde0', '#39a6ff'],
                    seriesData: [{
                        value: top10InvestAmount,
                        name: '最大10户'
                    }, {
                        value: (investAmount - top10InvestAmount).toFixed(2),
                        name: '其他'
                    }]
                };
                that.pieChart('wcD3Div2', data_3_2);
            }, function (errorCode, errorMsg) {

            });


            app.account.getProductsStats(function (data) {
                $(".wcDC1D2Text").html("<span>" + data.totalLoanCount + "</span> 笔");
                that.numFormat(data.dueLoanAmount, 'wcDC1D3Text');
                that.timeFormat(data.avgRaisedTime, 'wcDC2D6Text');
                that.numFormat(data.undueLoanAmount, 'wcDC2D3Text');           
                $(".wcDC5D1Text").html("<span>" + data.totalLoaner + "</span> 人");
                that.numFormat(data.avgAmounPerLoaner, 'wcDC5D2Text');
                that.numFormat(data.undueLoanAmount, 'wcDC5D3Text');
                that.numFormat(data.avgAmounPerLoan, 'wcDC5D4Text');             

                //近一年成交记录
                var monthList = data.monthStatses;
                var timeList = [];
                var amountList = [];
                var maxAmount = 0;
                for (var i = (monthList.length - 1); i >= 0; i--) {
                    var loanAmount = parseInt(parseInt(monthList[i].loanAmount) / 10000);
                    if (loanAmount > maxAmount) {
                        maxAmount = loanAmount;
                    }
                    timeList.push(monthList[i].month);
                    amountList.push(loanAmount);
                }
                var account = 0;
                var lastNum = 0;
                for (var j = maxAmount; j > 1; j = j / 10) {
                    account++;
                    lastNum = parseInt(j);
                }
                lastNum++;
                for (var m = 1; m < account; m++) {
                    lastNum = lastNum * 10;
                }
                var data_4_1 = {
                    legendData: ['成交金额'],
                    xAxisData: timeList,
                    yAxisData: lastNum,
                    seriesData: amountList
                };
                that.barChart('wcD4Div1', data_4_1);

                //融资单户比例
                var totalLoanAmount = data.totalLoanAmount; //投资总金额
                var topLoanAmount = data.topLoanAmount; //最大单户投资金额
                var top10LoanAmount = data.top10LoanAmount; //最大10户投资金额
                var data_6_1 = {
                    seriesName: '最大单户融资金额占比',
                    legendData: ['最大单户', '其他'],
                    seriesColor: ['#9bc93d', '#f4b620'],
                    seriesData: [{
                        value: topLoanAmount,
                        name: '最大单户'
                    }, {
                        value: (totalLoanAmount - topLoanAmount).toFixed(2),
                        name: '其他'
                    }]
                };
                that.pieChart('wcD6Div1', data_6_1);
                var data_6_2 = {
                    seriesName: '最大10户融资金额占比',
                    legendData: ['最大10户', '其他'],
                    seriesColor: ['#9bc93d', '#f4b620'],
                    seriesData: [{
                        value: top10LoanAmount,
                        name: '最大10户'
                    }, {
                        value: (totalLoanAmount - top10LoanAmount).toFixed(2),
                        name: '其他'
                    }]
                };
                that.pieChart('wcD6Div2', data_6_2);

                //逾期总览
                var totalLoanCount = data.totalLoanCount; //总项目数
                var overdueLoanCount = data.overdueLoanCount; //逾期项目数
                var badLoanCount = data.badLoanCount; //坏账数
                var data_7_1 = {
                    seriesName: '项目总数：'+totalLoanCount+'笔',
                    legendData: ['逾期项目数', '未逾期项目数'],
                    seriesColor: ['#f76e68', '#f18a1f'],
                    seriesData: [{
                        value: overdueLoanCount,
                        name: '逾期项目数'
                    }, {
                        value: (totalLoanCount - overdueLoanCount),
                        name: '未逾期项目数'
                    }]
                };
                that.pieChart('wcD7Div1', data_7_1);
                var data_7_2 = {
                    seriesName: '项目总数：'+totalLoanCount+'笔',
                    legendData: ['不良项目数', '优良项目数'],
                    seriesColor: ['#f76e68', '#f18a1f'],
                    seriesData: [{
                        value: badLoanCount,
                        name: '不良项目数'
                    }, {
                        value: (totalLoanCount - badLoanCount),
                        name: '优良项目数'
                    }]
                };
                that.pieChart('wcD7Div2', data_7_2);
            }, function (errorCode, errorMsg) {

            });
        },
        //饼图
        pieChart: function (idName, chartData) {
            var getObj = echarts.init(document.getElementById(idName), 'walden');
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: chartData.legendData //['最大单户', '其他']
                },
                series: [
                    {
                        name: chartData.seriesName, //'最大单户融资约占比'
                        type: 'pie',
                        radius: ['60%', '80%'],
                        color: chartData.seriesColor, //['#4fc1e9','#f85a5d','#f89135'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                        data: chartData.seriesData
                            /*
                             [{value: borrow_max,name: '最大单户'},{value: borrow_other,name: '其他'}]
                            */
                    }
                ]
            };
            getObj.setOption(option);
        },
        //柱状图
        barChart: function (idName, chartData) {
            console.log(chartData);
            //12个月成交额
            var getObj = echarts.init(document.getElementById(idName), 'walden');
            var option = {
                color: ['#39a6ff'],
                title: {
                    subtext: '单位：万元'
                },
                tooltip: {
                    formatter: '成交金额：{c}万元',
                    trigger: 'item',
                    textStyle: {
                        fontSize: 14
                    }
                },
                legend: {
                    data: chartData.legendData //['流贷通', '转贷宝']
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        data: chartData.xAxisData //["2016-04", "2016-05", "2016-06", "2016-07", "2016-08", "2016-09", "2016-10", "2016-11", "2016-12", "2017-01", "2017-02", "2017-03"]
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}万元'
                        },
                        max: chartData.yAxisData //2000
                    }
                ],
                series: [
                    {
                        name: '成交金额（万元）',
                        type: 'bar',
                        data: chartData.seriesData, //[1010, 885, 855, 1210, 735, 850, 800, 680, 765, 1100, 560, 75],
                        markPoint: {
                            data: [
                                {
                                    type: 'max',
                                    name: '最大成交'
                                },
                                {
                                    type: 'min',
                                    name: '最小成交'
                                }
                            ]
                        },
                        barWidth: '30',
                        markLine: {
                            data: [
                                {
                                    type: 'average',
                                    name: '平均值'
                                }
                            ]
                        }
                    }
                ],

            };
            getObj.setOption(option);
        },
        numFormat: function (num, className) {
            var y = 0;
            if (num >= 100000000) {
                y = Math.floor(num / 100000000);
                num = num % 100000000;
            }
            var w = 0;
            if (num >= 10000) {
                w = Math.floor(num / 10000);
                num = parseFloat(num % 10000);
            }
            var html = "";
            if (y > 0) {
                html += "<span>" + y + "</span> 亿 ";
            }
            if (w > 0) {
                html += "<span>" + w + "</span> 万 ";
            }
            html += "<span>" + num.toFixed(2) + "</span> 元 ";
            $("." + className).html(html);
        },
        timeFormat: function (second_time, className) {
            var time = "<span>" + parseInt(second_time) + "</span> 秒";
            if (parseInt(second_time) > 60) {
                var second = parseInt(second_time) % 60;
                var min = parseInt(second_time / 60);
                time = "<span>" + min + "</span> 分 " + "<span>" + second + "</span> 秒";
                if (min > 60) {
                    min = parseInt(second_time / 60) % 60;
                    var hour = parseInt(parseInt(second_time / 60) / 60);
                    time = "<span>" + hour + "</span> 小时 " + "<span>" + min + "</span> 分 " + "<span>" + second + "</span> 秒";
                    if (hour > 24) {
                        hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                        var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                        time = "<span>" + day + "</span> 天 " + "<span>" + hour + "</span> 小时 " + "<span>" + min + "</span> 分 " + "<span>" + second + "</span> 秒";
                    }
                }
            }
            $("." + className).html(time);
        }
    }, {})
})($, window)