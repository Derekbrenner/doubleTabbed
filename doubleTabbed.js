//----------------------------------------------------
// Double Tabbed
// by Derek Brenner
//
// NOTE:Just started not ready for use
//
// Description: J Query plugin that creates an Easy to use tab system that will 
// auto convert to a mobile version if a phone is detected.
//
// FEATURES
//   -Converts simple html code into tabed content
//   -Mobile ready
//
// Mobile
//   - first h1 will be the header
//   -Each page div should have a h1 in it
//
// Setup
//   -paste into head:<script src="http://code.jquery.com/jquery-latest.js"></script>
//   -paste into head:<script type="text/javascript" src="https://raw.github.com/Derekbrenner/doubleTabbed/master/doubleTabbed.js"></script>
//   -paste into head:<script type="text/javascript">$("document").ready(function(){$("#yourDivName").doubleTabbed({'frontPage':'Page2'});});</script>
//   -create a div with an id of your choosing that wraps your content
//   -change #yourDivName in the last code pasted to the id of your main div
//   -create sub div's with the title propertie = to the page name
//   -each div should have an H1 element in it and some content
//   - make sure fthe css file is in the same directory(CHANGE THIS TO GRAB FROM GIT and option to overide for custom theme)
//
//  PROPERTIES (size should probably be css)
//     WORKING
//	-browser:  can be set to mobile if you want it to always be mobile
//	-frontPage:  set it equal to the title of the page you want to be default loaded
//     Not working
//	-transition
//	-mobile theme
//----------------------------------------------------


