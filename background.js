var active_video = -1;
var STATE = {
	PLAYING: "Player",
	PAUSED: "Paused",
	STOPPED: "Stopped"
}


var current_state;

stop();

function updateHook(request, sender, sendResponse) {
	active_video = request.tab_id;
	
	if(active_video == -1)
		stop()
	else {
		stop();
		play();
	}
}

function togglePlayer() {
	if (current_state == STATE.PLAYING)
		pause();
	else if(current_state == STATE.PAUSED)
		play();	
}

function play() {
  chrome.browserAction.setIcon({path:"pause.png"});
  current_state = STATE.PLAYING;
  
  chrome.tabs.get(active_video, function(tab){ 
	chrome.browserAction.setTitle({title: tab.title});
  });
  
  chrome.tabs.executeScript(active_video, {code: "p = document.getElementById('movie_player'); p.playVideo()", runAt: "document_start"});
  
}

function pause() {
  chrome.browserAction.setIcon({path:"play.png"});
  current_state = STATE.PAUSED;
  
  chrome.browserAction.setTitle({title: "Paused"});
  
  chrome.tabs.executeScript(active_video, {code: "p = document.getElementById('movie_player'); p.pauseVideo()", runAt: "document_start"});
}

function stop() {
  chrome.browserAction.setIcon({path:"stop.png"});
  current_state = STATE.STOPPED;
  chrome.browserAction.setTitle({title: "Please enable the remote for a Youtube video first."});
}
chrome.runtime.onMessageExternal.addListener(updateHook);
chrome.browserAction.onClicked.addListener(togglePlayer);