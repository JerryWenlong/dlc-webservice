(function($){
'use strict'
DLC.DlcDict = DLC.derive(DLC.DLC, {
    create: function(app){
        this.loadLength = 0;
        this.dictData = {};
        this.initProduct();
        this.initAccount();
        this.initFund();
        this.initFinance();
        var that = this;
        app.dict = that.dictData;
    },
    initProduct: function(){

        this.dictData.prodType=[
            {
                name: "服务产品",
                value: 1
            },
            {
                name: "信托",
                value: 2
            },
            {
                name: "保险",
                value: 3
            },
            {
                name: "银行理财",
                value: 4
            },
            {
                name: "证券理财",
                value: 5
            },
            {
                name: "股权",
                value: 6
            }
        ];
        this.dictData.prodStatus=[
            {
                name: "开放期",
                value: 1
            },
            {
                name: "认购期",
                value: 2
            },
            {
                name: "预约认购期",
                value: 3
            },
            {
                name: "产品成立",
                value: 4
            },
            {
                name: "产品终止",
                value: 5
            },
            {
                name: "停止交易",
                value: 6
            },
            {
                name: "停止申购",
                value: 7
            },
            {
                name: "停止赎回",
                value: 8
            }
        ];
        this.dictData.prodRiskLevel=[
            {
                name: "默认等级",
                value: 0
            },
            {
                name: "保守型",
                value: 1
            },
            {
                name: "稳健型",
                value: 2
            },
            {
                name: "平衡型",
                value: 3
            },
            {
                name: "积极型",
                value: 4
            },
            {
                name: "激进型",
                value: 5
            }
        ];
        this.dictData.prodIncomeType=[
            {
                name: "N/A",
                value: 0
            },
            {
                name: "保本固定收益",
                value: 1
            },
            {
                name: "保本浮动收益",
                value: 2
            },
            {
                name: "非保本浮动收益",
                value: 3
            },
            {
                name: "其他",
                value: 9
            }

        ];
        this.dictData.prodInvestType=[
            {
                name: "N/A",
                value: 0
            },
            {
                name: "固定收益类",
                value: 1
            },
            {
                name: "权益类",
                value: 2
            },
            {
                name: "期货融资融券类",
                value: 3
            },
            {
                name: "复杂高风险类",
                value: 4
            },
            {
                name: "其他",
                value: 5
            }

        ];
        this.dictData.prodDividendType=[
            {
                name: "份额分红",
                value: 0
            },
            {
                name: "现金分红",
                value: 1
            }

        ];
        this.dictData.prodFareType=[
            {
                name: "手续费",
                value: 0
            },
            {
                name: "印花税",
                value: 1
            },
            {
                name: "管理费",
                value: 2
            },
            {
                name: "申购费",
                value: 3
            },
            {
                name: "赎回费用",
                value: 4
            },
            {
                name: "其他费用",
                value: 9
            }

        ];
        //hard code
        this.dictData.prodBusinessTypeList=[
            {
                name: "证券理财认购申请",
                value: 44020
            },
            {
                name: "证券理财申购申请",
                value: 44022
            },
            {
                name: "证券理财赎回申请",
                value: 44024
            },
            {
                name: "证券理财转托管",
                value: 44026
            },
            {
                name: "证券理财转托管入",
                value: 44027
            },
            {
                name: "证券理财转托管出",
                value: 44028
            },
            {
                name: "证券理财分红方式设置",
                value: 44029
            },
            {
                name: "证券理财份额冻结",
                value: 44031
            },
            {
                name: "证券理财份额解冻",
                value: 44032
            },
            {
                name: "证券理财非交易过户",
                value: 44033
            },
            {
                name: "证券理财非交易过户入",
                value: 44034
            },
            {
                name: "证券理财非交易过户出",
                value: 44035
            },
            {
                name: "证券理财转换入",
                value: 44037
            },
            {
                name: "证券理财转换出",
                value: 44038
            },
            {
                name: "证券理财定时定额投资",
                value: 44039
            },
            {
                name: "证券理财交易撤单",
                value: 44053
            },
            {
                name: "证券理财确权",
                value: 44080
            },
            {
                name: "证券理财份额分拆",
                value: 44085
            },
            {
                name: "证券理财份额合并",
                value: 44086
            },
            {
                name: "证券理财快速过户申请",
                value: 44098
            },
            {
                name: "产品预约认购",
                value: 49020
            },
            {
                name: "产品预约申购",
                value: 49021
            },
            {
                name: "产品预约赎回",
                value: 49022
            },
            {
                name: "产品预约转换",
                value: 49023
            },
            {
                name: "产品预约撤单",
                value: 49024
            },
            {
                name: "证券理财赎回申请",
                value: 49024
            },
            {
                name: "产品预约确认",
                value: 49025
            },
            {
                name: "代客户申领额度",
                value: 49026
            }
        ];
        this.dictData.interestTypeList = [
            {name: '一次性还本付息', value: '0'},
            {name: '按年付息', value: '1'},
            {name: '半年付息', value: '2'},
            {name: '按季付息', value: '3'},
            {name: '按月付息', value: '4'},
        ];
        this.dictData.interestTypeList_1 = [
            {name: '到期一次性还本付息', value: '0'},
            {name: '按年付息，到期还本付息', value: '1'},
            {name: '按半年付息，到期还本付息', value: '2'},
            {name: '按季付息，到期还本付息', value: '3'},
            {name: '按月付息，到期还本付息', value: '4'},
        ];
        this.dictData.riskLevelList=[
            {name: '未知等级', value: '0'},
            {name: '保守型', value: '1'},
            {name: '稳健型', value: '2'},
            {name: '平衡型', value: '3'},
            {name: '积极型', value: '4'},
            {name: '激进型', value: '5'},
        ]
    },
    initAccount: function(){
        this.dictData.roleList = [];// default = [], render it when goin to AccountManagementController
        this.dictData.roleStatusList = [
            {name: '已冻结', value:'2'},
            {name: '正常状态', value: '1'},
        ];
        this.dictData.share = [
            {name: '募集中', value:'0'},
            {name: '还款中', value: '1'},
            {name: '已兑付', value: '2'},
            {name: '已售罄', value: '3'},
            {name: '已流标', value: '4'},
        ];
        this.dictData.orderStatus = [
            {name: '未支付', value: 0},
            {name: '募集中', value: 1},
            {name: '已售罄', value: 2},
            {name: '还款中', value: 3},
            {name: '已流标', value: 4},
            {name: '交易失败', value: 5},
            {name: '产品募集中', value: 6},
            {name: '已兑付', value: 7},
            {name: '持有中', value: 8},
            {name: '赎回中', value: 9},
            {name: '已赎回', value: 10},

        ];
        this.dictData.orderStatusV = [
            {name: '未支付', value: 0},
            {name: '已支付', value: 1},
            {name: '支付失败', value: 2},
            {name: '已过期', value: 3},
            {name: '已支付', value: 4},
            {name: '已支付', value: 5},
            {name: '已支付', value: 6},
            {name: '已退款', value: 7},
            {name: '已支付', value: 8},
            {name: '已支付', value: 9},
            {name: '已支付', value: 10},
            {name: '支付中', value: 11}
        ];

        this.dictData.productStatus = [
            {name: '募集中', value:'1'},
            {name: '已售罄', value:'2'},
            {name: '还款中', value:'3'},
            {name: '已流标', value:'4'},
            {name: '已兑付', value:'7'}
        ];
        this.dictData.tradeStatus = [
            {name: '未交易', value:'0'},
            {name: '交易处理中', value:'1'},
            {name: '交易成功', value:'2'},
            {name: '交易失败', value:'3'}
        ];
        this.dictData.payChannel = [
            {name: '线上支付', value: '0'},
            {name: '线下支付', value: '1'},
            {name: '线下转账', value: '2'}
        ]
    },
    initFund: function(){
        this.dictData.auditableList = [
            {name: '可以', value: true},
            {name: '不可以', value: false},
        ];
        this.dictData.errorFlagList = [
            {name: '数据正常', value: 0},
            {name: '数据不平', value: 1},
        ];
        // this.dictData.feeTypeList = [
        //     {name: '前端收费', value: 0},
        //     {name: '后端收费', value: 1},
        //     {name: '混合收费', value: 2}
        // ];
        this.dictData.fundStatusList = [
            {name: '未对账', value: 0},
            {name: '已对账', value: 1},
            {name: '已审批', value: 2},
            {name: '已付款', value: 3},
            {name: '已拒绝', value: -1},
            {name: '已完成', value: -2},
            {name: '未知状态', value: -3},
        ];
        this.dictData.fundInStatusList=[
            {name: '未对账', value: 0},
            {name: '已对内对账', value: 1},
            {name: '已对外对账', value: 2},
            {name: '已收款', value: 3},
            {name: '已拒绝', value: -1},
            {name: '已完成', value: -2},
            {name: '未知状态', value: -3},
        ]
    },
    initFinance: function(){
        this.dictData.financeTradeType = [
            {name: '购买', value: 0},
            {name: '充值', value: 1},
            {name: '提现', value: 2},
            {name: '收益', value: 3},
            {name: '转账', value: 4},
            {name: '本息', value: 5},
            {name: '撤单', value: 6},
            {name: '退款', value: 7},
            {name: '清算', value: 8},
            {name: '回款', value: 9},
            {name: '手续费', value: 10},
            {name: '奖励', value: 15},
			 {name: '红包', value: 16},
        ];
        this.dictData.financeTransType = [
            {name: '支出', value: 0},
            {name: '收入', value: 1},
        ];
        this.dictData.financeTradeStatus = [
            {name: '未处理', value: 0},
            {name: '处理中', value: 1},
            {name: '成功', value: 2},
            {name: '失败', value: 3},
            {name: '已清算', value: 4},
            {name: '已关闭', value: 5},
            {name: '已赎回', value: 6},
            {name: '已回款', value: 7},
        ];
        this.dictData.financeAssetType = [
            {name: '银行卡', value: 0},
            {name: '余额', value: 1},
            {name: '加金券', value: 2},
            {name: '加息券', value: 3},
            {name: '积分', value: 4},
            {name: '资产', value: 5},
            {name: '收益', value: 6},
            {name: '佣金', value: 7},
        ];
        this.TransType = [
            {name:'代收', value:'0'},
            {name:'代付', value:'1'},
        ];
        this.dictData.financeTransStatus = [
            {name: '未交易', value:'0'},
            {name: '交易处理中', value:'1'},
            {name: '交易成功', value:'2'},
            {name: '交易失败', value:'3'},
        ];
        this.dictData.financePayChannel = [
            {name: '线上支付', value:'0'},
            {name: '线下支付', value:'2'},
        ];
    },
    renderResponseList:function(responseList){
        var len = responseList.length;
        var list = [];
        if(len <= 0) return list;
        for(var i=0;i<len;i++){
            var item = responseList[i];
            var obj={};
            obj.name = item.dictPrompt;
            obj.value = item.subentry;
            list.push(obj);
        }
        return list;
    },
    getDictList:function(listNo, success, failed){
        var that = this;
        var searchStr = DLC.Util.stringFormat('list={0}&branchNo=8888',[listNo]);
        var urlStr = '{0}/{1}?' + searchStr;
        this.promise({
            service:'mgtProductService',
            api:'prodDictList',
            type:'get',
            urlStr:urlStr
        }, function(response){
            //success
            if(response['error'] == 0){
                for(var no in response['data']){
                    for(var item in that.requestDict){
                        var dict = that.requestDict[item];
                        if (dict.dictNo == no){
                            var list = response['data'][no];
                            for(var i=0; i<list.length; i++){
                                dict.list.push({
                                    name: list[i].dictPrompt,
                                    value: list[i].subentry,
                                })
                            }
                        }
                    }
                }
                that.dictData.productDict = that.requestDict;
                success();
            }else{
                //error
                failed();
            }
        }, function(){
            // error
            console.log('get dict failed')
        })
    },
}, {})
})($)