//::::::::::::Notes to self::::::::::::::::::::
//get rid of global
//
//
(function( $ ){
  
//----------------Functions------------------
//      //Example
//      var methods = {
//			sample1 : function( ) {return this.each(function(){//code})}, 
//			sample2 : function( ) {//code}
//		};

  var methods = {
//-------------------------------------------
	  init : function( options ) {
//  first function called, checks browser and sets up the tabs
//-------------------------------------------
	   var settings = $.extend( {//options
		 'transition': 'fade',
		 'popout' : 'false',
		 'frontPage':'',
		 'browser':'normal'
	   }, options);
	  	return this.each(function(){//for chaining purposes
			var $this=$(this);
			$this.doubleTabbed("browserSniff",settings);
			$this.doubleTabbed("createNav");
			var browser=settings.browser
			if(settings.browser=='normal'){
				$this.doubleTabbed("regSetup",settings);
			}
			if(settings.browser=='mobile'){
				$this.doubleTabbed("mobileSetup");
			}

		})
    },
//-----------------------------------------------------------
    createNav : function( ) { 
//  loops through children div elements of the Main Div
//  for every child div a <li><a href></a></li> in a <ul>  is made
//  the content of each link is the title of a coresponding child div
//-----------------------------------------------------------
		return this.each(function(){
			var $this=$(this);
			var tabbedNavigation="<ul class='doubleTabbedNav' id='" +$this.attr('id') +"_nav'>";
			$this.children("div").each(function(){//loops throught all the div in the tab area

				tabbedNavigation += '<li title="'+$(this).attr('title')+'" > <a href="#'+$this.attr('id')+'-'+$(this).attr('title')+'" data-transition="slide">'+$(this).attr('title')+'</a></li>';
			});
			
			tabbedNavigation +="</ul>";
			$this.find('div:first').before(tabbedNavigation);
		})
    },
//----------------------------------------------------------
    hide : function( ) { 
//simple function for testing
//----------------------------------------------------------
		return this.each(function(){
			var $this=$(this);
			$this.hide();
			
		})
    },

	
//----------------------------------------------------------
	regSetup : function(settings) {
//  setup for the desk top version
//  loads in the css for desk top
//  adds css classes
//  hides content , shows the front page
//  binds onClick to nav
//----------------------------------------------------------
		//link the style sheet ajax <link rel="stylesheet" type="text/css" href="doubleTabbedStyle.css" />
		$("head").append("<link>");
		css = $("head").children(":last");
		css.attr({
			rel:  "stylesheet",
			type: "text/css",
			href: "doubleTabbedStyle.css"
		});
		var $this=$(this);
		// add a class for css
		$this.attr('class','doubleTabbed');
		//hide all content
		$this.children('div').hide();
		// is there a front page set? or does the front page given exist
		//  if not set the front page to the first div
		if(settings.frontPage==''||!($('div[title="'+settings.frontPage+'"]').length)){
			settings.frontPage=$this.children('div:first').attr('title');
		}
		$this.find('div[title="'+settings.frontPage+'"]').show();
		// sets the current button css
		$this.find('li[title="'+settings.frontPage+'"]').attr('class','current');
		// binds onClick to nav
		$this.find('ul#'+$this.attr('id') +'_nav a').bind("click.doubleTabbed", methods.linkClicked);

		
	},

//----------------------------------------------------------
	linkClicked : function(event) {
//  manages page transitions and link css
// called when a link is clicked
//----------------------------------------------------------
		var $linkClicked=$(this);

		var $navUl=$linkClicked.parent().parent();
		// $mainDiv this is the div that double tabbed was called on
		var $mainDiv=$navUl.parent();
		//finds the current page
		var $currentContent=$mainDiv.find('div:visible');
		//page that will be changed to
		var $nextPage=$mainDiv.find('div[title="'+$linkClicked.parent().attr("title")+'"]');
		//transitions if all is well
		if($currentContent.attr("title")!=$linkClicked.parent().attr("title")){
			$navUl.find('li.current').removeClass('current');
			$linkClicked.parent().addClass('current');
			 $currentContent.fadeOut(250, function(){
			 	$nextPage.fadeIn(250);	
			 });	
		}
	},
//----------------------------------------------------------
	browserSniff : function(settings) {
// if you are on a phone sets the propertie
//----------------------------------------------------------
		if( navigator.userAgent.match(/Android/i) ||
		 navigator.userAgent.match(/webOS/i) ||
		 navigator.userAgent.match(/iPhone/i) ||
		 navigator.userAgent.match(/iPod/i) ||
		 navigator.userAgent.match(/BlackBerry/)
		 ){
			settings.browser='mobile'; 			 // some code
		}
		else{}
	},
//----------------------------------------------------------
	mobileSetup : function( ) {
//  Lodes the mobile css
//  loads the mobile jquery
//  Puts the data-role='page' on each sub div
//  moves content into a content div
//  adds the proper href to all links
//----------------------------------------------------------
		//Loads in the needed js and css
		$("head").append("<link>");
		css = $("head").children(":last");
		css.attr({
			rel:  "stylesheet",
			type: "text/css",
			href: "http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.css"
		});
		$.ajax({
		  url: 'http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.js',
		  dataType: "script",
		  success:function(data){
				//alert('Scripts');
			}
		  //success: success
		});
		return this.each(function(){
			//code
			var $this=$(this);
			var $nav=$('#'+ $this.attr('id') +'_nav');
			var headerTag = '<meta name="viewport" content="width=device-width, initial-scale=1">';
			var $header = $('h1:first');
			$('head').append(headerTag);
			//Put proper tags in nav
			// ad the data-role='controlgrup' to the ul nav 
			$('#'+ $this.attr('id') +'_nav').attr("data-role","controlgroup");
			$this.find('ul a').attr("data-role","button");
			
			//set up the first page with nav
			var $navPageId=$this.attr('id')+'_mobilenav';
			$this.prepend(' <div data-role="page" id="'+$navPageId+'"></div>');
			var $firstPage=$('#'+$navPageId);
			$firstPage.prepend(' <div data-role="header"></div>');
			$firstPage.find('[data-role="header"]').prepend($header);
			$firstPage.append(' <div data-role="content"></div>');
			$firstPage.find('[data-role="content"]').append($nav);
			//loop through all links and find the div with a corasponding title
			//then add the data role page and the id= page name  ie mainDivId_titleOfPage
			$firstPage.find('[data-role="content"] a').each(function(){//loops throught all the div in the tab area
				$('div[title="'+$(this).text()+'"]').attr("data-role","page").attr('id',$this.attr('id')+'-'+$(this).text());
			});
			//call createMobileContent on all pages exept the nav page
			$('[data-role="page"]').slice(1).doubleTabbed('createMobileContent',$navPageId);
			//content must have the attr data-role="content"

			
		})
	},

//----------------------------------------------------------
	createMobileContent : function($navPageId ) {
//  Sets up a sub div of the main tabbed div as a mobile page
//----------------------------------------------------------
		return this.each(function(){
			$this=$(this);
			//create a div for the content
			//then puts everything previously in the sub div inside it
			$content=$this.contents();
			$this.prepend(' <div data-role="content"></div>');
			$this.find('div[data-role="content"]').append($content).append('<a data-role="button" data-icon="arrow-l" href="#'+$navPageId+'" data-direction="reverse">Back</a>');
			//creates a div for the header and puts the any h1 element inside it
			$this.prepend(' <div data-role="header"></div>');
			var $subHeader=$this.find('h1');
			$this.find('div[data-role="header"]').append($subHeader);
		})
	},

//----------------------------------------------------------
	exampleFunction : function( ) {
//  for copy and paste purposes
//----------------------------------------------------------
		return this.each(function(){
			//code
		})
	}
  };//-------------methods end------------------------------
  
  
  // ---- Control ---
  // the method is passed in as an argument
  $.fn.doubleTabbed= function(method) {
   if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.doubleTabbed' );
    }    

  };
})( jQuery );


