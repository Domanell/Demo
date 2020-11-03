$(document).ready(function() {

	//menu
	$(".navigation-button").click(function() {
		$(".navigation").toggleClass("active");
		$(this).find("i").toggleClass("fa-times");
	});
	$(".navigation__overlay").click(function() {
		$(".navigation").removeClass("active");
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

	//datepicker
	$('.datepicker').datepicker({
		format: 'mm/dd/yyyy',
	});
	$('.datepicker').datepicker("setDate", new Date());
	var arrival = new Date();
	arrival.setDate(arrival.getDate() - 1);

	var departure = new Date();
	departure.setDate(departure.getDate() + 1);
	$('[data-chosedate="default"]').datepicker();

	$('[data-chosedate="arrival"]').datepicker({
		startDate: arrival
	});
	$('[data-chosedate="departure"]').datepicker({
		startDate: departure
	});

	// fix departure_Date >= arrival_Date
	$('[data-chosedate="arrival"]').change(function() {
		var depart = $(this).datepicker('getDate');
		depart.setDate(depart.getDate() + 1);
		$('[data-chosedate="departure"]').datepicker('setStartDate', depart);
		$('[data-chosedate="departure"]').datepicker('setDate', depart);
	});

	//checkout radiobutton tabs
	$('.tab-link').click(function(event) {
		$('.checkout-payment__tab').hide();
		$($(this).attr('value')).show();
	});
	//checkout accordion
	$( '.checkout-form__guest-button' ).click(function() {
		$('.checkout-form__guest').slideToggle( 'slow');
	});
	
	//checkout add guest
	$('.checkout-form__add-guest').click(function(event) {
		let $clone = $($(this)).prev().clone();
		$clone.find('input').val('');
		$clone.insertBefore($(this));
	});
});