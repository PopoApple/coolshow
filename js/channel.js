var waterFalls = {};
var pageSwipers = [];
var swiperParent;
var articleQueue = [], articleReqing = false;
var listQueue = [], listReqing = false;
var listMoreQueue = [], listMoreReqing = false;
var LIST_REQ_SIZE = 10;

var sAid = sessionStorage.aid;
var sColor = sessionStorage.color;
var sPageidx = sessionStorage.pageidx;

if(sAid){
	openDetail(sAid,sColor,sPageidx);
}

var winH;
$(function(){
	winH = $(window).height();
});

showLoading(0);
jsonAjax('/Interface/getExtendByWid', {client_id:1000768}, function(data) {
	hideLoading(0);
	console.log('getExtendByWid-----');
	console.log(data.data);
	var dExtend = data.data;
	if(!dExtend){
		dExtend = {};
	}
	if(dExtend.copyright && dExtend.copyright != ''){
		$('#copyright').removeClass('none').html(dExtend.copyright);
	}
	if(dExtend.logo && dExtend.logo != ''){
		$('#logo').removeClass('none');
		$('#logo img').attr('src',dExtend.logo).load(function(){
			adjustTitle();
		});
	}
	if(dExtend.title && dExtend.title != ''){
		$('#title').removeClass('none').html(dExtend.title);
	}
	if(!dExtend.bgColor){
		dExtend.bgColor = 'rgb(20,40,70)';
	}
	if(!dExtend.navColors || dExtend.navColors.length<=0){
		dExtend.navColors = ['#85af5d','#c53238','#29aae3','#f17225','#8b2767','#ffb606','#f87c68','#06a78b'];
	}
	if(!dExtend.navInfos || dExtend.navInfos.length<=0){
		if(!dExtend.title){	//还没有设置过模板
			dExtend.navInfos = [
					{type:'99',name:'小贴士',pic: 'http://app4app.applinzi.com/coolshow/app/images/light5.png'},
					{type:'98',name:'大图列表',pic: 'http://app4app.applinzi.com/coolshow/app/images/thumb.png'},
					{type:'97',name:'小图列表',pic: 'http://app4app.applinzi.com/coolshow/app/images/waterfall.png'},
					{type:'96',name:'图文信息',pic: 'http://app4app.applinzi.com/coolshow/app/images/article.png'}
				];
		}else{
			dExtend.navInfos = [];
			showTips(0);
		}
	}
	buildMain(dExtend);
},'get');
function buildMain(dExtend){
	var bgColor = dExtend.bgColor,
		navColors = dExtend.navColors,
		navInfos = dExtend.navInfos; 
	$('body').css('background-color',bgColor);
	/*var listRoot = $('<div></div>'),
		imgCnt = 0;*/
	var imgCnt = 0;
	var menuList_left = $('#page_0 .list_left');
	var menuList_right = $('#page_0 .list_right');
	var pageIdx = 0,
		pageRoot = $('.swiper-parent > .swiper-wrapper');
	var listTypes = ['1','2'],
		listTypesLen = listTypes.length,
		listIdx = 0;
	var fakeIdx = 0;
	for(var i=0;i<navInfos.length;i++){
		var navInfo = navInfos[i];
		var name = navInfo.name;
		var navType = navInfo.type;
		var colorLen = navColors.length,
			color = navColors[i%colorLen];
		var item = $('<a href="javascript:;" class="waterItem navItem"></a>').attr('data-navtype',navType),
			text = $('<span>'+name+'</span>');
		item.append(text).css('background-color',color);
		var pic = navInfo.pic;
		if(pic && pic!=''){
			imgCnt++;
	    		var img = $('<img src="'+pic+'" />');
	    		item.prepend(img);
	    		loadImg(img,0);
	    	}
		if(i%2==0){
			menuList_left.append(item);
		}else{
			menuList_right.append(item);
		}
		/*if(pic && pic!=''){
			imgCnt++;
    		var img = $('<img src="'+pic+'" class="none" data-pageidx="0" />');
    		item.prepend(img);
    		img.load(function(){
    			waterFallImgDone($(this),1);
    		});
    		img[0].onerror = function(){
    			waterFallImgDone($(this),0);
    		};
    	}
		listRoot.append(item);*/
		
		/*http://145448.bluemp.cn/Home/Portal/articlelist/cid/33354
		  http://145448.bluemp.cn/Home/Portal/article/aid/56595
		 * */
		if(navType=='-1'){
			
		}else if(navType=='0'){
			//item.attr('href',navInfo.url);
			var url = navInfo.url;
			if(url && url!=''){
				item.attr('data-link',navInfo.url);
			}
		}else{
			pageIdx++;
			//item.attr('onclick','swiperParent.swipeTo('+pageIdx+');');
			item.attr('data-link',pageIdx);
			var pageEle = $('<div id="page_'+pageIdx+'" class="swiper-slide sliderbg_menu swiper-slide-visible swiper-slide-active">'+
								'<div class="swiper-container swiper-free-mode">'+
									'<div class="swiper-wrapper">'+
										'<div class="swiper-slide swiper-slide-visible swiper-slide-active">'+
											'<div class="slide-inner">'+
												'<h3>'+name+'</h3>'+
											'</div>'+
										'</div>'+
									'</div>'+
									'<div class="loading none" id="loading_'+pageIdx+'">'+
										'<div class="mui-spinner mui-spinner-white"></div>'+
									'</div>'+
									'<div class="tips none" id="tips_'+pageIdx+'">'+
										'<div class="alert_img"></div>'+
										'<div class="alert_txt">暂无内容</div>'+
									'</div>'+	
								'</div>'+
							'</div>');
			pageEle.css('background-color',color);
			pageRoot.append(pageEle);
			initPageSwiper(pageIdx);
			if(navType=='1'){
				var articleId = navInfo.contentId;
				if(articleId && articleId!=''){
					pageEle.attr({'data-aid':articleId});
					articleQueue.push(pageIdx);
					requestArticle();
				}else{
					showTips(pageIdx);
				}
			}else if(navType=='2'){
				var channelId = navInfo.contentId;
				if(channelId && channelId!=''){
					pageEle.find('.slide-inner')
							.append('<div class="list_root clearfix"></div>')
							.append('<div id="listLoadBtn_'+pageIdx+'" class="list_load_btn none">'+
										'<span class="mui-spinner mui-spinner-white none"></span>'+
										'<span class="load_text">加载更多...</span>'+
									'</div>');
					pageEle.attr({'data-listtype':navInfo.styleType,'data-cid':channelId});
					listQueue.push(pageIdx);
					requestList();
				}else{
					showTips(pageIdx);
				}
			}else if(navType=='99'){
				pageEle.find('.slide-inner').append('<p>亲爱的站长：</p><p>您还没有设置模板呢，当前展示的是本模板三种主要的页面样式，即大图列表、小图列表和图文信息页面。</p><p>您有两种方式可以进入模板编辑界面：1、我的微站 -> 编辑微站，2、我的应用 -> 全部应用 -> 酷秀 -> 编辑</p><p>赶紧行动吧，一个酷站就要诞生咯！<p/>');
				var scrollIdx = pageIdx;
				setTimeout(function(){
					refreshSwiper(scrollIdx);
				},100);
			}else if(navType=='98'){
				pageEle.find('.slide-inner')
						.append('<div class="list_root clearfix"></div>');
				pageEle.attr({'data-listtype':'2'});
				var listData = [];
				for (var k = 0; k < 20; k++) {
					var pic = 'http://app4app.applinzi.com/coolshow/app/images/def_short.jpg';
					if(k%2==0){
						pic = 'http://app4app.applinzi.com/coolshow/app/images/def_long.jpg';
					}
					var article = {
						id:'103763',
						href: 'javascript:;',
						pic: pic,
						title: '标题 '+(k+1),
						summary: '文章摘要文章摘要文章摘要',
						updatetime: '145'+Math.floor(1000000+Math.random()*8000000),
						pv:Math.floor(Math.random()*200),
						author:'popo'
					}
					listData.push(article);
				}
				builtArticleList(2,listData);
			}else if(navType=='97'){
				pageEle.find('.slide-inner')
						.append('<div class="list_root clearfix"></div>');
				pageEle.attr({'data-listtype':'1'});
				var listData = [];
				for (var k = 0; k < 20; k++) {
					var article = {
						id:'103763',
						href: 'javascript:;',
						pic: 'http://app4app.applinzi.com/coolshow/app/images/def.jpg',
						title: '标题 '+(k+1),
						summary: '文章摘要文章摘要文章摘要',
						updatetime: '145'+Math.floor(1000000+Math.random()*8000000),
						pv:Math.floor(Math.random()*200),
						author:'popo'
					}
					listData.push(article);
				}
				builtArticleList(3,listData);
			}else if(navType=='96'){
				var dataArticle = {
					id: '11',
					href: 'www.baidu.com',
					pic: 'http://image.bluemp.cn/Img/editor/20160721/579085755bbae.png@580w_1l.png',
					title: '图文信息页',
					summary: '这是一个图文信息页面......',
					posttime: '2016-09-19',
					author: "酷秀",
					content:'<p><span style="color: rgb(47, 79, 79); font-family: 微软雅黑; word-wrap: break-word; font-size: x-small;"></span></p><p><span style="color: rgb(47, 79, 79); font-family: 微软雅黑; word-wrap: break-word; font-size: x-small;"></span><br></p><p><span style="color: rgb(47, 79, 79); font-family: 微软雅黑; word-wrap: break-word; font-size: x-small;"></span></p><section class="wwei-editor"><section style="max-width: 100%;margin: 0.8em 0px 0.5em; overflow: hidden; "><section placeholder="请输入标题" style="box-sizing: border-box !important;  height:36px;display: inline-block;color: #FFF; font-size: 16px;font-weight:bold; padding:0 10px;line-height: 36px;float: left; vertical-align: top; background-color: rgb(249, 110, 87); " class="wweibrush"><span style="font-size: 14px;">婚礼纸杯蛋糕成为了一种流行趋势</span></section><section style="box-sizing: border-box !important; display: inline-block;height:36px; vertical-align: top; border-left-width: 9px; border-left-style: solid; border-left-color: rgb(249, 110, 87); border-top-width: 18px !important; border-top-style: solid !important; border-top-color: transparent !important; border-bottom-width: 18px !important; border-bottom-style: solid !important; border-bottom-color: transparent !important;"></section></section></section><p><span style="font-size: 14px;">在欧美，纸杯蛋糕已经取代了传统意义的多层蛋糕，现身于各种婚礼。婚礼上可人的纸杯蛋糕塔，低碳且个性化的甜蜜选择。五彩缤纷的纸杯蛋糕端坐于婚礼蛋糕架之上，自然而然地成为了整场婚礼的亮点。</span></p><section class="wwei-editor"><section style="max-width: 100%;margin: 0.8em 0px 0.5em; overflow: hidden; "><section placeholder="请输入标题" style="box-sizing: border-box !important;  height:36px;display: inline-block;color: #FFF; font-size: 16px;font-weight:bold; padding:0 10px;line-height: 36px;float: left; vertical-align: top; background-color: rgb(249, 110, 87); " class="wweibrush"><span style="font-size: 14px;">通过纸杯蛋糕，你可以体验甜蜜总导演</span></section><section style="box-sizing: border-box !important; display: inline-block;height:36px; vertical-align: top; border-left-width: 9px; border-left-style: solid; border-left-color: rgb(249, 110, 87); border-top-width: 18px !important; border-top-style: solid !important; border-top-color: transparent !important; border-bottom-width: 18px !important; border-bottom-style: solid !important; border-bottom-color: transparent !important;"></section></section></section><p><span style="font-size: 14px;">与传统婚礼蛋糕相比，婚礼纸杯蛋糕可以做出更多样的口味和造型。你可以天 马行空地设想，把各种故事和话语融汇到每一个小蛋糕里，让我们来执行;你也可以参与到共同制作的快乐之中，留一段甜蜜影像，做一枚最与众不同的蛋糕，献给心爱的TA或者父母，让他们从心到口，开出一朵花。</span></p><section class="wwei-editor"><section style="max-width: 100%;margin: 0.8em 0px 0.5em; overflow: hidden; "><section placeholder="请输入标题" style="box-sizing: border-box !important;  height:36px;display: inline-block;color: #FFF; font-size: 16px;font-weight:bold; padding:0 10px;line-height: 36px;float: left; vertical-align: top; background-color: rgb(249, 110, 87); " class="wweibrush"><span style="font-size: 14px;">纸杯蛋糕帮助你准备出最恰当的分量</span></section><section style="box-sizing: border-box !important; display: inline-block;height:36px; vertical-align: top; border-left-width: 9px; border-left-style: solid; border-left-color: rgb(249, 110, 87); border-top-width: 18px !important; border-top-style: solid !important; border-top-color: transparent !important; border-bottom-width: 18px !important; border-bottom-style: solid !important; border-bottom-color: transparent !important;"></section></section></section><p><span style="font-size: 14px;">如果你喜欢乐活的生活理念和低碳的生活方式，并且希望把每分钱用得实惠，那纸杯蛋糕刚好可以满足你的所有要求。精打细算而又追求生活品质的你可以按照人数来定制纸杯蛋糕的数量和大小，再也不用担心婚礼过后到处是蛋糕的残渣。</span></p><section class="wwei-editor"><section style="max-width: 100%;margin: 0.8em 0px 0.5em; overflow: hidden; "><section placeholder="请输入标题" style="box-sizing: border-box !important;  height:36px;display: inline-block;color: #FFF; font-size: 16px;font-weight:bold; padding:0 10px;line-height: 36px;float: left; vertical-align: top; background-color: rgb(249, 110, 87); " class="wweibrush"><span style="font-size: 14px;">&nbsp;同时满足作为新人的你和你邀请的宾客</span></section><section style="box-sizing: border-box !important; display: inline-block;height:36px; vertical-align: top; border-left-width: 9px; border-left-style: solid; border-left-color: rgb(249, 110, 87); border-top-width: 18px !important; border-top-style: solid !important; border-top-color: transparent !important; border-bottom-width: 18px !important; border-bottom-style: solid !important; border-bottom-color: transparent !important;"></section></section></section><p><span style="font-size: 14px;">通常的婚礼体验，蛋糕只是一个摆设，只是好看，却不好吃，分到盘子里也只能是乱糟糟的一份。有过这种体验的我们，希望能够让你既拥有和TA共同切下蛋糕的美好一刻，有能够让每一个来宾手中能有一只完整美丽且可口的小蛋糕。让每个人再想到你的时候，都是一股甜蜜幸福的回忆。</span></p><p><span style="color: rgb(47, 79, 79); font-family: 微软雅黑; word-wrap: break-word; font-size: x-small;"><img src="http://pro.wwei.cn/Public/wxeditor/css/05.jpg"></span></p><p><br></p><p><span style="color: rgb(47, 79, 79); font-family: 微软雅黑; word-wrap: break-word; font-size: x-small;"></span><br></p>'
				};
				builtArticle(pageIdx,dataArticle);
				/*pageEle.find('.slide-inner').append('这是一篇文章');
				refreshSwiper(pageIdx);*/
			}
		}
	}
	if(pageIdx>0){
		$('.pagination').removeClass('none');
	}
	swiperParent = new Swiper('.swiper-parent',{
		pagination: '.pagination',
		paginationClickable: true,
		onSlideChangeEnd : function() {
		  if (swiperParent.activeIndex != 0){
		  	$('header').animate({'top':'0px'},400);
		  }
		  if (swiperParent.activeIndex == 0){
		  	$('header').animate({'top':'-100px'},400);
		  }  
		}
	});
	/*waterFalls[0] = {imgCnt:imgCnt,listRoot:listRoot};
	if(imgCnt<=0){
		buildWaterFallList(0);
	}*/
	if(imgCnt==0){
		refreshSwiper(0);
	}
	if(sAid){
		swiperParent.swipeTo(parseInt(sPageidx));
	}
}
function openDetail(aid,bgColor,pageIdx){
	console.log('aid,bgColor,pageIdx-------------------------');
	console.log(aid,bgColor,pageIdx);
	
	sessionStorage.aid = aid;
	sessionStorage.color = bgColor;
	sessionStorage.pageidx = pageIdx;
	bluemp_aid = aid;
	$('#popWin').removeClass('none');
	fadeEffect();
	initDetailPage();
	loadDetail();
}
function getLoadBtnStatu(pageIdx){
	var btn = $('#listLoadBtn_'+pageIdx);
	if(btn.is('.none')){
		return 0;
	}else if(btn.find('.mui-spinner').is('.none')){
		return 1;
	}else{
		return 2;
	}
}
function setLoadBtnStatu(pageIdx,statu){	// 0、隐藏   1、加载更多...  2、加载中...  
	var btn = $('#listLoadBtn_'+pageIdx);
	if(statu==0){
		btn.addClass('none');
	}else{
		btn.removeClass('none');
		var spiner = btn.find('.mui-spinner');
		var txt = btn.find('.load_text');
		if(statu==1){
			spiner.addClass('none');
			txt.html('加载更多...');
		}else{
			spiner.removeClass('none');
			txt.html('加载中...');
		}
	}
}
function loadImg(img,pageIdx,parNone){
	if(parNone){
		img.parent().addClass('none');
	}else{
		img.addClass('none');
	}
	img.attr('data-pageidx',pageIdx);
	img.load(function (){
		if(parNone){
			$(this).parent().removeClass('none');
		}else{
			$(this).removeClass('none');
		}
		refreshSwiper($(this).attr('data-pageidx'));
	});
}
function loadWaterImg(img,pageIdx){
	img.addClass('none');
	img.attr('data-pageidx',pageIdx);
	img.load(function (){
		waterFallImgDone($(this),1);
	});
	img[0].onerror = function(){
		waterFallImgDone($(this),0);
	};
}
function requestArticle(){
	if(articleReqing){
		return;
	}
	if(articleQueue.length<=0){
		renturn;
	}
	articleReqing = articleQueue.pop();
	bluemp_aid = $('#page_'+articleReqing).attr('data-aid');
	new bluemp.block.articleDetail({
        isDefault: false,
        fnSuccess: function(data) {
			console.log('article----------------');
			console.log(data);
			if(data){
				builtArticle(articleReqing,data);
			}else{
				showTips(articleReqing);
			}
			articleReqing = false;
			if(articleQueue.length>0){
				requestArticle();
			}
        }
    });
}
function builtArticle(pageIdx,data){
	var pageContainer = $('#page_'+pageIdx+' .slide-inner');
    var picData = data.pic;
    if(picData){
    	var pic = $('<div class="image_single"></div>');
    	var img = $('<img src="'+picData+'" >');
    	pic.append(img);
		pageContainer.append(pic);
		loadImg(img,pageIdx,true);
    }
    var summaryData = data.summary;
    if(summaryData && summaryData !=''){
    	var summary = $('<div class="article_summary">'+summaryData+'</div>');
		pageContainer.append(summary);
    }
    var content = $('<div class="article_content">'+data.content+'</div>');
    var imgs = content.find('img');
    for(var j=0;j<imgs.length;j++){
    	loadImg(imgs.eq(j),pageIdx);
    }
	pageContainer.append(content);
	var scrollIdx = pageIdx;
	setTimeout(function(){
		refreshSwiper(scrollIdx);
	},100);
}
function requestList(){
	if(listReqing){
		return;
	}
	if(listQueue.length<=0){
		return;
	}
	listReqing = listQueue.pop();
	bluemp_cid = $('#page_'+listReqing).attr('data-cid');
	showLoading(listReqing);
	var articleList = new bluemp.block.articleList({
        isDefault: false,
        fnSuccess: function(data) {
			hideLoading(listReqing);
			console.log('articleList----------------');
			console.log(data);
			if(data && data.length>0){
				articleLists[listReqing] = {'obj':articleList,'currPage':0};
				builtArticleList(listReqing,data,false);
			}else{
				showTips(listReqing);
			}
			listReqing = false;
			if(listQueue.length>0){
				requestList();
			}
        }
    });
}
var articleLists = {};
function requestListMore(){
	if(listMoreReqing){
		return;
	}
	if(listMoreQueue.length<=0){
		return;
	}
	listMoreReqing = listMoreQueue.pop();
	setLoadBtnStatu(listMoreReqing,2);
	var cid = $('#page_'+listMoreReqing).attr('data-cid');
	bluemp_cid = cid;
	var al = articleLists[listMoreReqing];
	al.obj.getNextPage({cid:cid,page:++al.currPage},function(data){
									if(data && data.length>0){
										builtArticleList(listMoreReqing,data,true);
									}else{
										setLoadBtnStatu(listMoreReqing,0);
									}
									listMoreReqing = false;
									if(listMoreQueue.length>0){
										requestListMore();
									}
								});
}
function fadeEffect(){
	$('.fade').removeClass('none');
	setTimeout(function(){
		$('.fade').addClass('transparent');
		setTimeout(function(){
			$('.fade').removeClass('transparent').addClass('none');
		},1010);
	},1);
}

