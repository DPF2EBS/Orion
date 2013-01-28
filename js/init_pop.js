(function () {
    //初始化日期
    var yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    var domYear = $('#year_select'),
        domMonth = $('#month_select'),
        domDate = $('#date_select');


    domMonth.val(yesterday.getMonth() + 1);
    domDate.val(yesterday.getDate());
    domYear.val(yesterday.getFullYear());

    //功能选择
    $('.J_fn').each(function (i, c) {
        var $c = $(c);
        if (localStorage.getItem($c.attr('id')) === "true") {
            c.checked = true;
        } else {
            c.checked = false;
            $c.parent().addClass('disable');
        }
        $c.click(function () {
            c.checked ? $c.parent().removeClass('disable') : $c.parent().addClass('disable');
            localStorage.setItem($c.attr('id'), c.checked);
        });
    });


    //点击执行分析按钮
    $('#do_action').click(function () {
        var date = domYear.val() + "-" + util.fix(domMonth.val(), 2) + "-" + util.fix(domDate.val(), 2);
        var selected = [0];
        $('.J_fn').each(function (i, c) {
            if (c.checked && c.value) {
                selected.push(c.value);
            }
        });
        localStorage.setItem('date', date);
        localStorage.setItem('selected', selected);
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action:'fetch',
                date:date,
                selected:selected
            }, function () {

            })
        })

    });

})();