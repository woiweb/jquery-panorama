/**
* jQuery panorama plugins
* Author: woiweb
* Versor: 1.0
* Download and more info: http://www.woiweb.net/jquery-panorama-plugins.html
* Thanks to: http://www.mathieusavard.info/
*
*
* Usage: 
	$(function() {
		// if you have 25 pictures of a model, and every picture's name is regular, for example: 1.jpg, 2.jpg ... 25.jpg, or pic_10.jpg,pic_11.jpg...pic_20.jpg and so on.
		
		// then you just put these picture's src in a Array like this:
		var arr = [];
		for (var x=1; x<= 25; x++)
			arr.push("images/pic2/" + x + ".jpg");
		
		$("#click").threesixty({images:arr, method:'click', 'cycle':1, 'cursor':'pointer'});
	});
*/


jQuery.fn.threesixty = function(options){
	options = options || {};
	options.images = options.images || [];	//image Array
	options.method = options.method || "click"	//method "click" or "mouseover" and so on.
	options.cycle = options.cycle || 1;	//rotate times on mouseover or click when sross the image.
	options.resetMargin = options.resetMargin || 0;
	options.direction = options.direction || "forward";
	options.cursor = options.cursor || "all-scroll";
	options.auto = options.auto || false;	// is auto roteta
	options.speed = options.speed || 150; //rotate speed, ms	
	options.showTools = options.showTools || true;	
	options.scale = options.scale || 0.2;  	
	options.maxZoomLevel = options.maxZoomLevel || 5; 
	
	/**
	*	initialize
	*/
	var timer = null; // timer
	var _this = this;
	var isPause = false; //
	var isFirst = true; //
	var index = null;	// Picture Index
	var direction = "right"; // Default Direction
	var defautLevel = 0;//
	var loaded = false;
	var originalHeight = $(this).height(), originalWidth = $(this).width();
	
	var progressNum = 1;
	
	/**
	 * loaded pictrue via explore
	 */
	function loadAllPics() {
		showOverlay();

		_this.each(function(){
			var imgArr = [];
			var pic = $(this);
			
			//ask browser to load all images.. 
			$.each(options.images, function(index, record) { 
				var o =$("<img>").attr("src", record).load(function(){
					progressNum++;
					if(progressNum == options.images.length) {
						loaded = true;
						hideOverlay();
					}
				});	
			});
			
			//add the first slice again to complete the loop
//			options.images.unshift($(_this).attr("src"));
			
			// add image to Array to complete cycle 
			for (var x = 1; x <= options.cycle; x++) {
				for (var y = 0; y < options.images.length; y++) {
					imgArr.push(options.images[y]);
				} 
			}
	
			if (options.method == "mousemove") {
			
				pic.mousemove(function(e) {
					clearTimer();
					pic.attr("src",imgArr[Math.floor((e.pageX - pic.offset().left) / (pic.width()/imgArr.length))]).css("cursor", options.cursor);
				});
			}
			
			if (options.method == "click") {
				var follower
				if (!$.browser.msie){
					follower = $("<div>").css({"z-index":0, "width":"15px", "height":"15px", "position":"absolute", "top": pic.offset().top, "left":pic.offset().left});
					
					$("body").append(follower);
					disableSelection(follower[0]);
				}
	
				disableSelection(pic[0]);
				var enabled;
				pic.mousemove(function(e) {
					// this is important, because it can stop Firefox itself drag event, or it will rotate once;
					pic[0].ondragstart=function (){return false;};
	
					pause();
					// set move range
					if (e.pageX<=pic.offset().left+options.resetMargin || e.pageX > pic.offset().left + pic.width()-options.resetMargin || e.pageY<=pic.offset().top+options.resetMargin || e.pageY>=pic.offset().top+pic.height()-options.resetMargin) {
						enabled=false;
						return false;
					}
	
					if (enabled==true) {
						pic.attr("src",imgArr[Math.floor((e.pageX - pic.offset().left) / (pic.width()/imgArr.length))]);
					}
				});
				
				pic.mouseup(function() {
					enabled=false; 
				}).mousedown(function() {
					enabled=true;
				}).mouseout(function(){
					enabled=false;
				});	
			}
	
			/**
			*	add other event
			*	if (options.method == "mouseover") {...}		
			*/
		});
	}
	
	//forbid element be selected
	function disableSelection(element) {
		element.onselectstart = function() {
			return false;
		};
		element.unselectable = "on";
		element.style.MozUserSelect = "none";
		element.style.cursor = "move";
	}	
	
	
	// show overlay
	function showOverlay(){
		if(!$('#overlay').length) {
			var mark = $("<div />");
			mark.attr("id","overlay");
			mark.height($(_this).outerHeight() + $(".toolbar").outerHeight());
			mark.width($(_this).width());
			mark.css({display:'block', cursor:'wait', position:'absolute', background:'#000', filter:'alpha(opacity=5)' ,opacity:'0.5'});
			mark.css("top",$(_this).offset().top);
			mark.css("left",$(_this).offset().left);
			
			var loaddiv = $("<div />");
			loaddiv.html("<img alt='loading...' src='images/loading.gif'>");
			loaddiv.css({position:'absolute', 'text-align' :'center'});
			loaddiv.css("top", parseInt($(_this).height())/ 2);
			loaddiv.width($(_this).width());
			mark.append(loaddiv);
		
			var par = $(".panorama_box") || $(_this).parent();
			par.append(mark);
			
		} else {
			$('#overlay').show();
		}
		 
	}
	
	// hide overlay
	function hideOverlay(){
		$("#overlay").css("cursor", "normal");
		$("#overlay").fadeOut();
	}
	
	// init outer div 
	function initContainer() {
		var panoramaBox = $("<div class='panorama_box'><div class='image_box'></div></div>");
		_this.wrap(panoramaBox);
		$(".panorama_box").width(originalWidth);
	}
	
	/**
	 * initialize
	 */
	function init() {
		initContainer();
		loadAllPics();
		
		if(options.showTools) {
			initTools(_this);
		}
		
		if (options.direction == "backward") {
			options.images.reverse();
		}
		
		if(options.auto) {
			autoPlay(_this);
		}
	}
	
	// initialize tools
	function initTools(imgEle){
		var toolsHtml = '<p class="toolbar"><span class="reset" title="恢复到最初"></span><span id="start" class="start" title="开始"></span><span class="zoomin"  title="放大"></span><span class="zoomout" title="缩小"></span><span class="turnleft" title="左转"></span><span class="turnright" title="右转"></span></p>';
		$(".image_box").after(toolsHtml);
		$(".image_box").width(originalWidth).height(originalHeight);
		
		// add Listener
		$("#start").click(function(){
			if($(this).attr("title") == "开始") {
				start();
			} else {
				pause();
			}
		});
		
		$(".turnleft").click(function(){
			pause(1);
			autoPlay(_this, "left");
		});
		
		$(".turnright").click(function(){
			pause(1);
			autoPlay(_this, "right");
		});	

		$(".reset").click(function(){
			reset();
		});
		
		$(".zoomin").click(function(){
			pause();
			zoom(_this, "zoomin");
		});	
		
		$(".zoomout").click(function(){
			pause();
			zoom(_this, "zoomout");
		});	
		
		$(".image_box").mousewheel(function(event, delta) {
			pause();
			if (delta > 0) {
				zoom(_this, "zoomin");
			}else if (delta < 0){
				zoom(_this, "zoomout");
			}
		});		
	}
	
	//start 
	function start(){
		isPause = false;
		autoPlay(_this, direction);
	}
	//pause
	function pause( args ){
		if(args) {
			$("#start").attr("title", "暂停");
			$("#start").removeClass("start").addClass("pause");
		} else {
			$("#start").attr("title", "开始");
			$("#start").removeClass("pause").addClass("start");
		}		
		clearTimer();
	}
	
	// reset 
	function reset(){		
		isPause = false; 
		isFirst = true; 
		index = null;	// Picture Index
		direction = "right"; // Default Direction
		defautLevel = 0;		
		pause();
		_this.attr("src", options.images[0]);
		_this.animate({"left":0, "top":0, "height": originalHeight+"px", "width": originalWidth +"px"}, 250);		
	}
	
	/**
	* auto play the pictures
	* @param imgEle: 
	*	the original image, 
	*	type: Array
	*
	* @param dire:
	*	rotate dire , 
	*	type : String, 
	*	Eg : "left", "right"
	*/
	
	function autoPlay(imgEle, dire){
		if(loaded){
			$("#start").attr("title", "暂停");
			$("#start").removeClass("start").addClass("pause");
		
			clearTimer();
			direction = dire || "right"; //default direction is right.
			if(isFirst) {
				index = (direction == "right" ? 0 : options.images.length - 1);		
			}
			
			timer = setInterval(function(){
				if(isPause) {return;}
				
				imgEle.attr("src", options.images[index]);
				if	(direction == "right") {
					index++;
					if(index >= options.images.length - 1) { index = 0;}
				} else {
					index--;
					if(index <= 0) { index = options.images.length - 1;}
				}
			}, options.speed);
			
			isFirst = false;
			
		} else {
			setTimeout(function(){
				autoPlay(imgEle, dire);
			}, 20);
		}
	}
	// stop rotate
	function clearTimer(){
		if(timer != null) {
			clearInterval(timer);
			timer = null;
		}
	}
	
	jQuery.easing.def = "easeOutQuart";
	/**
	*	image zoom effect
	*	@param imgEle
	*	@param mode,["zoomin", "zoomout"]
	*	return currentLevel
	*/
	var zoomTimer;
	function zoom(imgEle, mode){
		if (mode == "zoomin") {
			defautLevel++;
			if (defautLevel > options.maxZoomLevel) {
				defautLevel = options.maxZoomLevel;
				return;
			}
		}
		else {
			defautLevel--;
			if (defautLevel < 1) {
				defautLevel = 0;
				return;
			}
		}
		
		clearTimeout(zoomTimer);
		zoomTimer = setTimeout(doZoom, 30);
	}
	
	function doZoom() {	
		var ratio, left, top, _zoomHeight, _zoomWidth;
		ratio = 1 + defautLevel * options.scale;
		_zoomWidth =  parseInt(originalWidth * ratio, 10);
		_zoomHeight = parseInt(originalHeight * ratio, 10);
		left = (originalWidth - _zoomWidth) / 2;
		top = (originalHeight - _zoomHeight) / 2;
		
		$(_this).animate({
			"left": left + "px",
			"top": top + "px", 
			"height": _zoomHeight + "px", 
			"width": _zoomWidth + "px"
		}, {
			duration: options.speed,
			easing: "easeInSine"
		});
		
		return defautLevel;
	}
	
	
	init();
};