function builtArticleList(pageIdx,data,isAppend){
	
	var getRow_1 = function(dataI){
		/*
		 <div class="portfolio_item radius8">
			<div class="portfolio_image">
				<a rel="gallery-1" href="images/portfolio_thumb.jpg" class="swipebox" title="Webdesign work"><img src="images/portfolio_thumb.jpg" alt="" title="" border="0"></a>
			</div>
			<div class="portfolio_details">
				<h4>网站设计</h4>
				<p>各类企业网站、电商网站、微官网、微网站的设计...</p>
	
			</div>
		</div>
		 * */
		var row = $('<a class="listItem listItem1"></a>');
		//row.attr('href',dataI.href);
		row.attr('id',dataI.id);
		var rowThumb = $('<div class="listItem1_image none"></div>');
		var rowText = $('<div class="listItem1_text"></div>');
		row.append(rowThumb);
		row.append(rowText);
		var title = $('<h4>'+dataI.title+'</h4>');
		rowText.append(title);
		var summaryData = dataI.summary;
		if(summaryData && summaryData.length>0){
			rowText.append('<p>'+summaryData+' </p>');
		}
		var info = $('<div class="info2"></div>');
		var time = $('<div class="time2">'+formatDate(dataI.updatetime)+'</div>');
		var pv = $('<div class="pv2">'+(dataI.pv?dataI.pv:0)+'</div>');
		info.append(time).append(pv);
		rowText.append(info);
		var imgData = dataI.pic;
		if(imgData){
			var img = $('<img src="'+imgData+'" />');
			rowThumb.append(img);
			loadImg(img,pageIdx,true);
		}
		return row;
	}
	var getRow_2 = function(dataI){
		/*
		 <div class="portfolio_item radius8">
			<div class="portfolio_image">
				<a rel="gallery-1" href="images/portfolio_thumb.jpg" class="swipebox" title="Webdesign work"><img src="images/portfolio_thumb.jpg" alt="" title="" border="0"></a>
			</div>
			<div class="portfolio_details">
				<h4>网站设计</h4>
				<p>各类企业网站、电商网站、微官网、微网站的设计...</p>
	
			</div>
		</div>
		 * */
		var row = $('<a class="waterItem listItem listItem2 none"></a>');
		/*row.attr('href',dataI.href);*/
		row.attr('id',dataI.id);
		var rowThumb = $('<div class="listItem2_image"></div>');
		var rowText = $('<div class="listItem2_text"></div>');
		row.append(rowThumb);
		row.append(rowText);
		var title = $('<h4>'+dataI.title+'</h4>');
		rowText.append(title);
		
		var imgData = dataI.pic;
		if(imgData){
			waterFalls[pageIdx].imgCnt++;
			var img = $('<img src="'+imgData+'" class="none" data-pageidx="'+pageIdx+'" />');
			rowThumb.append(img);
			loadWaterImg(img,pageIdx);
		}
		return row;
	}

	var pageRoot = $('#page_'+pageIdx);
	var listType = pageRoot.attr('data-listtype');
	var pageContainer = pageRoot.find('.list_root');
	var listRoot;
	if(listType=='2'){
		if(!isAppend){
			var listLeft = $('<div class="list_left"></div>');
			var listRight = $('<div class="list_right"></div>');
			pageContainer.append(listLeft).append(listRight);
		}
		listRoot = $('<div></div>');
		waterFalls[pageIdx] = {imgCnt:0,listRoot:listRoot};
	}else{
		listRoot = pageContainer;
	}
	for(var i=0;i<data.length;i++){
		var dataI = data[i];
		var row = eval('getRow_'+listType+'(dataI)');
		listRoot.append(row);
	}
	if(listType=='1'){
		if(data.length >= LIST_REQ_SIZE){
			setLoadBtnStatu(pageIdx,1);
		}else{
			setLoadBtnStatu(pageIdx,0);
		}
	}
	if(listType=='2' && waterFalls[pageIdx].imgCnt<=0){
		buildWaterFallList(pageIdx);
	}
	refreshSwiper(pageIdx);
	
}
function waterFallImgDone(img,statu){
	if(statu===1){
		img.removeClass('none');
	}
	var pageIdx = img.attr('data-pageidx'),
		wf = waterFalls[pageIdx];
	wf.imgCnt--;
	if(wf.imgCnt == 0){
		buildWaterFallList(pageIdx);
	}
}
function buildWaterFallList(pageIdx){
	var wf = waterFalls[pageIdx],
		items = wf.listRoot.find('.waterItem');
	var pageRoot = $('#page_'+pageIdx);
	var listLeft = pageRoot.find('.list_left');
	var listRight = pageRoot.find('.list_right');
	for(var i=0;i<items.length;i++){
		var root;
		if(listLeft.height()<=listRight.height()){
			root = listLeft;
		}else{
			root = listRight;
		}
		root.append(items[i]);
	}
	if(items.length >= LIST_REQ_SIZE){
		setLoadBtnStatu(pageIdx,1);
	}else{
		setLoadBtnStatu(pageIdx,0);
	}
	//wf.listRoot = null;
	refreshSwiper(pageIdx);
}
function refreshSwiper(pageIdx){
	var inner = $('#page_'+pageIdx+' .slide-inner');
	var innerH = inner[0].offsetHeight;
	var swp = pageSwipers[pageIdx];
	console.log(winH , innerH);
	if(winH < innerH){
		if(swp){
			swp.resizeFix(true);
		}else{
			pageSwipers[pageIdx] = new Swiper('#page_'+pageIdx+' .swiper-container', {
				scrollContainer:true,
				mousewheelControl : true,
				mode:'vertical'
			});
		}
	}else{
		if(swp){
			$('#page_'+pageIdx+' .swiper-wrapper').css('transform','translate3d(0px, 0px, 0px)');
			swp.destroy();
			pageSwipers[pageIdx] = null;
		}
	}
}
function initPageSwiper(pageIdx){
	
}
initPageSwiper(0);
$('.gohome').click(function(){
	swiperParent.swipeTo(0);
});
function adjustTitle(){
	if($('#logo').is('none')){
		return;
	}
	var logoW = $('#logo').width();
	var headerW = $('#titleBox').width();
	var titleW = headerW-logoW-8;
	if(titleW>40){
		$('#title').css('width',titleW).removeClass('none');
	}else{
		$('#title').addClass('none');
	}
}
$(window).resize(function() {
	adjustTitle();
	
	winH = $(window).height();
	var pages = $('[id^=page_]');
	pages.each(function(){
		var id = this.id;
		refreshSwiper(id.replace('page_',''));
	});
});

