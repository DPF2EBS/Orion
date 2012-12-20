var GlobalParams = {
		tagEles: [],
		code: {
			falied: 500,
			success: 200
		},
		regExp: {
			httpReg: /^http\:\/\//,
			
			moduleReg: /module#([^,]+),/,
			moduleIndexReg: /index#([^,]+)/,
			actionReg: /action#([^,]+),/,
			contentReg: /content#([^,]+),/
		},
		type: {
			module: 0,
			action: 1,
			moduleIndex: 2,
			content: 3
		},
		dbConfigName: {
			dw57: 'dw57',
			dw59: 'dw59'
		},
		$loadingDiv: null,
		$controller: null,
		detailBoxTemplate: '<div class="wr-detail-box">'
			+ '<div class="wr-header">'
			+ '<label>昨日该位置详情</label>'
			+ '</div>'
			+ '<div class="wr-detail-content">'
			+ '<a class="wr-close">×</a>'
			+ '<span class="arrow-head-top outer"></span>'
			+ '<span class="arrow-head-top inner"></span>'
			+ '<ul class="wr-detail-info">'
			+	'<li>'
			+		'<span class="wr-info-title">CTR</span>'
			+		'<span class="wr-info-content">{0}</span>'
			+	'</li>'
			+	'<li>'
			+		'<span class="wr-info-title">点击数</span>'
			+		'<span class="wr-info-content">{1}</span>'
			+	'</li>'
			+	'<li>'
			+		'<span class="wr-info-title">访问量</span>'
			+		'<span class="wr-info-content">{2}</span>'
			+	'</li>'
			+ '</ul>'
			+ '</div>'
			+ '</div>'
};

var GlobalFuncs = {
	
	getTrackObj: function(trackValue) {
		trackValue = trackValue + ',';
		var getValueFromArr = function(valArr) {
			return valArr == null ? null : valArr[1];
		};

				
		var obj = {
				module: getValueFromArr(trackValue.match(GlobalParams.regExp.moduleReg)),
				action: getValueFromArr(trackValue.match(GlobalParams.regExp.actionReg)),
				moduleIndex: getValueFromArr(trackValue.match(GlobalParams.regExp.moduleIndexReg)),
				content: getValueFromArr(trackValue.match(GlobalParams.regExp.contentReg))
		};
		
		return obj;
	},
	getColor: function(percent) {
		percent = percent * 1400;
		return 'hsl(360, ' + parseInt(percent*4) + '%, 50%)';
	},
	getPercentValue: function(val) {
		
		return (Math.round(parseFloat(val) * 10000)/100) + '%';
	} ,
	loading: function() {
		if(GlobalParams.$loadingDiv == null) {
			var $div = jQuery('<div class="wr-loading"><div>正在分析......</div></div>').appendTo(document.body);
			GlobalParams.$loadingDiv = $div;
		}
		GlobalParams.$loadingDiv.removeClass('wr-hide');
	},
	closeLoading: function() {
		GlobalParams.$loadingDiv.addClass('wr-hide');
	},
	hideDialogBox: function(e) {
		
	}
 };