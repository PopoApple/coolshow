var bluemp_cid,bluemp_aid;
testMode = true;
function jsonAjax(type,opts,callback){
	var data = {
//			data:{
//				copyright:'copyright @ coolshow.com',
//				logo:'images/logo4.png',
//				title:'酷秀',
//				bgColor:'rgb(20,40,70)',
//				navColors:['#85af5d','#c53238','#29aae3','#f17225','#8b2767','#ffb606','#f87c68','#06a78b'],
//				navInfos:[
//					{type:'-1',name:''},
//					{type:'0',name:'搜索',url:'http://www.baidu.com'},
//					{type:'1',name:'关于',contentId:'11111',pic: 'imgs/22.jpg'},
//					{type:'2',name:'新闻',contentId:'11',styleType:'1',pic: 'imgs/33.jpg'},
//					{type:'2',name:'产品',contentId:'44',styleType:'2'}
//				]
//			}
	}
	setTimeout(function() {
		callback(data);
	}, 1000);
}
var dataTitle = {
	webname: '酷秀',
	logo: 'imgs/iconfont-shenghuo.png',
	bgpic: 'imgs/bg9.jpg'
};
var dataBanner = {
	carouselpic: [{
		pic: 'imgs/22.jpg',
		title: '',
		url: 'http://baidu.com'
	}, {
		pic: 'imgs/33.jpg',
		title: '',
		url: 'http://baidu.com'
	}, {
		pic: 'imgs/332.png',
		title: '',
		url: 'http://baidu.com'
	}]
};
var dataNav = [{
	id: '1',
	name: '商场',
	url: 'javascript:;',
	pic: 'imgs/22.jpg',
	nav_url: ''
}, {
	id: '2',
	name: '二手',
	url: 'http://145448.bluemp.cn/Home/Portal/articlelist/cid/33354',
	pic: 'imgs/icon3.png',
	nav_url: ''
}, {
	id: '3',
	name: '社区社区社区社区社区社区社区社区',
	url: 'http://145448.bluemp.cn/Home/Portal/articlelist/cid/33355',
	pic: 'imgs/icon8.png',
	nav_url: ''
}, {
	id: '4',
	name: '新闻',
	url: 'http://145448.bluemp.cn/Home/Portal/article/aid/56595',
	pic: 'imgs/icon4.png',
	nav_url: ''
}, {
	id: '5',
	name: '活动订单订单达到活动订单订单达到',
	url: 'www.baidu.com',
	pic: 'imgs/icon6.png',
	nav_url: ''
}, {
	id: '6',
	name: '借记卡',
	url: 'www.baidu.com',
	pic: '',
	nav_url: ''
}, {
	id: '7',
	name: '征婚其实',
	url: 'www.baidu.com',
	pic: 'imgs/icon5.png',
	nav_url: ''
}, {
	id: '8',
	name: '外卖的快捷快递件',
	url: 'www.baidu.com',
	pic: 'imgs/icon1.png',
	nav_url: ''
}];
var dataBottomNav = [{
	name: '首页',
	url: 'www.baidu.com',
	pic: 'imgs/iconfont-tupian.png',
	nav_url: ''
}, {
	name: '我的订单',
	url: 'www.baidu.com',
	pic: 'imgs/iconfont-tupian.png',
	nav_url: ''
}, {
	name: '收藏',
	url: 'www.baidu.com',
	pic: 'imgs/iconfont-tupian.png',
	nav_url: ''
}];
var dataChannel = [{
	id: '11',
	name: '新闻动态'
}, {
	id: '22',
	name: '活动优惠'
}, {
	id: '33',
	name: 'ddd'
}, {
	id: '44',
	name: 'ffff'
}, {
	id: '55',
	name: '多个'
}, {
	id: '66',
	name: '如图表'
}];
var dataArticleList = [{
	id: '11',
	href: 'www.baidu.com',
	pic: 'imgs/44.jpg',
	title: '摄影大赛投票',
	summary: '摄影大赛投票摄影大赛投票摄影大赛投票摄影大赛投票开始了贷款分类看沙漠里的美丽的地方',
	updatetime: '1451380351',
	pv:229
}, {
	id: '11',
	href: 'www.baidu.com',
	pic: 'imgs/11.jpg',
	title: '摄影大赛投票摄影大赛投票摄影大赛投票摄影大赛投票摄影大赛投票摄影大赛投票摄影大赛投票摄影大赛投票',
	updatetime: '1451380351',
	pv:0
}, {
	id: '11',
	href: 'www.baidu.com',
	pic: '',
	title: '摄影大赛投票',
	summary: '',
	updatetime: '1451380351',
	pv:5
}, {
	id: '11',
	href: 'www.baidu.com',
	pic: '',
	title: '摄影大赛投票',
	summary: '',
	updatetime: '1451380351',
	pv:33
}, {
	id: '22',
	href: 'www.baidu.com',
	pic: 'imgs/11.jpg',
	title: '摄影大赛投票',
	summary: '',
	updatetime: '1451380351',
	pv:2
}];
var dataExtendInfo = {
	copyrightinfo: '©2014-2016研究院赶集网'
};
var bluemp = new Object();
var block = new Object();
var tool = new Object();
bluemp.block = block;
bluemp.tool = tool;
bluemp.login = function(){
	sessionStorage.userInfo = JSON.stringify({
		id: '82739',
		name: '小烨子', 
		nick: '小烨子', 
		head: 'http://q.qlogo.cn/qqapp/101139311/23380EC26B96B4FFB4FC1C305627901B/40', 
		gender: '1',
		is_login: 1
	});
	location.reload();
};
bluemp.logout = function(){
	sessionStorage.userInfo = JSON.stringify({
		is_login: 0
	});
	location.reload();
};
block.options = function(opt) {
	
}
block.replyList = function(opt) {
	
}
block.userLogin = function(opt) {
	setTimeout(function() {
		var userInfo = sessionStorage.userInfo;
		opt.fnSuccess(userInfo?JSON.parse(userInfo):{is_login: 0});
	}, 100);
}
tool.Vote = function(opt) {
	
}
block.title = function(opt) {
	setTimeout(function() {
		opt.fnSuccess(dataTitle);
	}, 100);
}
block.banner = function(opt) {
	setTimeout(function() {
		opt.fnSuccess(dataBanner);
	}, 100);
}
block.mainNav = function(opt) {
	setTimeout(function() {
		opt.fnSuccess(dataNav);
	}, 100);
}
block.bottomNav = function(opt) {
	setTimeout(function() {
		opt.fnSuccess(dataBottomNav);
	}, 100);
}
block.channelList = function(opt) {
	setTimeout(function() {
		opt.fnSuccess(dataChannel);
	}, 100);
}
block.articleDetail = function(opt) {
	var dataArticle = {
		id: '11',
		href: 'www.baidu.com',
		pic: 'imgs/bgbig.jpg',
		title: '摄影大赛投票',
		summary: '摄影大赛投票摄影大赛投票摄影大赛投票摄影大赛投票'+bluemp_aid,
		posttime: '2016-01-19',
		author: "大苹果头小宝宝",
		content:'<p><span style="color: rgb(47, 79, 79); font-family: 微软雅黑; word-wrap: break-word; font-size: x-small;"></span></p><p><span style="color: rgb(47, 79, 79); font-family: 微软雅黑; word-wrap: break-word; font-size: x-small;"><img src="http://www.xiaoxiongbizhi.com/wallpapers/1366_768_85/3/z/3z024xb3h.jpg" /><img src="" /><img src="http://www.sanguosha.com/uploads/201509/56065522751ef.jpg" /><img src="http://www.bz55.com/uploads/allimg/130831/1-130S10S203.jpg" /><img src="http://image.bluemp.cn/Img/editor/20160721/579085755bbae.png@580w_1l.png" title="579085755bbae.png" alt="图层 19.png" width="387" height="174" style="width: 387px; height: 174px;"></span><br></p><p><span style="color: rgb(47, 79, 79); font-family: 微软雅黑; word-wrap: break-word; font-size: x-small;"></span></p><section class="wwei-editor"><section style="max-width: 100%;margin: 0.8em 0px 0.5em; overflow: hidden; "><section placeholder="请输入标题" style="box-sizing: border-box !important;  height:36px;display: inline-block;color: #FFF; font-size: 16px;font-weight:bold; padding:0 10px;line-height: 36px;float: left; vertical-align: top; background-color: rgb(249, 110, 87); " class="wweibrush"><span style="font-size: 14px;">婚礼纸杯蛋糕成为了一种流行趋势</span></section><section style="box-sizing: border-box !important; display: inline-block;height:36px; vertical-align: top; border-left-width: 9px; border-left-style: solid; border-left-color: rgb(249, 110, 87); border-top-width: 18px !important; border-top-style: solid !important; border-top-color: transparent !important; border-bottom-width: 18px !important; border-bottom-style: solid !important; border-bottom-color: transparent !important;"></section></section></section><p><span style="font-size: 14px;">在欧美，纸杯蛋糕已经取代了传统意义的多层蛋糕，现身于各种婚礼。婚礼上可人的纸杯蛋糕塔，低碳且个性化的甜蜜选择。五彩缤纷的纸杯蛋糕端坐于婚礼蛋糕架之上，自然而然地成为了整场婚礼的亮点。</span></p><section class="wwei-editor"><section style="max-width: 100%;margin: 0.8em 0px 0.5em; overflow: hidden; "><section placeholder="请输入标题" style="box-sizing: border-box !important;  height:36px;display: inline-block;color: #FFF; font-size: 16px;font-weight:bold; padding:0 10px;line-height: 36px;float: left; vertical-align: top; background-color: rgb(249, 110, 87); " class="wweibrush"><span style="font-size: 14px;">通过纸杯蛋糕，你可以体验甜蜜总导演</span></section><section style="box-sizing: border-box !important; display: inline-block;height:36px; vertical-align: top; border-left-width: 9px; border-left-style: solid; border-left-color: rgb(249, 110, 87); border-top-width: 18px !important; border-top-style: solid !important; border-top-color: transparent !important; border-bottom-width: 18px !important; border-bottom-style: solid !important; border-bottom-color: transparent !important;"></section></section></section><p><span style="font-size: 14px;">与传统婚礼蛋糕相比，婚礼纸杯蛋糕可以做出更多样的口味和造型。你可以天 马行空地设想，把各种故事和话语融汇到每一个小蛋糕里，让我们来执行;你也可以参与到共同制作的快乐之中，留一段甜蜜影像，做一枚最与众不同的蛋糕，献给心爱的TA或者父母，让他们从心到口，开出一朵花。</span></p><section class="wwei-editor"><section style="max-width: 100%;margin: 0.8em 0px 0.5em; overflow: hidden; "><section placeholder="请输入标题" style="box-sizing: border-box !important;  height:36px;display: inline-block;color: #FFF; font-size: 16px;font-weight:bold; padding:0 10px;line-height: 36px;float: left; vertical-align: top; background-color: rgb(249, 110, 87); " class="wweibrush"><span style="font-size: 14px;">纸杯蛋糕帮助你准备出最恰当的分量</span></section><section style="box-sizing: border-box !important; display: inline-block;height:36px; vertical-align: top; border-left-width: 9px; border-left-style: solid; border-left-color: rgb(249, 110, 87); border-top-width: 18px !important; border-top-style: solid !important; border-top-color: transparent !important; border-bottom-width: 18px !important; border-bottom-style: solid !important; border-bottom-color: transparent !important;"></section></section></section><p><span style="font-size: 14px;">如果你喜欢乐活的生活理念和低碳的生活方式，并且希望把每分钱用得实惠，那纸杯蛋糕刚好可以满足你的所有要求。精打细算而又追求生活品质的你可以按照人数来定制纸杯蛋糕的数量和大小，再也不用担心婚礼过后到处是蛋糕的残渣。</span></p><section class="wwei-editor"><section style="max-width: 100%;margin: 0.8em 0px 0.5em; overflow: hidden; "><section placeholder="请输入标题" style="box-sizing: border-box !important;  height:36px;display: inline-block;color: #FFF; font-size: 16px;font-weight:bold; padding:0 10px;line-height: 36px;float: left; vertical-align: top; background-color: rgb(249, 110, 87); " class="wweibrush"><span style="font-size: 14px;">&nbsp;同时满足作为新人的你和你邀请的宾客</span></section><section style="box-sizing: border-box !important; display: inline-block;height:36px; vertical-align: top; border-left-width: 9px; border-left-style: solid; border-left-color: rgb(249, 110, 87); border-top-width: 18px !important; border-top-style: solid !important; border-top-color: transparent !important; border-bottom-width: 18px !important; border-bottom-style: solid !important; border-bottom-color: transparent !important;"></section></section></section><p><span style="font-size: 14px;">通常的婚礼体验，蛋糕只是一个摆设，只是好看，却不好吃，分到盘子里也只能是乱糟糟的一份。有过这种体验的我们，希望能够让你既拥有和TA共同切下蛋糕的美好一刻，有能够让每一个来宾手中能有一只完整美丽且可口的小蛋糕。让每个人再想到你的时候，都是一股甜蜜幸福的回忆。</span></p><p><span style="color: rgb(47, 79, 79); font-family: 微软雅黑; word-wrap: break-word; font-size: x-small;"><img src="http://pro.wwei.cn/Public/wxeditor/css/05.jpg"></span></p><p><br></p><p><span style="color: rgb(47, 79, 79); font-family: 微软雅黑; word-wrap: break-word; font-size: x-small;"></span><br></p>'
		/*content:'<p style="height:500px;text-align:center;margin-top:0px;margin-bottom:0px;padding:0px;outline:0px;border:0px;line-height:1.75em;white-space:normal;color:#333333;font-family:tahoma, arial, 宋体, sans-serif;font-size:14px;">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</p>'*/
	};
	setTimeout(function() {
		opt.fnSuccess(dataArticle);
	}, 1000);
}
block.articleList = function(opt) {
	var arry = [];
	var cnt = 20;
	if(bluemp_cid=='22'){
		cnt = 5;
	}else if(bluemp_cid=='33'){
		cnt = 0;
	}
	for (var i = 0; i < cnt; i++) {
		var rad = Math.round(Math.random()*10);
		var picIdx = rad+''+rad;
		var title = '摄影大赛投票标题标题标题标题标题'.substr(0,rad);
		var article = {
			cid: bluemp_cid,
			id: bluemp_cid+'0'+i,
			href: 'a.html?aid=123',
			pic: 'imgs/'+picIdx+'.jpg',
			title: title+bluemp_cid+'-0-'+i,
			summary: '摄影大赛投票摄影大赛投票摄影大赛投票摄影大赛投票',
			updatetime: '1451380351',
			pv:Math.floor(Math.random()*200),
			author:'popo'
		}
		arry.push(article);
	}
	setTimeout(function() {
		opt.fnSuccess(arry);
	}, 1000);
}
block.articleList.prototype.getNextPage = function(opt,callback){
    var cnt = 20;
    var page = opt.page;
	if(page<0 || page>3){
		cnt = 0;
	}else if(page==3){
		cnt = 5;
	}
	var arry = [];
	for (var i = 0; i < cnt; i++) {
		var article = {
			cid: bluemp_cid,
			id: bluemp_cid+''+opt.page+i,
			href: 'www.baidu.com',
			pic: 'imgs/'+bluemp_cid+'.jpg',
			title: '摄影'+bluemp_cid+'-'+opt.page+'-'+i,
			summary: '摄影大赛投票摄影大赛投票摄影大赛投票摄影大赛投票',
			updatetime: '1451380351',
			pv:Math.floor(Math.random()*200)
		}
		arry.push(article);
	}
	setTimeout(function() {
		callback(arry);
	}, 1000);
}
block.extendInfo = function(opt) {
	setTimeout(function() {
		opt.fnSuccess(dataExtendInfo);
	}, 100);
}
function isWeiXin(){
	return false;
}
