var support = true;
var NV = {};
var UA = navigator.userAgent.toLowerCase();
try {
	NV.name = !-[1, ] ? 'ie' :
		(UA.indexOf("firefox") > 0) ? 'firefox' :
		(UA.indexOf("chrome") > 0) ? 'chrome' :
		window.opera ? 'opera' :
		window.openDatabase ? 'safari' :
		'unkonw';
} catch (e) {};

var body = document.body || document.documentElement,
	style = body.style,
	vendor = ['webkit', 'khtml', 'moz', 'ms', 'o'],
	i = 0;
while (i < vendor.length) {
	if (typeof style[vendor[i] + 'Transition'] === 'string') {
		NV.vendor = vendor[i];
	}
	i++;
}
if(NV.name=='ie'){
	support = false;
	document.getElementById('tips_0').style.display = 'block';
	document.getElementById('alert_txt_0').innerHTML = '亲，本模板暂不支持IE浏览器';
}