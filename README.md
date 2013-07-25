# jQuery Panorama Plugin
===============

A jQuery Panorama plugin, used to display merchandise in 360 degrees.

* Author: [woiweb](http://www.woiweb.net) [@woiweb](http://woiweb.com/woiwebnet)
* Version: 1.0
* Download and more info: [http://www.woiweb.net/jquery-panorama-plugins.html](http://www.woiweb.net/jquery-panorama-plugins.html).
* Thanks to: [http://www.mathieusavard.info/](http://www.mathieusavard.info/).

##当前版本: 1.0 (07/29/2010)
   * [Demo](http://www.woiweb.net/wp-content/uploads/plugins/panorama/).
   
##特性

   * 支持自动旋转及向左、右方向的旋转
   * 支持鼠标拖拽旋转和鼠标滑过旋转
   * 支持按钮点击缩放和鼠标滚轮缩放
   * 支持重置操作

##兼容性

   * Firefox, Chome
   * IE6-IE8
   * 其它待测

##用法

* 1、首先需要引入 jQuery Lib包、jquery.mousewheel.js, jquery.panorama-1.0.js. 我们在这用到jquery的mousewheel插件来实现鼠标滚轮事件。

```html
	<script type="text/javascript" src="js/jquery-1.3.2.min.js" type="text/javascripts" />
	<script type="text/javascript" src="js/jquery.mousewheel.js" type="text/javascripts" />
	<script type="text/javascript"src="js/jquery.easing.1.3.js" type="text/javascript" />
	<script type="text/javascript" src="js/jquery.panorama-1.0.js" type="text/javascripts" />
```
* 2、加入CSS样式
```css
.panorama_box{border:1px solid #fff; margin:auto;}
.image_box{border:1px solid #369; margin:auto; overflow:hidden;position:relative;}
.image_box img{position:relative;}
.toolbar{border:1px solid #CCCCCC;height:45px;margin:2px 0;}
.toolbar span{height:40px;width:38px;margin:2px;cursor:pointer;display:block;float:right;}
.zoomin{background:url("images/toolbar.jpg") no-repeat scroll 0 0;}
.zoomout{background:url("images/toolbar.jpg") no-repeat scroll -38px 0;}
.turnleft{background:url("images/toolbar.jpg") no-repeat scroll -112px 0;}
.turnright{background:url("images/toolbar.jpg") no-repeat scroll -76px 0;}
.start{background:url("images/toolbar.jpg") no-repeat scroll -150px 0;}
.pause{background:url("images/toolbar.jpg") no-repeat scroll -188px 0;}
.reset{background:url("images/toolbar.jpg") no-repeat scroll -226px 0;}
```

* 3、需要将你拍好的多张物品图片命名规则后放置指定目录中，如：images/pic2/，并在页面中添加展示物品的第一张图

* 4、Javascript调用
```js
$(function() {
	    var arr = []
	    for (var x=1; x<= 25; x++) {
	    	arr.push("images/pic2/" + x + ".jpg");
	    }
	    $("#click").threesixty({
	        images:arr,
	        method:'click'
	    });
});
```

##参数说明
* 参数   							描述 											默认值
* **images** 					物品360°拍摄的图片路径 	 	
* **method** 					触发方式 									click
* **cycle** 					旋转次数 									1
* **direction** 			旋转方向 									forward
* **cursor** 					鼠标样式 									move
* **auto** 						是否自动旋转 							false
* **speed** 					旋转速度 									150
* **scale** 					缩放比例 									0.1
* **maxZoomLevel** 		最大缩放范围 							5
