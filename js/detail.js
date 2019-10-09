function loadDetail(){
	showLoading(99);
	bluemp_aid = bluemp_aid?bluemp_aid:sessionStorage.aid;
	new bluemp.block.articleDetail({
	    isDefault: false,
	    fnSuccess: function(data) {
	    	hideLoading(99);
			console.log('article----------------');
			console.log(data);
			if(data){
	            $('#popWin .article_title').html(data.title);
	            $('#popWin .article_time').html(data.posttime);
	            $('#popWin .article_author').html('来源：'+data.author);
	            var pic = data.pic;
	            if(pic){
	            	$('#popWin .article_cover').html('<img src="'+data.pic+'" />').removeClass('none');
	            }
	            var summary = data.summary;
	            if(summary && summary !=''){
	            	$('#popWin .article_summary').html(summary).removeClass('none');
	            }
	            $('#popWin .article_content').html(data.content);
				
				var loadImg = function(img){
					img.addClass('none');
					img.load(function (){
						$(this).removeClass('none');
						//detailSwiper.resizeFix(true);	
					});
				}
				
				var imgs = $('#popWin .article_detail img');
				for(var i=0;i<imgs.length;i++){
					loadImg(imgs.eq(i));
				}
				if(isWeiXin()&&data.reward&&(data.reward.flg == 1||data.reward.flg == '1')){
	            	var html = '';
					html += '<div class="bluemp_block_article_AReward">';
					html += '<div class="bluemp_block_article_ARewardDiv">';
					html += '<div class="bluemp_block_article_ARewardTextDiv">';
					html += '<p class="bluemp_block_article_ARewardIcon">';
					html += '<span class="bluemp_block_article_ARewardIconSpan bluemp_block_article_ARewardIconSpan_BgColor1">赏</span>';
					html += '</p>';
					if(data.reward.thankWord==null){
						data.reward.thankWord = '';
					}
					html += '<p class="bluemp_block_article_ARewardText">'+data.reward.thankWord+'</p>';
					html += '</div>';
					html += '<div class="bluemp_block_article_NumberOfRewards">';
					html += '<ul class="bluemp_block_article_Rewards_ImgList">';
					for(i=0;data.reward.headerUrl.length>0&&i<data.reward.headerUrl.length;i++){
						html += '<li><img src="'+data.reward.headerUrl[i]+'"></li>'
					}
					html += '</ul>';
					html += '<p class="bluemp_block_article_ARewardText2">'+data.reward.people+'人打赏</p>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
					$('.article_detail').after(html);
					$('.bluemp_block_article_ARewardIconSpan').click(function(){
						if (bluemp.loginCheck()) {
						 	window.location.href = 'http://pay.bluemp.cn/wxpay2/jsapi/pay.php?state='+bluemp_aid+'_'+viewer_id
						}
					});
				}
				
			}else{
				showTips(99);
			}
	    }
	});
	
	
	new bluemp.block.options();
	new bluemp.block.replyList();
	if ($(".article_vote_container")) {
	    new bluemp.tool.Vote({
	    	container: $(".article_vote_container")
	    });
	}
}
var detailHeight,detailTime,detailTimer;
var detailSwiper = new Swiper('#popWin .swiper-container', {
	scrollContainer:true,
	mousewheelControl : true,
	mode:'vertical'
});
function initDetailPage(){
	var bgColor = sessionStorage.color;
	if(bgColor){
		$('#popWin').find('.swiper-container,.loading,.tips').css('background-color',bgColor);
	}
	
	detailHeight = $('#popWin .slide-inner').height();
	detailTime = new Date().getTime();
	detailTimer = setInterval(function(){
		var detailHeight2 = $('#popWin .slide-inner').height();
		//console.log('****',detailHeight,detailHeight2);
		var detailTime2 = new Date().getTime();
		if(detailHeight != detailHeight2){
			detailSwiper.resizeFix(true);
		}else{
			if(detailTime2-detailTime>5000){
				clearInterval(detailTimer);
			}
		}
		detailHeight = detailHeight2;
	},100);
}
function closeDetail(){
	clearInterval(detailTimer);
	$('#popWin').find('.article_title,.article_time,.article_author,.article_cover,.article_summary,.article_content,.bluemp_block_article_options,.article_vote_container,.bluemp_block_article_reply_list').empty();
	$('#popWin').find('.article_cover,.article_summary').addClass('none');
	$('#popWin').find('.bluemp_block_article_AReward').remove();
	detailSwiper.resizeFix(true);
	$('#popWin').addClass('none');
	
	sessionStorage.removeItem('aid');
}