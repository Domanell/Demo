$(document).ready(function() {
	//slider
	$('.book__slider').slick();
	//menu
	$( ".nav__trigger button" ).click(function() {
		$( ".nav" ).addClass( "active" );
	});
	$( ".nav__close button" ).click(function() {
		$( ".nav" ).removeClass( "active" );
	});
	$( ".nav__open button" ).click(function() {
		$( ".hotels-side" ).addClass( "active" );
	});
	$( ".hotels-side__close" ).click(function() {
		$( ".hotels-side" ).removeClass( "active" );
	});

	//date
	$('.datepicker').datepicker({
		format: 'dd/M'
	});
});