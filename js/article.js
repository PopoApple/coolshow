initDetailPage();
loadDetail();
$('#homeBtn').click(function(){
	console.log(11);
	sessionStorage.removeItem('aid');
	var href = '';
	if(testMode){
		href = 'index.html';
	}else{
		href = '/Portal/channel.html';
	}
	console.log(href);
	window.location.href = href;
	console.log(22);
});