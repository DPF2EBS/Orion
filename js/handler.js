var DataProvider = {
    config:{
        url:"http://data.dp/windrunner/json/search1",
        db:{
            dw57:'dw57',
            dw59:'dw59'
        },
        sql:{
            fetch:function (url, date) {
                var sql = "select a.*,b.pv from (select module,module_index,sum(clk_cnt) clk_cnt,sum(ratio) ratio from dprpt.rpt_click_map where url = '{0}' and stat_time = '{1}' group by  module,module_index) as a join (select distinct module,module_index,pv from dprpt.rpt_click_map where url = '{0}' and stat_time = '{1}' group by  module,module_index,pv) as b on a.module = b.module and a.module_index = b.module_index"
                return sql.format(url, date);
            }
        }
    },
    action:{
        fetch:function (date, cb) {
            jQuery.ajax({
                url:DataProvider.config.url,
                type:'post',
                dataType:'json',
                data:{
                    dbconfname:DataProvider.config.db.dw57,
                    dbsql:DataProvider.config.sql.fetch(window.location.href.replace(/^http\:\/\//, ''), date)
                },
                success:cb
            });
        },
        panel:function (date, range, trackObj, types, cb) {
            jQuery.ajax({
                url:'',
                type:'post',
                dataType:'json',
                data:{
                    date:date, //昨天的值
                    dateRange:range, //14天
                    trackObj:trackObj,
                    panelType:types
                },
                success:cb
            })
        }
    }
};

var trackAnalyze = {
    regExp:{
        moduleReg:/module#([^,]+),/,
        moduleIndexReg:/index#([^,]+)/,
        actionReg:/action#([^,]+),/,
        contentReg:/content#([^,]+),/
    },
    getTrackObj:function (trackValue) {
        trackValue = trackValue + ',';
        var getValueFromArr = function (valArr) {
            return valArr == null ? null : valArr[1];
        };


        return {
            module:getValueFromArr(trackValue.match(this.regExp.moduleReg)),
            action:getValueFromArr(trackValue.match(this.regExp.actionReg)),
            moduleIndex:getValueFromArr(trackValue.match(this.regExp.moduleIndexReg)),
            content:getValueFromArr(trackValue.match(this.regExp.contentReg))
        };
    }
}

var tagGraph;

var commUI = {
    loadingDom:$('<div class="wr-loading"></div>'),
    showLoading:function (text) {
        this.loadingDom.text(text).appendTo(document.body).show().css({
            'margin-left':-(this.loadingDom.width()) / 2
        }).animate(
            {
                'top':20
            }, 500
        )
    },
    hideLoading:function () {
        this.loadingDom && this.loadingDom.animate({'top':-50}, 500, function () {
            commUI.loadingDom.hide();
        })
    }
}


var handlers = {
    fetch:function (date, selected) {
        tagGraph && tagGraph.destroy();
        commUI.showLoading('正在加载...');
        DataProvider.action.fetch(date, function (res) {
            if (res.code === 200) {

                tagGraph = new TagGraph({
                    dataMatcher:function (el) {
                        var trackValue = el.attr('track');
                        var trackObj = trackAnalyze.getTrackObj(trackValue);
                        for (var i = 0; i < res.msg.length; i++) {
                            var val = res.msg[i];
                            if (val.module == trackObj.module && val.module_index == trackObj.moduleIndex) {
                                el.data('trackObj', {
                                    module:val.module,
                                    index:val.module_index,
                                    action:val.action,
                                    content:val.content,

                                    clickCount:val.clk_cnt,
                                    pv:val.pv,
                                    ratio:val.ratio
                                });
                                return (Math.round(parseFloat(val.ratio) * 10000) / 100);
                            }
                        }
                        return false;
                    }
                });
                tagGraph.display();
                commUI.hideLoading();
                tagGraph.on('click', function () {
                    commUI.showLoading('正在加载...');

                });
            } else {
                commUI.showLoading('出错了...');
            }
        });
    },
    panel:function (date, tag, selected) {
        commUI.showLoading('正在加载..');
        DataProvider.action.panel(date, 14, tag.data('trackObj'), selected, function (res) {
            if (res.code === 200) {

                commUI.hideLoading();
            }
        });
    }
}


//监听pop发过来的消息
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action) {
        switch (request.action) {
            case 'fetch':
                handlers.fetch(request.date, request.selected);
                break;
        }
    }
});

//判断是否需要自动执行
chrome.extension.sendMessage({
    'get_localStorage':['fn_analyze', 'date', 'selected']
}, function (res) {
    if (res[0]==="true" && res[1] && res[2]) {
        handlers.fetch(res[1], res[2]);
    }
});