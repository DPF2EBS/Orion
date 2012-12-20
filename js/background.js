var GlobalVar = {
	timeRange: {
		today: 0,
		week: 1,
		month: 2
	},
	viewType: {
		content: 0,
		position: 1
	},
	viewRange: {
		all: 0,
		top50: 1,
		top25: 2,
		top5: 3
	},
	tabID: 0
};



var getTags = function(timeRange, viewType, viewRange, errorCallback) {
	try {
	setTimeout(function() {
			
		chrome.tabs.sendMessage (
				GlobalVar.tabID, { 
					timeRange: timeRange,
					viewType: viewType,
					viewRange: viewRange
				}, function(resp) {
					console.log(GlobalVar.tabID);
				});
		}, 500);
	} catch (e) {
		errorCallback();
	}
};
