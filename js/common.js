var testMode = false;
var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
    hasTouch = 'ontouchstart' in window && !isTouchPad;
var start_ev = hasTouch?'touchstart':'mousedown',
	end_ev = hasTouch?'touchend':'mouseup';
if(hasTouch){
	document.body.addEventListener('touchmove', function(event) {
		event.preventDefault();
	}, false);
}
function getPos(ev){
	var e = window.event || ev;
	var pos = {x:0,y:0};
	if(hasTouch){
		var t = e.changedTouches[0];
		t = t?t:e.touches[0];
		pos.x = t.pageX;
		pos.y = t.pageY;
	}else{
		pos.x = e.clientX;
		pos.y = e.clientY;
	}
	return pos;
}
function formatDate (strTime) {
    var date = new Date(parseInt(strTime+'000'));
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}
function showLoading(idx){
	$('#loading_'+idx).removeClass('none');
}
function hideLoading(idx){
	$('#loading_'+idx).addClass('none');
}
function showTips(idx,info){
	var wrap = $('#tips_'+idx);
	if(!info){
		info = '暂无内容';
	}
	wrap.find('.alert_txt').html(info);
	wrap.removeClass('none');
}
function hideTips(idx){
	$('#tips_'+idx).addClass('none');
}
