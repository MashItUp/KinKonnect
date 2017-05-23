$( document ).ready(function() {
	// Site-heading fade in and up
	$('.animated fadeInUp').addClass('animated fadeInUp');

	$('#heading').click(function(e){    
		$('.aboutContent').fadeIn('slow');
	});

});