var touchX1,touchY1,touchTime;
console.log(start_ev,end_ev);
$(document).on(start_ev,'.listItem,.list_load_btn,.navItem',function(e){
	var pos = getPos(e);
	touchX1 = pos.x;
	touchY1 = pos.y;
	touchTime = new Date().getTime();
}).on(end_ev,'.listItem,.list_load_btn,.navItem',function(e){
	var pos = getPos(e);
	var x = pos.x;
	var y = pos.y;
	var time = new Date().getTime();
	if(Math.abs(x-touchX1)>5 || Math.abs(y-touchY1)>5 || time-touchTime>500){
		return;
	}
	var isListItem = $(this).is('.listItem');
	var isListLoadBtn = $(this).is('.list_load_btn');
	var isNavItem = $(this).is('.navItem');
	if(isListItem){
		var aid = $(this).attr('id');
		var currPage = $('[id^=page_].swiper-slide.swiper-slide-active');
		var currColor = currPage.css('background-color');
		var pageIdx = currPage.attr('id').replace('page_','');
		
		openDetail(aid,currColor,pageIdx);
		
	}else if(isListLoadBtn){
		var pageIdx = $(this).attr('id').replace('listLoadBtn_','');
		if(getLoadBtnStatu(pageIdx)==1){
			listMoreQueue.push(pageIdx);
			requestListMore();
		}
	}else if(isNavItem){
		var navType = $(this).attr('data-navtype');
		var link = $(this).attr('data-link');
		if(navType=='0'){
			if(link){
				window.location.href = link;
			}
		}else if(navType=='1' || navType=='2' || navType=='99' || navType=='98' || navType=='97' || navType=='96'){
			setTimeout(function(){
				swiperParent.swipeTo(parseInt(link));
			},10);
		}
	}
});













