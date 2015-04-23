/* global jQuery:false */

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//  Notes: new requirements for SPO
	//  * Redudce animation speed by .5 or even less
	//  * searchbox more prominent, replace background fill (see http://tympanus.net/Development/TextInputEffects/    ...akira)
	//  
	//  * Initially, list displays common items, but search suggests as user types (fading away irrelevent list items)
	//  * make responsive
	//  * remove calsit/acs, but on focus it should fade
	//  *"how may we help you " text should be styled the same as was before, not italicized eetc
	//  *put padding below the searchbox on how may we help
	//  *add headings to common search items
	//  *left align search items, and width should match searchfield or "how may...help you"
	//  *if # of suggested/common search items is in excess, programatically show a button for more search results
	//  * the icons in the white area below should not have description text, but rather be like a grid, and show more details on hover card
	//  *typography fixes ...see notes
	//  
	//  
	//  Additional:
	//  
	//  *some type of "more info" modal (or other animated div) 
	//  
	// 
	//
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


(function($) {

	//alert("test");
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Fixed Footer Feature:
	// 
	// Based upon the relationship between viewport size, and <body> height, toggle on or off the fixed position of the footer.
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var windowHeight = $( window ).height(); // get the computed height of the browser viewport
	var footerHeight = 250; // hardcoded height for the footer
	var bodyHeight = $("body.page").height(); // get the computed height of the body

	//Console.log for Debugging
	//console.log("Position: " + $("#colophon").css("position") + ", windowHeight: " + windowHeight + ", bodyHeight: "+bodyHeight +", bodyHeight+250: "+(bodyHeight+250));

	// If footer is position fixed. This matters because whether fixed vs static affects calculation of body height.
	if($("#colophon").css("position") == "fixed"){

			var bodyHeight_fixed = bodyHeight + 250; //define new variable equal to bodyheight plus footer height
			if($("#wpadminbar").length) { //if logged in to admin, account for height of the wpadminbar by adding 32 pixels.
					bodyHeight_fixed += 32;
			}

			if(windowHeight <= bodyHeight_fixed){
				$("#colophon").removeClass("footerPositionFixed"); //remove position fixed from footer
				$("#colophon").addClass("footerPositionStatic"); //add position static to footer
			}

	//If footer is position static
	}else if($("#colophon").css("position") == "static"){
			if(windowHeight >= bodyHeight){
				$("#colophon").removeClass("footerPositionStatic");//remove position static to footer
				$("#colophon").addClass("footerPositionFixed"); //add postition fixed to footer
			}
	}	

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Fixed Footer Feature, for on resize events.
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$(window).resize(function(){


		var windowHeight = $( window ).height(); // get the computed height of the browser viewport
		var footerHeight = 250; // get the computed height of the footer
		var bodyHeight = $("body.page").height(); // get the computed height of the body
	
		// If footer is position fixed. This matters because whether fixed vs static affects calculation of body height.
		if($("#colophon").css("position") == "fixed"){

				var bodyHeight_fixed = bodyHeight + 250; //define new variable equal to bodyheight plus footer height
				if($("#wpadminbar").length) { //if logged in to admin, account for height of the wpadminbar by adding 32 pixels.
					bodyHeight_fixed += 32;
				}
				

				if(windowHeight <= bodyHeight_fixed){
					$("#colophon").removeClass("footerPositionFixed"); //remove position fixed from footer
					$("#colophon").addClass("footerPositionStatic"); //add position static to footer
				}

		//If footer is position static
		}else if($("#colophon").css("position") == "static"){
				if(windowHeight >= bodyHeight){
					$("#colophon").removeClass("footerPositionStatic");//remove position static to footer
					$("#colophon").addClass("footerPositionFixed"); //add postition fixed to footer
				}
		}

		//console.log for Debugging.
		//console.log("Position: " + $("#colophon").css("position") + ", windowHeight: " + windowHeight + ", bodyHeight: "+bodyHeight +", bodyHeight+250: "+(bodyHeight+250));

	}); //END .resize 




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Execute the following if current page is .page-home
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	if($('body').is('.page-home')){

		//Check if user is logged in
		if($("#wpadminbar").length) {

		//User logged in

		}else{

		//User not logged in

		} 

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// service search feature
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		var serviceSearchIsActive = false; //returns whether service search is active. Initialized to false.
		var iconClickInProgress = false;

		function serviceSearchActivate(){

			$("body").addClass("service-search-active"); //add said class to body

			$(".serviceWrapper.service-search-active > div").css("display", "block");

			//Remove old sub heading text with fade transition and replace it 
			$(".subHeading").fadeOut("slow",function(){
								
				$(this).css({"font-weight": "500","font-style":"italic"});

				$(this).text("How may we help you?").fadeIn();

			});

			//add .service-search-active to several selectors 
			$(" .height-div, .homePageFeature, .subHeading, #services-searchfield, #input-16, .cyan, .serviceWrapper, .opacityLayer ").addClass("service-search-active");

			//$(".serviceWrapper").velocity("transition.slideLeftIn", {stagger:100}).delay(500);
			$(".searchResultsWrapper").velocity("transition.slideLeftIn", {stagger:100}).delay(500);

			//if .searchResults exists in DOM
			if( $(".searchResults").length > 0){

				var searchWidthArray = []; //define new array
				var singleSearchResultArr = [];

				//iterate over all items matching .singleSearchResult 
				$(".singleSearchResult").each(function(index, value){

					var widths = parseInt($(this).css("width")); // variable assigned width(without px units) of current item in the iteration
					console.log(widths);
					searchWidthArray.push(widths); //this current item width pushed onto the searchWidthArray
					singleSearchResultArr.push(value);


				});
				//console.log(searchWidthArray);
				//console.log(singleSearchResultArr);
				//console.log(typeof singleSearchResultArr);


				}
			
			
		}

		function serviceSearchDeactivate(){

			$("body").removeClass("service-search-active"); //remove said class from body

			//reinstate the original subheading text with fade transition
			$(".subHeading").fadeOut("slow",function(){

				$(this).css({"font-weight": "100","font-style":"normal"});

				$(this).text("Here for you.").fadeIn();
			});

			setTimeout(function(){

			//remove .service-search-active to several selectors 
			$(" .height-div, .homePageFeature, .subHeading, #services-searchfield, #input-16, .cyan, .opacityLayer ").removeClass("service-search-active");

			
			},200);
	
			

			

		}
		//On mouse down, prevent certain elements from triggering onBlur event
		$(".serviceWrapper > div > a, .serviceHeading, .singleSearchResult").mousedown(function(){

			iconClickInProgress = true;
			//console.log("iconClickInProgress: "+iconClickInProgress);
		});

		//On mouse up, restore original onBlur functionality
		$(".serviceWrapper > div > a, .serviceHeading, .singleSearchResult").mouseup(function(){
			iconClickInProgress = false;
			//console.log("iconClickInProgress: "+iconClickInProgress);
		});

		//Handle searchfield on focus event
		$("#services-searchfield, #input-16").focus(function(e) {

			serviceSearchIsActive = true;

				if($("body").hasClass("page-home")){

				serviceSearchActivate();

				}


		});

		//Handle searchfield on blur event
		$("#services-searchfield, #input-16").on('blur',function() {
			if(iconClickInProgress==false){
				
				if( $("body").hasClass("page-home") ){

				serviceSearchDeactivate(); 
				
				}

				
			}
			
			serviceSearchIsActive = false;

			

		});

		//console.log( testjs_object);

	
	} //end if is page-home


})( jQuery );
