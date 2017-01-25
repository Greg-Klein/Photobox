/*!
 *  Photobox by Gregory Klein - http://www.gregoryklein.fr
 *  Licensed under the MIT license
 */

Photobox = {
  init: function(args) {

    /* Parameters definition */
    Photobox.options = {
      opacity: args.opacity || 0.7,
      duration: args.duration || 500,
      interval: args.interval || 500,
      wrapAround: args.wrapAround || false,
      player: args.player || false
    };

    Photobox.allItems = document.querySelectorAll('*[rel="photobox"]');

    $(Photobox.allItems).each(function() {
      $(this).hover(function() {
        $(this).css('cursor', 'pointer');
      });
    });

    Photobox.album = {
      title: '',
      images: []
    };

    // Get a reference to the last interval +1
    var intervalId = window.setInterval(function() {}, 9999);

    // Clear all intervals
    for (var i = 1; i < intervalId; i++)
            window.clearInterval(i);

    var $docBody = $('body');
    $docBody.on('click', '#photobox__close', Photobox.close);
    $docBody.on('click', '#photobox__bg', Photobox.close);
    $docBody.on('click', '#photobox__previous', Photobox.previous);
    $docBody.on('click', '#photobox__next', Photobox.next);
    $docBody.on('click', '#photobox__play', Photobox.play);
    $docBody.on('click', '#photobox__stop', Photobox.stop);

    $docBody.on('photoboxOpen', function(event) {
      var item = event.detail;
      Photobox.clickItem(event, item);
    });

    $docBody.on('click', '*[rel="photobox"]', function(event) {
      Photobox.clickItem(event, this);
    });
  },

  clickItem: function(event, item) {
    event.preventDefault();
    Photobox.album.images = [];

    if(item.getAttribute('data-pb-album')) {
      Photobox.album.title = Photobox.album.title || item.getAttribute('data-pb-album');
      for(var i = 0; i < Photobox.allItems.length; i++) {
        var el = Photobox.allItems[i];
        var elAlbum = el.getAttribute('data-pb-album');
        if(elAlbum === Photobox.album.title) {
          Photobox.album.images.push(el);
        }
      }

      Photobox.currentIndex = Photobox.album.images.indexOf(item);
    } else {
      Photobox.album.images.push(item);
      Photobox.currentIndex = 0;
    }

    $('#photobox').remove();
    $('body').append('<div id="photobox"><div id="photobox__bg"><i id="photobox__spinner"></i></div><div id="photobox__container"><div id="photobox__content"></div><div id="photobox__menubar"><i id="photobox__close"></i><div id="photobox__control-panel"><i id="photobox__previous"></i><i id="photobox__next"></i></div></div></div></div>');
    $('#photobox__container').hide();
    $('#photobox__menubar').hide();
    $('#photobox__bg').hide().fadeTo(Photobox.options.duration, Photobox.options.opacity);
    Photobox.draw(item);
    return false;
  },

  draw: function(item) {
    Photobox.lock = true;
    window.setTimeout(function() {
      Photobox.lock = false;
    }, 100);

    item = item || Photobox.album.images[Photobox.currentIndex];

    if(item.nodeName === 'IMG') {
      Photobox.link = $(item).attr('src');
    } else if (item.nodeName === 'A') {
      Photobox.link = $(item).attr('href');
    } else {
      Photobox.link = '';
    }

    Photobox.title = $(item).attr('title');

    if(!Photobox.playTimer) {
      Photobox.showSpinner(true);
    }

    /* Preload the image */
    Photobox.img = new Image();
    Photobox.img.src = Photobox.link;

    Photobox.img.onload = function() {
      Photobox.anim();
    };
  },

  /* Animate the modal */
  anim: function() {
    if(!Photobox.playTimer) {
      $('#photobox__container').fadeIn();
      $('#photobox__content img').hide();
    }

    Photobox.resize();
  },

  /* Calculate the size of the modal to fit browser window and resize it */
  resize: function() {
    docW = window.innerWidth;
    docH = window.innerHeight;

    var width = Photobox.img.width;
    var height = Photobox.img.height;
    var ratio = width / height;
    var newW = docW * 0.85; // 85% of the window width
    var newH = docH * 0.85 - 60; // 85% of the window height - 60px for the menubar

    if(width >= height) {
      if(width > newW) {
        width = newW;
        height = newW / ratio;
      }

      if(height > newH) {
        height = newH;
        width = newH * ratio;
      }
    } else {
      if(height > newH) {
        height = newH;
        width = newH * ratio;
      }

      if(width > newW) {
        width = newW;
        height = newW / ratio;
      }
    }

    /* Animate the modal to resize */

    if((Photobox.album.images).length > 1) {
      $(document).on('keyup', function(e) {
        console.log(e);
        if(e.keyCode === 39) {
          $(document).off('keyup');
          Photobox.next();
        } else if(e.keyCode === 37) {
          $(document).off('keyup');
          Photobox.previous();
        }
      });

      var $controlPanel = $('#photobox__control-panel');
      $controlPanel.show();
      if(Photobox.options.player && !Photobox.playTimer) {
        $('#photobox__play').remove();
        $('#photobox__stop').remove();
        $controlPanel.append('<i id="photobox__play"></i><i id="photobox__stop"></i>');
      }

      $('#photobox__index').remove();

      $controlPanel.append('<span id="photobox__index">' + (Photobox.currentIndex + 1) + '/' + (Photobox.album.images).length + '</span>');
    } else {
      $('#photobox__previous').hide();
      $('#photobox__next').hide();
    }

    $('#photobox__title').remove();

    if(!Photobox.playTimer) {
      $('#photobox__content').animate({width: width}, Photobox.options.duration / 2).animate({height: height}, Photobox.options.duration / 2, 'linear', function() {
        Photobox.showSpinner(false);

        /* Clear the content */
        $('#photobox__content').empty();

        $('#photobox__content').append('<img src="' + Photobox.link + '" width="' + width + '" height="' + height + '">');
        $('#photobox__content img').show();

        $('#photobox__menubar').append('<span id="photobox__title">' + Photobox.title + '</span>');
        $('#photobox__menubar').fadeIn();
      });
    } else {
      $('#photobox__content').css('width', width).css('height', height);
      Photobox.showSpinner(false);

      /* Clear the content */
      $('#photobox__content').empty();

      $('#photobox__content img').attr('src', Photobox.link);

      $('#photobox__content').append('<img src="' + Photobox.link + '" width="' + width + '" height="' + height + '">');

      $('#photobox__menubar').append('<span id="photobox__title">' + Photobox.title + '</span>');
    }
  },

  /* Modal closing */
  close: function() {
    Photobox.stop();
    $('#photobox').fadeOut((Photobox.options.duration / 2), function() {
      $('#photobox').remove();
    });

    $(document).off('keyup');
  },

  /* When user click on "previous" button */
  previous: function() {
    if(!Photobox.lock) {
      Photobox.currentIndex--;
      if(Photobox.currentIndex <= -1) {

        /* If "wrapAround" option is enabled, loop to the last image when first image is reached */
        Photobox.currentIndex = Photobox.options.wrapAround ? Photobox.album.images.length - 1 : 0;
        if(Photobox.currentIndex === 0) { return false; }
      }

      /* Load and display previous image */
      Photobox.draw();
    }

    /* Return false to cancel the default action */
    return false;
  },

  /* When user click on "next" button */
  next: function() {
    if(!Photobox.lock) {
      Photobox.currentIndex++;
      if(Photobox.currentIndex >= Photobox.album.images.length) {

        /* If "wrapAround" option is enabled, loop to the first image when last image is reached */
        Photobox.currentIndex = (Photobox.options.wrapAround || Photobox.playTimer) ? 0 : Photobox.album.images.length - 1;
        if(Photobox.currentIndex === (Photobox.album.images.length - 1)) { return false; }
      }

      /* Load and display next image */
      Photobox.draw();
    }

    /* Return false to cancel the default action */
    return false;
  },

  /* Images sequence playing */
  play: function() {
    var images = [];

    $('#photobox__play').hide();
    $('#photobox__stop').show();

    // $("#photobox__index").remove();

    /* Preload next image */
    for(var i = 0; i < Photobox.album.images.length; i++) {
      var img = new Image();
      var item = Photobox.album.images[i];

      if(item.nodeName === 'IMG') {
        img.src = Photobox.album.images[i].src;
      } else if (item.nodeName === 'A') {
        img.src = Photobox.album.images[i].href;
      }

      img.width = Photobox.width;
      img.height = Photobox.height;
      images.push(img);
    }

    Photobox.playTimer = window.setInterval(function() {

      /* Loop to start at the end of the sequence */
      if(Photobox.currentIndex >= images.length) {
        Photobox.currentIndex = 0;
      }

      Photobox.next();
    }, Photobox.options.interval);
  },

  /* Stop playing */
  stop: function() {
    $('#photobox__stop').hide();
    $('#photobox__play').show();
    window.clearInterval(Photobox.playTimer);
    Photobox.playTimer = undefined;
  },

  showSpinner: function(flag) {
    if(flag) {
      $('#photobox__spinner').hide().fadeIn();
      $('#photobox__content').css('opacity', '0.5');
    } else {
      $('#photobox__spinner').hide();
      $('#photobox__content').css('opacity', '1');
    }

  }
};
