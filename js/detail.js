var detailUI = {
    renderBox:function (date) {
        return $('<div class="wr-detail-box">\
            <div class="wr-header">\
            <label>' + util.textDate(date) + '该位置详情</label>\
            </div>\
        <div class="wr-detail-content">\
            <a class="wr-close">×</a>\
            <span class="arrow-head-top outer"></span>\
            <span class="arrow-head-top inner"></span>\
            <div class="wr-detail-panels">\
            </div>\
        </div>\
        </div>')
    },
    renderCTR:function (ctr, click, pv) {
        return $('<ul class="wr-detail-info">\
                    <li>\
                        <span class="wr-info-title">CTR</span>\
                        <span class="wr-info-content">' + ctr + '</span>\
                    </li>\
                    <li>\
                        <span class="wr-info-title">点击数</span>\
                        <span class="wr-info-content">' + click + '</span>\
                    </li>\
                    <li>\
                        <span class="wr-info-title">访问量</span>\
                        <span class="wr-info-content">' + pv + '</span>\
                    </li>\
                </ul>');
    },
    renderConsist:function (data) {
        var container = $('<div class="wr-detail-consist">\
            <table>\
            <thead>\
                <tr>\
                    <th width="200">去向</th>\
                    <th width="100">点击量</th>\
                    <th width="100">占比</th>\
                </tr>\
            </thead>\
            <tbody>\
        </table>\
        </div>');
        data.forEach(function (d) {
            $('<tr><td><a href="' + d.content + '">'+ d.content+'</a></td><td>' + d.clk_cnt + '</td></tr>').appendTo(container.find('tbody'));
        });
        return container;
    },
    renderChart:function(){
        return $('<div class="wr-detail-chart"></div>');
    }
}