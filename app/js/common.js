$(function() {
	/*----------  Tabs  ----------*/
	(function tab() {
		var conatiner = $('.jsTabContainer'),
		    controls = $('.jsTabControls'),
		    contents = $('.jsTabContents'),
		    // classes
		    controlActive = 'is--active',
		    contentActive = 'is--show';

		// ---
		controls.find('a').click(function(e){
			e.preventDefault();

		    var thisContentID = $(this).attr('data-content-id'),
		        thisContent = $(this).closest(conatiner).find(contents).find('#' + thisContentID);
		  	
		  	// Button add active class
		    controls.find('a').removeClass(controlActive);
		    $(this).addClass(controlActive);
		 	
		 	// Show active content
		    if(thisContent.css('display') == 'none') {
		      	contents.find('>div').hide().removeClass(contentActive);
		      	thisContent.fadeIn().addClass(contentActive);
		    }
		});
	})();

	/*----------  Accordion  ----------*/
	(function accordion() {
		var item = $('.jsAcc'),
			btn = $('.jsAccBtn'),
			content = $('.jsAccContent'),
			// classes
			btnActive = 'is--active',
			contentActive = 'is--show';

		// Show default content
		$('.jsAccContent.'+ contentActive).slideDown();

		btn.click(function(){
			var thisContent = $(this).closest(item).find(content);
			
			if(thisContent.hasClass(contentActive)){
				// Active content click hide this content
				$(this).removeClass(btnActive);
				thisContent.stop().slideUp().removeClass(contentActive);
			}
			else{
				// Hide all contents
				btn.removeClass(btnActive);
				content.stop().slideUp().removeClass(contentActive);

				// Show active content
				thisContent.stop().slideDown().addClass(contentActive);
				$(this).addClass(btnActive);
			}
		});
	})();

	/*----------  Element click show this related content  ----------*/
	(function showRelatedContent() {
		var btn = $('.jsRelatedBtn');

		btn.click(function(){
			var activeText = $(this).attr('data-active-text'),
				contentId = $(this).attr('data-content-id'),
				content = $('#' + contentId),
				defaultText = $(this).attr('data-text');

			if(content.css('display')  == 'none'){
				content.stop().slideDown();
				$(this).html(activeText);
			}
			else{
				content.stop().slideUp();
				$(this).html(defaultText);
			}
		});
	})();

	/*----------  Menu  ----------*/
	(function menu(){
		var btn = $('.jsToggleMenuBtn'),
			menu = $('.jsMenu');

		btn.click(function() {
			menu.stop().slideToggle();
		});
	})();
	
});