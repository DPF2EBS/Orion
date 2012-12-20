var closeTagMap = function() {
	jQuery('.wr-tag-container:first').addClass('wr-hide');
};

var openCloseMap = function() {
	jQuery('.wr-tag-container:first').addClass('wr-hide');
};

/**
 * 初始化所有被标记的元素
 * 
 */
var initEles = function() {
	var $tagContainer = jQuery('.wr-tag-container:first');
	
	if($tagContainer.length != 0)
		$tagContainer.remove();
	
	var $aTags = $('a[track]');
	var date = new Date();
	date.setDate(date.getDate() - 1);
	
	var dateEnd  = date.format('yyyy-MM-dd');
	
	jQuery.ajax({
		url: 'http://data.dp/windrunner/json/search1',
		type: 'post',
		dataType: 'json',
		data: {
			dbconfname: GlobalParams.dbConfigName.dw57,
			dbsql: sql.getClickedItems.format(window.location.href.replace(GlobalParams.regExp.httpReg, ''), dateEnd)
		},
		success: function(cb) {
			if(cb.code == 200) {

				$aTags.each(function(i, e) {
					var $e = jQuery(e);
					var trackValue = $e.attr('track');
					
					var trackObj = GlobalFuncs.getTrackObj(trackValue);
					for(var i = 0; i < cb.msg.length; i++) {
						var val = cb.msg[i];
						if(val.module == trackObj.module && val.module_index == trackObj.moduleIndex){

							GlobalParams.tagEles.push({
								$element: $e,
								module: val.module,
								moduleIndex: val.module_index,
								action: val.action,
								content: val.content,
									
								clickCount: val.clk_cnt,
								pv: val.pv,
								ratio: val.ratio
							});
							break;
						}	
					}
					
				});
				renderTags();
				return GlobalParams.code.success;
			} else {
				return GlobalParams.code.failed;
			}
		}
	});
};

/**
 * 渲染标签
 * 
 */
var renderTags = function() {
	var $div = jQuery('<div />').addClass('wr-tag-container wr-fade');
	
	jQuery(GlobalParams.tagEles).each(function(i, e) {
		var ctr = GlobalFuncs.getPercentValue(e.ratio);
		var top = e.$element.offset().top;
		var left = e.$element.offset().left;
		
		var $ele = jQuery('<div class="wr-tag-item" />')
			.css({
				'background-color': GlobalFuncs.getColor(e.ratio),
				'top': top + 'px',
				'left': left + 'px'
			})
			.text(ctr);
		//$ele.attr('module', e.)
		
		$ele.attr('title', '点击查看该位置详细数据');
		
		$ele.mouseover(function() {
			e.$element.addClass('wr-tag-hover');
		});
		$ele.mouseout(function() {
			e.$element.removeClass('wr-tag-hover');
		});
		$ele.click(function(event) {
			event.preventDefault();
			
			jQuery('.wr-detail-box:first').remove();
			var $div = jQuery(GlobalParams.detailBoxTemplate.format(ctr, e.clickCount, e.pv));
			
			$div.css({
				'top' : (top + 12) + 'px',
				'left': left + 'px'
			});
			$div.find('.wr-close:first').click(function() {
				$div.remove();
			});
			$div.appendTo(document.body);
		});
		$ele.appendTo($div);
	});
	GlobalFuncs.closeLoading();
	$div.appendTo($(document.body));
	setTimeout(function() {
		$div.addClass('wr-in');
	}, 200);
};

//加载监听器
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	GlobalFuncs.loading();
	initEles();
	
//	sendResponse({
//		code : result
//	});
	
	//return true;
});  
