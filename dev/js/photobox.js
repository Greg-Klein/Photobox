/*!
 *	Photobox by Gregory Klein - http://www.gregoryklein.fr
 *	Licensed under the MIT license
 */
photobox = {
	init : function() {
		photobox.opacity = 0.7;
		photobox.duration = 500;
        
        photobox.album = {title: "", images: []};
		$(document.body).on('click', "a[rel='photobox']", function(){
            if(this.getAttribute("data-photobox")){
                album = this.getAttribute("data-photobox");
                url = this.getAttribute('href');
                if(photobox.album.title == "") {
                    photobox.album.title = album;
                }
                elements = document.getElementsByTagName('a');
                $(elements).each(function() {
                    if(this.getAttribute("data-photobox") == album && !(photobox.album.images).includes(url)){
                        (photobox.album.images).push(url);
                    }
                });
                photobox.currentIndex = (photobox.album.images).indexOf(url);
            }
			photobox.link = $(this).attr("href");
			photobox.title = $(this).attr("title");
			photobox.open(photobox.link, photobox.title);
			return false;
		});
	},

	open : function(link, title) {
		$("#photobox").remove();
		if (typeof title == 'undefined') { title = ''; }
		photobox.link = link;
		photobox.title = title;
		$("body").append('<div id="photobox"><div id="photobox__bg"><i id="photobox__spinner"></i></div><div id="photobox__container"><i id="photobox__close"></i><div id="photobox__content"></div></div></div>');
		$("#photobox__container").hide();
		$("#photobox__close").hide();
		$("#photobox__bg").hide().fadeTo(photobox.duration, photobox.opacity);
		$("#photobox__spinner").hide().fadeIn();

		photobox.img = new Image();
		photobox.img.src = photobox.link;
		photobox.timer = window.setInterval(photobox.load,100);

		$(document.body).on('click', "#photobox__close", photobox.close);
		$(document.body).on('click', "#photobox__bg", photobox.close);
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
		$("#photobox__content").append('<img src="'+photobox.link+'"width="'+photobox.width+'" height="'+photobox.height+'"><p id="photobox__title">'+photobox.title+'</p>');
		$("#photobox__content img").hide();
		//$("#photobox__spinner").hide();
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

		photobox.width = photobox.img.width;
		photobox.height = photobox.img.height;
		var ratio = photobox.width/photobox.height;
		var newW = docW*0.85;
		var newH = docH*0.85 - 60;

		if(photobox.width >= photobox.height) {
			if(photobox.width > newW){
				photobox.width = newW;
				photobox.height = newW / ratio;
			}
			if(photobox.height > newH){
				photobox.height = newH;
				photobox.width = newH * ratio;
			}
		} else {
			if(photobox.height > newH){
				photobox.height = newH;
				photobox.width = newH * ratio;
			}
			if(photobox.width > newW){
				photobox.width = newW;
				photobox.height = newW / ratio;
			}
		}
	}
}