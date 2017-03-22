var myGlobalisMobileDevice = false,
    isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

!function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var r=this._onceEvents&&this._onceEvents[t];o;){var s=r&&r[o];s&&(this.off(t,o),delete r[o]),o.apply(this,e),n+=s?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}(window,function(t,e){function i(t,e){for(var i in e)t[i]=e[i];return t}function n(t){var e=[];if(Array.isArray(t))e=t;else if("number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e}function o(t,e,r){return this instanceof o?("string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=n(t),this.options=i({},this.options),"function"==typeof e?r=e:i(this.options,e),r&&this.on("always",r),this.getImages(),h&&(this.jqDeferred=new h.Deferred),void setTimeout(function(){this.check()}.bind(this))):new o(t,e,r)}function r(t){this.img=t}function s(t,e){this.url=t,this.element=e,this.img=new Image}var h=t.jQuery,a=t.console;o.prototype=Object.create(e.prototype),o.prototype.options={},o.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},o.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),this.options.background===!0&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&d[e]){for(var i=t.querySelectorAll("img"),n=0;n<i.length;n++){var o=i[n];this.addImage(o)}if("string"==typeof this.options.background){var r=t.querySelectorAll(this.options.background);for(n=0;n<r.length;n++){var s=r[n];this.addElementBackgroundImages(s)}}}};var d={1:!0,9:!0,11:!0};return o.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(e.backgroundImage);null!==n;){var o=n&&n[2];o&&this.addBackground(o,t),n=i.exec(e.backgroundImage)}},o.prototype.addImage=function(t){var e=new r(t);this.images.push(e)},o.prototype.addBackground=function(t,e){var i=new s(t,e);this.images.push(i)},o.prototype.check=function(){function t(t,i,n){setTimeout(function(){e.progress(t,i,n)})}var e=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},o.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+i,t,e)},o.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},r.prototype=Object.create(e.prototype),r.prototype.check=function(){var t=this.getIsImageComplete();return t?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},r.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},r.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},r.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype=Object.create(r.prototype),s.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var t=this.getIsImageComplete();t&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},s.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},o.makeJQueryPlugin=function(e){e=e||t.jQuery,e&&(h=e,h.fn.imagesLoaded=function(t,e){var i=new o(this,t,e);return i.jqDeferred.promise(h(this))})},o.makeJQueryPlugin(),o});


window.mobileAndTabletcheck = function() {
  myGlobalisMobileDevice = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) myGlobalisMobileDevice = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return myGlobalisMobileDevice;
};
mobileAndTabletcheck();
if( myGlobalisMobileDevice ){
    $("html").attr("id", "mobile");
}

function getRandom(min, max) {
  return min + Math.random() * (max - min);
}


var menuL = menu.length,
		worksL = Object.keys(works).length;

//Если с английского на русский, то передаём вторым параметром true.
transliterate = (
	function() {
		var
			rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
			eng = "shh sh ch cz yu ya yo zh B y E a b v g d e z i j k l m n o p r s t u f x P".split(/ +/g)
		;
		return function(text, engToRus) {
			var x;
			for(x = 0; x < rus.length; x++) {
				text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
				text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());	
			}
			return text.replace(/[^a-zA-Z]/g, "");
		}
	}
)();
/*
var txt = "Съешь ещё этих мягких французских булок, да выпей же чаю!";
alert(transliterate(txt));
alert(transliterate(transliterate(txt), true));
*/


function changeVp(){
    var $myHtml = $("html");
    
    if( myGlobalisMobileDevice ){
        setTimeout(function(){
                window.scrollTo(0, 1);
        }, 10);
        // myHtml.setAttribute("class", myHtml.getAttribute("class")+" mobile");
        // $myHtml.addClass("mobile");
        $(window).smartresize(function(){
						var mW = window.innerWidth;
						var mH = window.innerHeight;
            if( (window.innerWidth < 1024) && (window.innerWidth < window.innerHeight) ){
                var mvp = document.getElementById('pageViewport');
                mvp.setAttribute('content','width=320');
            }else{
                var mvp = document.getElementById('pageViewport');
                mvp.setAttribute('content','width=device-width, initial-scale=1');
            }
        });
    }
}

function initWorks(){
	var els = [];
	for(var el in works) {
		if( works[el]["link"] ){
	  var $el = $('<a href="'+works[el]["link"]+'" class="item active">\
	  							<span class="itemIW anim">\
										<span class="imgContainer"><span class="imgContainerIW"></span></span>\
										<span class="text"></span>\
									</span>\
								</a>');
  	}else{
  		var $el = $('<span class="item active">\
  								<span class="itemIW anim">\
										<span class="imgContainer"><span class="imgContainerIW"></span></span>\
										<span class="text"></span>\
									</span>\
								</span>');
  	}


	  if( works[el]["imageUrl"] ){
	  	$el.find(".imgContainer .imgContainerIW").css('background-image', 'url(' + works[el]["imageUrl"] + ')');
	  }
	  if( works[el]["bg"] ){
	  	$el.find(".imgContainer").css({ 'background-color' : works[el]["bg"], "border-color" : works[el]["bg"] });
	  }

	  var $thistext = $el.find(".text");
	  if( works[el]["object"] ){
	  	$thistext.append('<span class="object">'+works[el]["object"]+'</span>');
	  }

  	$thistext.append('<span class="name">'+el+'</span>');

	  if( works[el]["desciption"] ){
	  	$thistext.append('<span class="desciption">'+works[el]["desciption"]+'</span>');
	  }

		elSectionLength = works[el]["section"].length;
		for( var k =0; k < works[el]["section"].length; k++){
			$el.addClass("section-"+transliterate(works[el]["section"][k]));
		}
	  $("#content").append($el);
	}

	var fixFlexLastRow = "<span class='emptyItemFix'></span>";
	for( var i=0; i< Object.keys(works).length; i++){
		$("#content").append(fixFlexLastRow);
	}
	
}

