chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.get_localStorage){
        var res = [];
        request.get_localStorage.forEach(function(key){
            res.push(localStorage.getItem(key))
        })
        sendResponse(res);
    }
});