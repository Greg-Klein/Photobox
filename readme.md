Photobox
========


Welcome to Photobox, a lightweigth image displaying jQuery module.

----------


Documentation
----------------------

Using Photobox is really **easy**!
Just add these 3 lines at the right place in your document

In the header:
```html
<link rel="stylesheet" href="path/to/photobox.min.css">
```

In the body:
```html
<a href="path/to/your/image" rel="photobox" title="anything you want">image or text</a>
```

At the end of the body:
```html
<script src="path/to/photobox.min.js"></script>

<script>
	photobox.init();
</script>
```

You can pass options like this:
```html
<script>
	photobox.init({
		opacity: "0.8",
		duration: "500"
	});
</script>
```

The options are:

 - opacity: The opacity of the background (from 0 to 1)
 - duration: The animation duration (Milliseconds)

----------
> **Tip:** Don't forget to import jQuery **before** Photobox.

