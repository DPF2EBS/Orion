//chrome.tabs.executeScript(null, {
//		code: "initEles();"
//	});
//chrome.browserAction.onClicked.addListener(function(tab) {
//	console.log("Hello from popup"); // This does not show up either
//});

console.log("Hello from popup");
var bg = chrome.extension.getBackgroundPage(); 
var globalVar = bg.GlobalVar;

chrome.tabs.getSelected(null, function(tab) {
	console.log(tab);
	globalVar.tabID = tab.id;
});


bg.getTags(globalVar.timeRange.today, globalVar.viewType.content, globalVar.viewRange.all, function() {
	var div = document.getElementsByTagName('div')[0];
	div.className = "error";
});
setTimeout(function() {
	window.close();
}, 3000);