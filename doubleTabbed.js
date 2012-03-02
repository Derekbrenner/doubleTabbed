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
//   -Works on the class name of a div user specified
//   -Mobile ready
//   -Included QUnit Test
// Mobile
//   - first h1 will be the header
//   -
//
//  PROPERTIES (size should probably be css)
//   -transition: none, fade, hide,slide
//   -height
//----------------------------------------------------


//::::::::::::Notes to self::::::::::::::::::::
//get rid of global
//
//
(function( $ ){
  
//----------------Functions------------------
//      //Example
//      var methods = {
//  		sample1 : function( ) {return this.each(function(){//code})}, 
//			sample2 : function( ) {//code}
//		};

  var methods = {
//-------------------------------------------
	  init : function( options ) { 
//-------------------------------------------
	   var settings = $.extend( {
		 'transition': 'fade',
		 'popout' : 'false',
		 'frontPage':'',
		 'browser':'normal'
	   }, options);
	  	return this.each(function(){
			var $this=$(this);
			$this.doubleTabbed("browserSniff",settings);
			$this.doubleTabbed("createNav");

			var browser=settings.browser
			if(settings.browser=='normal'){
				$this.doubleTabbed("regSetup");
			}
			if(settings.browser=='mobile'){
				$this.doubleTabbed("mobileSetup");
			}
			//var for the Navagation to be crated in

		})
    },
    show : function( ) {
      // IS
    },
//-----------------------------------------------------------
    createNav : function( ) { 
//  loops through children div elements of the Main Div
//  for every child div a <li><a href></a></li> in a <ul>  is made
//  the content of each link is the title of a coresponding child div
//-----------------------------------------------------------
		return this.each(function(){
			var $this=$(this);
			var tabbedNavigation="<ul id='" +$this.attr('id') +"_nav'>";
			$this.children("div").each(function(){//loops throught all the div in the tab area
				tabbedNavigation += '<li> <a href="#'+$this.attr('id')+'-'+$(this).attr('title')+'" data-transition="slide">'+$(this).attr('title')+'</a></li>';
			});
			
			tabbedNavigation +="</ul>";
			$this.find('div:first').before(tabbedNavigation);
			$this.find('ul#'+$this.attr('id') +'_nav a').bind("click.doubleTabbed", methods.linkClicked);
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
	linkClicked : function(event) {
//----------------------------------------------------------
		var $this=$(this);
		var $target = $(event.target);
	},
//----------------------------------------------------------
	browserSniff : function(settings) {
//  for copy and paste purposes
//  would like to extend this to find new browsers and then decide if its mobile or not and add it to a db
//  perhaps one DB is refrenced for all calls
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
// moves content into a content div
// adds the proper href to all links
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
				$('[title="'+$(this).text()+'"]').attr("data-role","page").attr('id',$this.attr('id')+'-'+$(this).text());
			});
			//call createMobileContent on all pages exept the nav page
			$('[data-role="page"]').slice(1).doubleTabbed('createMobileContent',$navPageId);
			//$nav.remove();
			//content must have the attr data-role="content"
			//var $dataRole='data-role';
			// ad the data-role='controlgrup' to the ul nav
			
		})
	},
//----------------------------------------------------------
	createMobileContent : function($navPageId ) {
//  Sets up a sub div of the main tabbed div as a mobile page
//----------------------------------------------------------
alert($navPageId);
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
	regSetup : function() {
//  for copy and paste purposes
//----------------------------------------------------------
		return this.each(function(){
			var $this=$(this);
			$this.children('div').hide();
			// is there a front page set? or does the front page given exist
			//  if not set the front page to the first div
			if(settings.frontPage==''||!($('div[title|="'+settings.frontPage+'"]').length)){
				settings.frontPage=$this.children('div:first').attr('title');
			}
			$('div[title|="'+settings.frontPage+'"]').show();
			//code
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