function initmenu(){
	var allL = $("#content .item").length;
				  $allpt = $('<div class="item">\
								<span>Все</span><sup>'+allL+'</sup>\
							</div>');
  $("#menu").append($allpt);
	for(var i=0; i < menuL; i++){
		var menuClass = transliterate(menu[i]),
				contentElsLength = $("#content .item.section-"+menuClass+"").length;
			  $pt = $('<div class="item section-'+menuClass+'">\
								<span>'+menu[i]+'</span>\
							</div>');
		if( contentElsLength > 0 ){
			$pt.append("<sup>"+contentElsLength+"</sup>");
		}
		$("#menu").append($pt);
	}
}
/*end init*/

function goNiceScroll(){
	if( !myGlobalisMobileDevice ){
		$("#leftCol .iw").niceScroll({
      cursorcolor: '#000',
      cursorwidth: '3px',
      cursorborderradius: '2px',
      cursorborder: '0px solid #000',
      background: 'transparent',
      scrollspeed: 80,
      mousescrollstep: 50,
      railoffset: {top: 0, right: 0, left: 0, bottom: 0},
      cursoropacitymin: 1,
      cursoropacitymax: 1,
      horizrailenabled: false,
      zindex: 2,
      nativeparentscrolling: true,
      autohidemode: false
	  });
	}
	$(window).smartresize(function(){
		$("#leftCol .iw").getNiceScroll().hide().show().resize();
	});
}
var controller;
var scene;
function animateScrollElements(){
	controller = new ScrollMagic.Controller();

	$('#content .item.active').each(function(){
		var $el = $(this),
				$elIW = $el.find(".itemIW"),
				$imgCont = $el.find(".imgContainerIW");
		TweenMax.set($el, {display: "flex"});
		TweenMax.set($elIW, {opacity: 0, y: $elIW.outerHeight()*0.2});
		TweenMax.set($imgCont, {opacity: 0.6, y: "100%"});

		var thisRandomDelay = getRandom(0.1,0.4),
				tween = new TimelineMax({ delay:thisRandomDelay, onComplete: afterAnimation })
				.to($elIW, 0.9, {opacity: '1'}, 0)
				.to($elIW, 0.6, {y : 0 , ease: Sine.easeOut}, 0)
				.to($imgCont, 0.55, {y : "0%", opacity: 1, ease: Sine.easeOut }, 0.15);
		function afterAnimation(){
			$el.addClass("completeAnimation");
			TweenMax.set($imgCont ,{clearProps:"transform"});
		}
		scene = new ScrollMagic.Scene({triggerElement: $el, triggerHook: 'onEnter', offset: $elIW.outerHeight()*0.5, reverse: false})
		.setTween(tween)
		//.addIndicators()
		.addTo(controller);

		scene.elementH = $elIW.outerHeight();
		//console.log(scene);

    $(window).smartresize(function(){
    	if( controller ){
    		controller.update(true);
    	}
    });
	});
}

function changeActiveSection(){
	var $menuItems = $("#menu .item"),
			$allElements = $("#content .item");

	$menuItems.hammer().bind("tap", function(){
		var $this = $(this),
				thisClass = $this.attr("class").replace("item", "").replace("inactive", "").replace("active", "").replace(" ", "");
				if( thisClass.trim() != "" ){
					$thisElements = $("#content .item."+thisClass+"");
				}else{
					$thisElements = $("#content .item");
				}
				
		if($this.hasClass("active")){return false;}

		if(controller){
			controller.destroy();
		}
		if(scene){
			scene.destroy();
		}
		scene = null;
		tween = null;
		controller = null;

		var $activeEls = $('#content .item.active .itemIW');
		TweenMax.to( $activeEls, 0.5, {opacity: 0, onComplete: afterFade });
		$menuItems.removeClass("active inactive completeAnimation");
		$menuItems.not($this).addClass("inactive");
		$this.addClass("active");
		function afterFade(){
			TweenMax.set($allElements ,{clearProps:"all"});
			$allElements.removeClass("active inactive completeAnimation");
			
			$allElements.not($thisElements).addClass("inactive");
			$thisElements.addClass("active");

			window.location.hash = "#" + thisClass;

			animateScrollElements();
		}
	});
}

function slideMenu(){
	var $burgerW = $(".burgerMenuWrapper"),
			$burger = $burgerW.find(".burgerMenu");
	$burgerW.hammer().bind("tap", function(){
		if( !$burger.hasClass("active") ){
	      $burger.add( $(".leftContainer") ).addClass("active");
	  }else{
	      $burger.add( $(".leftContainer") ).removeClass("active");
	  }
	});
}

function imgLoad(){
	var $imgs = $("#content .imgContainerIW");
	$imgs.imagesLoaded( { background: true }, function() {
		changeActiveSection();
		animateScrollElements();
	});
}



$(document).ready(function(){
	changeVp();
	TweenMax.set($('#content'), {perspective:500});
	initWorks();
	initmenu();
	goNiceScroll();
	slideMenu();
	imgLoad();
  if (window.location.hash.length > 0) {
      var thisClass = window.location.hash.substr(1);
      console.log(thisClass);
      //Hammer( $("#menu .item."+thisClass+"") ).trigger('tap', eventData);
      $("#menu .item."+thisClass+"").hammer().trigger("tap");
  }
});