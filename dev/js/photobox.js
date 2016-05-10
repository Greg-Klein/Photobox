/*!
 *	Photobox by Gregory Klein - http://www.gregoryklein.fr
 *	Licensed under the MIT license
 */
photobox = {
	init : function() {
		photobox.opacity = 0.7;
		photobox.duration = 500;
		photobox.interval = 500;      

        $(document.body).on('click', "#photobox__previous", photobox.previous);
		$(document.body).on('click', "#photobox__next", photobox.next);
		$(document.body).on('click', "#photobox__play", photobox.play);
		$(document.body).on('click', "#photobox__stop", photobox.stop);
		$(document.body).on('click', "#photobox__close", photobox.close);
		$(document.body).on('click', "#photobox__bg", photobox.close);
		$(document.body).on('click', "a[rel='photobox']", function(){
			photobox.album = {title: "", images: []};
        	photobox.allLinks = [];
        	photobox.images = [];
			photobox.link = $(this).attr("href");
			photobox.title = $(this).attr("title");
            if(this.getAttribute("data-photobox")){
                album = this.getAttribute("data-photobox");
                if(photobox.album.title == "") {
                    photobox.album.title = album;
                }
                photobox.allLinks = document.getElementsByTagName('a');

                for(var i=0;i<photobox.allLinks.length;i++) {
                	var el = photobox.allLinks[i];
                    if(el.getAttribute("data-photobox") == photobox.album.title && !(photobox.album.images).includes(el)){
                        (photobox.album.images).push(el.getAttribute('href'));
                    }
                }
                photobox.currentIndex = photobox.album.images.indexOf(photobox.link);
            }
			photobox.open();
			return false;
		});
	},

	open : function() {
		$("#photobox").remove();
		if (typeof photobox.title == 'undefined') { photobox.title = ''; }
		$("body").append('<div id="photobox"><div id="photobox__bg">'+photobox.currentIndex+'<i id="photobox__spinner"></i></div><div id="photobox__container"><i id="photobox__close"></i><div id="photobox__content"></div></div></div>');
		if((photobox.album.images).length > 1){
			$("#photobox__container").append('<div id="photobox__control-panel"><i id="photobox__play"></i><i id="photobox__stop"></i></div>');
		}
		$("#photobox__container").hide();
		$("#photobox__title").hide();
		$("#photobox__close").hide();
		$("#photobox__previous").hide();
		$("#photobox__next").hide();
		$("#photobox__bg").hide().fadeTo(photobox.duration, photobox.opacity);
		$("#photobox__spinner").hide().fadeIn();

		photobox.img = new Image();
		photobox.img.src = photobox.link;
		photobox.timer = window.setInterval(photobox.load,100);
	},

	play: function() {
		$("#photobox__play").hide();
		$("#photobox__stop").show();
		for(var i=0;i<photobox.album.images.length;i++){
			var img = new Image();
			img.src = photobox.album.images[i];
			img.width = photobox.width;
			img.height = photobox.height;
			photobox.images.push(img);
		}
		photobox.playTimer = window.setInterval(function(){
			if(photobox.currentIndex >= (photobox.images.length)){
				photobox.currentIndex = 0;
			}
			var elmt = photobox.images[photobox.currentIndex];
			$("#photobox__content").empty();
			$("#photobox__content").append(elmt);
			photobox.currentIndex++;
		}, photobox.interval);
	},

	stop: function() {
		$("#photobox__stop").hide();
		$("#photobox__play").show();
		photobox.images = [];
		window.clearInterval(photobox.playTimer);
	},

	previous: function() {
		photobox.currentIndex--;
		if(photobox.currentIndex <= -1){
			photobox.currentIndex = photobox.album.images.length - 1;
		}
		var link = photobox.album.images[photobox.currentIndex];
		photobox.img.src = link;
		photobox.link = link;
		photobox.title = photobox.getTitle(photobox.currentIndex);
		photobox.timer = window.setInterval(photobox.load,100);
		return false;
	},

	next: function() {
		photobox.currentIndex++;
		if(photobox.currentIndex >= photobox.album.images.length){
			photobox.currentIndex = 0;
		}
		var link = photobox.album.images[photobox.currentIndex];
		photobox.img.src = link;
		photobox.link = link;
		photobox.title = photobox.getTitle(photobox.currentIndex);
		photobox.timer = window.setInterval(photobox.load,100);
		return false;
	},

	getTitle: function(index) {
		var title = "";
		var link = photobox.album.images[photobox.currentIndex];
		for(var i=0;i<photobox.allLinks.length;i++){
			var el = photobox.allLinks[i];
			if(el.getAttribute('href') == link){
				title = el.getAttribute('title');
			}
		}
		return title;
	},

	load : function() {
		if(photobox.img.complete){
			window.clearInterval(photobox.timer);
			photobox.anim();
		}
	},

	anim : function() {
		$("#photobox__container").show();
		$("#photobox__previous").remove();
		$("#photobox__next").remove();
		photobox.width = photobox.img.width;
		photobox.height = photobox.img.height;
		photobox.resize();
		if((photobox.album.images).length > 1){
			$("#photobox__control-panel").append('<i id="photobox__previous"></i>');
			$("#photobox__control-panel").append('<i id="photobox__next"></i>');
		}
		$("#photobox__content").empty();
		$("#photobox__spinner").hide();
		$("#photobox__content").animate({width:photobox.width}, photobox.duration/2).animate({height:photobox.height}, photobox.duration/2, "linear", function(){
		$("#photobox__title").show();
		$("#photobox__close").show();
		$("#photobox__previous").show();
		$("#photobox__next").show();
		$("#photobox__content").append('<img src="'+photobox.link+'"width="'+photobox.width+'" height="'+photobox.height+'"><span id="photobox__title">'+photobox.title+'</span>');
		console.log("A");
		});
	},

	close : function() {
		$("#photobox").fadeOut(photobox.duration/2, function(){
			$("#photobox").remove();
		});
		window.clearInterval(photobox.playTimer);
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