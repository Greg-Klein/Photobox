photobox = {
	init : function() {
		photobox.opacity = 0.7;
		photobox.duration = 600;
		photobox.flag == true;
		$("a[rel='photobox']").click(function(){
			photobox.link = $(this).attr("href");
			photobox.title = $(this).attr("title");
			photobox.open(photobox.link);
			return false;
		});
	},

	open : function(link, title) {
		// Timing function to avoid display problems
		if(photobox.flag == false){
			return false;
		}
		setTimeout(function(){
			photobox.flag = true;
		}, 500);
		photobox.flag = false;
		// End Timing function

		if (typeof title == 'undefined') { title = ''; }
		photobox.link = link;
		photobox.title = title;
		$("body").append('<div id="photobox"><div id="photobox__bg"></div><i id="photobox__loader"></i><div id="photobox__container"><i id="photobox__close"></i><div id="photobox__content"></div></div></div>');
		$("#photobox__container").hide();
		$("#photobox__close").hide();
		$("#photobox__bg").hide().fadeTo(photobox.duration, photobox.opacity);
		$("#photobox__loader").hide().fadeIn();

		photobox.img = new Image();
		photobox.img.src = photobox.link;
		photobox.timer = window.setInterval(photobox.load,100);

		$("#photobox__close").click(photobox.close);
		$("#photobox__bg").click(photobox.close);
	},

	load : function() {
		if(photobox.img.complete){
			window.clearInterval(photobox.timer);
			photobox.anim();
		}
	},

	anim : function() {
		$("#photobox__container").show();
		photobox.width = photobox.img.width;
		photobox.height = photobox.img.height;
		photobox.resize();
		$("#photobox__content").append('<img src="'+photobox.link+'"width="'+photobox.width+'" height="'+photobox.height+'">');
		$("#photobox__content img").hide();
		$("#photobox__loader").hide();
		$("#photobox__content").animate({width:photobox.width}, photobox.duration/2).animate({height:photobox.height}, photobox.duration/2, "linear", function(){
		$("#photobox__close").show();
		$("#photobox__content img").fadeIn();
		});
	},

	close : function() {
		$("#photobox").fadeOut(photobox.duration/2, function(){
			$("#photobox").remove();
		});
	},

	resize : function() {
		docW = window.innerWidth;
		docH = window.innerHeight;

		imgW = photobox.img.width;
		imgH = photobox.img.height;
		var ratio = imgW/imgH;
		var newW = docW*0.85;
		var newH = docH*0.85;

		if(imgW > imgH && imgW > newW){
			photobox.width = newW;
			photobox.height = newW/ratio;
		} else if (imgH > imgW && imgH > newH){
			photobox.height = newH;
			photobox.width = newH*ratio;
		}
	}
}