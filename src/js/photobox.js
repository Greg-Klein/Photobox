/*!
 *	Photobox by Gregory Klein - http://www.gregoryklein.fr
 *	Licensed under the MIT license
 */
photobox = {
	/* Initialisation */
	init : function(args) {
		var arguments = {};
		if(args){
			arguments = args;
		}
		
		/* Parameters definition */
		photobox.opacity = arguments.opacity || 0.7;
		photobox.duration = arguments.duration || 500;
		photobox.interval = arguments.interval || 500;
		photobox.wrapAround = arguments.wrapAround || false;
		photobox.player = arguments.player || false;

		/* Click Listeners */
        $(document.body).on('click', "#photobox__previous", photobox.previous);
		$(document.body).on('click', "#photobox__next", photobox.next);
		$(document.body).on('click', "#photobox__play", photobox.play);
		$(document.body).on('click', "#photobox__stop", photobox.stop);
		$(document.body).on('click', "#photobox__close", photobox.close);
		$(document.body).on('click', "#photobox__bg", photobox.close);
		$(document.body).on('click', "a[rel='photobox']", function(){

			/* Initialize properties */
			photobox.album = {title: "", images: []};
        	photobox.allLinks = [];
        	photobox.images = [];
			photobox.link = $(this).attr("href");
			photobox.title = $(this).attr("title");

			/* If an album is defined */
            if(this.getAttribute("data-photobox")){
                album = this.getAttribute("data-photobox");

                /* Get the title */
                if(photobox.album.title == "") {
                    photobox.album.title = album;
                }

                /* Get all document links and test if they belong to the same album */
                photobox.allLinks = document.getElementsByTagName('a');
                var albumImages = photobox.album.images;
                for(var i=0;i<photobox.allLinks.length;i++) {
                	var el = photobox.allLinks[i],
                		elAlbum = el.getAttribute("data-photobox"),
                		currentAlbum = photobox.album.title;
                    if((elAlbum == currentAlbum) && !$.inArray(el, albumImages)){
                        albumImages.push(el.getAttribute('href'));
                    }
                }
                photobox.currentIndex = albumImages.indexOf(photobox.link);
                photobox.album.images = albumImages;
            }

            /* Open the image */
			photobox.open();

			/* Return false to cancel the default action */
			return false;
		});
	},

	/* Image opening */
	open : function() {

		/* Remove previous instance and get title */
		$("#photobox").remove();
		if (typeof photobox.title == 'undefined') { photobox.title = ''; }

		/* Append Photobox to the document */
		$("body").append('<div id="photobox"><div id="photobox__bg">'+photobox.currentIndex+'<i id="photobox__spinner"></i></div><div id="photobox__container"><i id="photobox__close"></i><div id="photobox__content"></div><div id="photobox__control-panel"></div></div></div>');

		$("#photobox__container").hide();
		$("#photobox__title").hide();
		$("#photobox__close").hide();
		$("#photobox__previous").hide();
		$("#photobox__next").hide();
		$("#photobox__bg").hide().fadeTo(photobox.duration, photobox.opacity);
		$("#photobox__spinner").hide().fadeIn();

		/* Preload the image */
		photobox.img = new Image();
		photobox.img.src = photobox.link;
		photobox.timer = window.setInterval(photobox.load,100);
	},

	/* Images sequence playing */
	play: function() {

		$("#photobox__play").hide();
		$("#photobox__stop").show();
		$("#photobox__index").remove();

		/* Preload next image */
		for(var i=0;i<photobox.album.images.length;i++){
			var img = new Image();
			img.src = photobox.album.images[i];
			img.width = photobox.width;
			img.height = photobox.height;
			photobox.images.push(img);
		}

		/* Load next image */
		photobox.playTimer = window.setInterval(function(){

			/* Loop to start at the end of the sequence */
			if(photobox.currentIndex >= (photobox.images.length)){
				photobox.currentIndex = 0;
			}

			/* Append next image */
			var elmt = photobox.images[photobox.currentIndex];
			photobox.currentIndex++;
			$("#photobox__content").empty();
			$("#photobox__content").append(elmt);
		}, photobox.interval);
	},

	/* Stop playing */
	stop: function() {
		$("#photobox__stop").hide();
		$("#photobox__play").show();
		photobox.images = [];
		window.clearInterval(photobox.playTimer);
	},

	/* When user click on "previous" button */
	previous: function() {
		photobox.currentIndex--;
		if(photobox.currentIndex <= -1){

			/* If "wrapAround" option is enabled, loop to the last image when first image is reached */
			if(photobox.wrapAround){
				photobox.currentIndex = photobox.album.images.length - 1;
			} else {
				photobox.currentIndex = 0;
				return false;
			}
		}

		/* Load and display previous image */
		var link = photobox.album.images[photobox.currentIndex];
		photobox.img.src = link;
		photobox.link = link;
		photobox.title = photobox.getTitle(photobox.currentIndex);
		photobox.timer = window.setInterval(photobox.load,100);

		/* Return false to cancel the default action */
		return false;
	},

	/* When user click on "next" button */
	next: function() {
		photobox.currentIndex++;
		if(photobox.currentIndex >= photobox.album.images.length){

			/* If "wrapAround" option is enabled, loop to the first image when last image is reached */
			if(photobox.wrapAround){
				photobox.currentIndex = 0;
			} else {
				photobox.currentIndex = photobox.album.images.length - 1;
				return false;
			}
		}

		/* Load and display previous image */
		var link = photobox.album.images[photobox.currentIndex];
		photobox.img.src = link;
		photobox.link = link;
		photobox.title = photobox.getTitle(photobox.currentIndex);
		photobox.timer = window.setInterval(photobox.load,100);

		/* Return false to cancel the default action */
		return false;
	},

	/* Get the title of the given album image */
	getTitle: function(index) {
		var title = "";
		var link = photobox.album.images[index];
		for(var i=0;i<photobox.allLinks.length;i++){
			var el = photobox.allLinks[i];
			if(el.getAttribute('href') == link){
				title = el.getAttribute('title');
			}
		}
		return title;
	},

	/* When preloading is complete, open the image */
	load : function() {
		if(photobox.img.complete){
			window.clearInterval(photobox.timer);
			photobox.anim();
		}
	},

	/* Animate the modal */
	anim : function() {
		$("#photobox__container").show();

		/* Clear the content */
		$("#photobox__content").empty();

		/* Animate and display the image */
		$("#photobox__spinner").hide();
		photobox.resize();
	},

	/* Modal closing */
	close : function() {
		$("#photobox").fadeOut(photobox.duration/2, function(){
			$("#photobox").remove();
		});

		/* Stop the animation */
		window.clearInterval(photobox.playTimer);
	},

	/* Calculate the size of the modal to fit browser window and resize it */
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

		/* Animate the modal to resize */
		$("#photobox__content").animate({width:photobox.width}, photobox.duration/2).animate({height:photobox.height}, photobox.duration/2, "linear", function(){
			$("#photobox__content").append('<img src="'+photobox.link+'"width="'+photobox.width+'" height="'+photobox.height+'"><span id="photobox__title">'+photobox.title+'</span>');
			$("#photobox__title").show();
			$("#photobox__close").show();
			$("#photobox__previous").show();
			$("#photobox__next").show();

			/* If an album is defined, append controls to the modal */
			if((photobox.album.images).length > 1){
				if(photobox.player){
					$("#photobox__play").remove();
					$("#photobox__stop").remove();
					$("#photobox__control-panel").append('<i id="photobox__play"></i><i id="photobox__stop"></i>');
				}
				$("#photobox__previous").remove();
				$("#photobox__next").remove();
				$("#photobox__index").remove();
				$("#photobox__control-panel").append('<i id="photobox__previous"></i>');
				$("#photobox__control-panel").append('<i id="photobox__next"></i>');
				$("#photobox__control-panel").append('<span id="photobox__index">' + (photobox.currentIndex + 1) + '/' + (photobox.album.images).length +'</span>');
			}
		});
	}
}