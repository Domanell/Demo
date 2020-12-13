$(document).ready(function() {

	//menu
	$( ".navigation__button" ).click(function() {
		$( ".navigation" ).toggleClass( "active");
		$( this ).find("i").toggleClass( "fa-times");
		});
		$( ".navigation__overlay" ).click(function() {
			$( ".navigation" ).removeClass( "active");
		});

	//slider search result page
	$('.search-result__item-slider').slick({
		slidesToShow: 1,
		dots: true,
		arrows: false
	});
	//search result page slickLightbox
	$('.search-result__item-slider').slickLightbox({
		src: 'src',
		itemSelector: '.search-result__item-slide img',
		background: 'rgba(0, 0, 0, .7)'
	});
	//slider room page
	$('.room__slider-preview').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		dots: false,
		arrows: false,
		asNavFor: '.room__slider-thumb'
	});
	$('.room__slider-thumb').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		asNavFor: '.room__slider-preview',
		dots: false,
		arrows: true,
		focusOnSelect: true
	});

	//accordion
	$( ".checkout__accordion-title" ).click(function() {
		$(this).next().slideToggle( "slow");
		$(this).toggleClass( "active");
	});

	//show textarea
	$( ".button__add-texarea" ).click(function() {
		$(this).next().slideToggle( "slow");
	});

	//multiselect
	$('.js-multiselect_conditions').multiselect({
        right: '#js_multiselect_to_conditions',
        rightSelected: '#js_right_Selected_conditions',
        leftSelected: '#js_left_Selected_conditions',
    });
	$('.js-multiselect_facilities').multiselect({
        right: '#js_multiselect_to_facilities',
        rightSelected: '#js_right_Selected_facilities',
        leftSelected: '#js_left_Selected_facilities',
	});
	
	//tabs
	$('.checkout-payment__tab-links li a').click(function(event){
        event.preventDefault();
        $('.checkout-payment__tab-links li a').removeClass('active');
        $(this).addClass('active');
        $('.checkout-payment__tab').hide();
        $($(this).attr('href')).show();
    });

	//datepicker
	$('.datepicker').datepicker({
		format: 'mm/dd/yyyy',
	});
	$('.datepicker').datepicker("setDate", new Date());
	var arrival = new Date();
	arrival.setDate(arrival.getDate()-1);

	var departure = new Date();
	departure.setDate(departure.getDate()+1);
	$('[data-chosedate="default"]').datepicker();

	$('[data-chosedate="arrival"]').datepicker({
		startDate: arrival
	});
	$('[data-chosedate="departure"]').datepicker({
		startDate: departure
	});

	// fix departure_Date >= arrival_Date
	$('[data-chosedate="arrival"]').change(function(){
		var depart = $(this).datepicker('getDate');
		depart.setDate(depart.getDate() + 1);
		$('[data-chosedate="departure"]').datepicker('setStartDate', depart);
		$('[data-chosedate="departure"]').datepicker('setDate', depart);
	});

});

