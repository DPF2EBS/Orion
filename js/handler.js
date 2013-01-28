var DataProvider = {
    config:{
        url:{
            tag:"http://192.168.26.10:8080/windrunner/json/searchTags",
            detail:'http://192.168.26.10:8080/windrunner/json/viewTagInfo'
        },
        db:{
            dw57:'dw57',
            dw59:'dw59'
        }
    },
    getUrl:function () {
        return  window.location.href.replace(/^http\:\/\//, '');
    },
    action:{
        fetch:function (date, cb) {
            jQuery.ajax({
                url:DataProvider.config.url.tag,
                type:'post',
                dataType:'json',
                database:DataProvider.config.db.dw59,
                data:{
                    url:DataProvider.getUrl(),
                    date:date,
                    dateRange:0
                },
                success:cb
            });
        },
        panel:function (date, range, trackObj, types, cb) {
            jQuery.ajax({
                url:DataProvider.config.url.detail,
                type:'post',
                dataType:'json',
                database:DataProvider.config.db.dw59,
                data:{
                    url:DataProvider.getUrl(),
                    date:date,
                    dateRange:range,
                    module:trackObj.module,
                    moduleIndex:trackObj.moduleIndex,
                    panelType:types.join(',')
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

var tagGraph,
    detailBox,
    chart;

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
                                    moduleIndex:val.module_index,
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
                    handlers.panel(date, $(this), selected);

                });
            } else {
                commUI.showLoading(res.msg);
            }
        });
    },
    panel:function (date, tag, selected) {
        commUI.showLoading('正在加载..');
        chart && chart.destroy();
        detailBox && detailBox.remove();
        DataProvider.action.panel(date, 14, tag.data('related_node').data('trackObj'), selected, function (res) {
            if (res.code === 200) {
                detailBox = detailUI.renderBox(date).appendTo(document.body);
                detailBox.find('.wr-close').click(function () {
                    chart && chart.destroy();
                    detailBox.remove()
                })


                var panelContainer = detailBox.find('.wr-detail-panels'),
                    panel0, panel1, panel2;
                if (panel1 = res.msg.panel1) {
                    var chartContainer = detailUI.renderChart().appendTo(panelContainer);
                    var data = [];
                    for (var key in panel1) {
                        var obj = {};
                        obj.name = key;
                        obj.data = {};
                        data.push(obj);
                        panel1[key].forEach(function (k) {
                            obj.data[k.date] = key === "ratio" ? (Math.round(parseFloat(k.value) * 10000) / 100) : k.value;
                        });
                    }
                    chart = new Venus.SvgChart(chartContainer.get(0), data, {
                        width:560,
                        line:{

                        },
                        axis:{
                            x:{
                                type:'datetime'
                            },
                            y:{},
                            y1:{
                                opposite:true,
                                enable:false

                            },
                            y2:{
                                enable:false,
                                opposite:true
                            }
                        },
                        axisUsage:{
                            0:['x', 'y'],
                            1:['x', 'y1'],
                            2:['x', 'y2']
                        },
                        legend:{},
                        tooltip:function (obj) {
                            return obj.x.split(' ')[0] + "\n" + obj.y
                        }
                    })
                }
                if (panel0 = res.msg.panel0) {
                    detailUI.renderCTR(panel0.ratio, panel0.clk_cnt, panel0.pv).appendTo(panelContainer);
                }
                if (panel2 = res.msg.panel2) {
                    detailUI.renderConsist(panel2).appendTo(panelContainer);
                }

                //定位
                var offset = tag.offset();
                detailBox.css({
                    'left':offset.left,
                    top:offset.top + 25
                })


                commUI.hideLoading();
            } else {
                commUI.showLoading(res.msg);
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
    if (res[0] === "true" && res[1] && res[2]) {
        handlers.fetch(res[1], res[2].split(','));
    }
});

//resize 事件
$(window).resize(function () {
    if (tagGraph) {
        tagGraph.resize();
    }
});