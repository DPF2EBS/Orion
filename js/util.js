(function (global) {
    global.util = global.util || {};


    global.util.fix = function (number, length) {
        //给数字前面补零
        var raw = "0000000000" + number.toString();
        return raw.substr(raw.length - length)
    }

    global.util.textDate = function (dateString) {
        //今天 昨天 前天
        var today = new Date(),
            yesterday = new Date(new Date().setDate(today.getDate() - 1)),
            theDayBefore = new Date(new Date().setDate(today.getDate() - 2));

        function same(d1, d2) {
            return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
        }

        var d = new Date(dateString);
        if (same(d, today)) {
            return '今天'
        } else if (same(d, yesterday)) {
            return '昨天'
        } else if (same(d, theDayBefore)) {
            return '前天'
        } else {
            return dateString
        }
    }


})(this);