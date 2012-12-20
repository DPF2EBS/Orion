/**
 * 去除首尾的空格
 * @returns
 */
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

/**
 * 类似C#的String.format函数
 * @returns String
 */
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

/**
 * 将形如[1, [2,3],4,[5,[6,7]]]的数组解析为 [1,2,3,4,5,6,7]
 * @returns {Array}
 */
Array.prototype.flatten = function () {
    var array = [];
    for (var i = 0, l = this.length; i < l; i++) {
        var type = $type(this[i]);
        if (!type) continue;
        array = array.concat((type == 'array' || type == 'collection' || type == 'arguments') ? Array.flatten(this[i]) : 

this[i]);
    }
    return array;
};


/**
 * Method: Date.format
 * <br/> Format object Date to the date string
 * 
 * @param format
 * @returns
 */
Date.prototype.format = function (format) //author: meizz 
{
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(),    //day 
        "h+": this.getHours(),   //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter 
        "S": this.getMilliseconds() //millisecond 
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
      RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
