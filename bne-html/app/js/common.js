$(document).ready(function () {

   //slider
   $('.checkout-item__slider').slick(getSliderSettings());

   //slider  slickLightbox
   $('.checkout-item__slider').slickLightbox({
      src: 'data-image-src',
      itemSelector: '.checkout-item__slide',
      background: 'rgba(0, 0, 0, .7)'
   });

   //datepicker
   $('.datepicker').datepicker({
      format: 'mm/dd/yyyy',
   });
   $('.datepicker').datepicker("setDate", new Date());
   let arrival = new Date();
   arrival.setDate(arrival.getDate() - 1);

   let departure = new Date();
   departure.setDate(departure.getDate() + 1);
   $('[data-chosedate="default"]').datepicker();

   $('[data-chosedate="arrival"]').datepicker({
      startDate: arrival
   });
   $('[data-chosedate="departure"]').datepicker({
      startDate: departure
   });

   // fix departure_Date >= arrival_Date
   $('[data-chosedate="arrival"]').change(function () {
      let depart = $(this).datepicker('getDate');
      depart.setDate(depart.getDate() + 1);
      $('[data-chosedate="departure"]').datepicker('setStartDate', depart);
      $('[data-chosedate="departure"]').datepicker('setDate', depart);
   });

   //	increase and decrease number input  
   $('.input-number button').on('click', function () {
      let inputNumber = $(this).parent().parent().children('input');
      if ($(this).hasClass('input-number__plus') && inputNumber.get(0).value >= 0) {
         inputNumber.get(0).value++;
      } else if ($(this).hasClass('input-number__minus') && inputNumber.get(0).value > 0) {
         inputNumber.get(0).value--;
      } else {
         inputNumber.get(0).value = 0;
      }
   });
});

//View mode
function setTabsView(element, event) {
   event.preventDefault();
   if (!$(element).hasClass('active')) {
      let activeTabId = $('.checkout-tabs ul a.active').first().attr('id');

      $('.view-toggler__btn').removeClass('active');
      $(element).addClass('active');

      $('.checkout-tabs').addClass('active');
      $('.checkout-tab-content').removeClass('active');
      $('.checkout-tab-content[data-tab-id=' + activeTabId + ']').addClass('active');

      //slick slider reinitialize
      $('.checkout-item__slider').slick('unslick');
      $('.checkout-item__slider').slick();
   }
}
function setListView(element, event) {
   event.preventDefault();
   if (!$(element).hasClass('active')) {
      $('.view-toggler__btn').removeClass('active');
      $(element).addClass('active');
      $('.checkout-tabs').removeClass('active');
      $('.checkout-tab-content').addClass('active');

      //slick slider reinitialize
      $('.checkout-item__slider').slick('unslick');
      $('.checkout-item__slider').slick();
   }
}

//tabs
function tabToggle(element, event) {
   event.preventDefault();
   if (!$(element).hasClass('active')) {
      $('.checkout-tabs a.active').removeClass('active');
      $(element).addClass('active');
      $('.checkout-tab-content').removeClass('active');
      $('.checkout-tab-content[data-tab-id=' + $(element).attr('id') + ']').addClass('active');

      //slick slider reinitialize
      $('.checkout-item__slider').slick('unslick');
      $('.checkout-item__slider').slick();
   }
}

//accordion
function accordionToggle(element, event) {
   event.preventDefault();
   $(element).toggleClass('active');
   $('.checkout-item__accordion[data-accordion-id=' + $(element).attr('id') + ']').slideToggle('fast');
}

function getSliderSettings() {
   return {
      slidesToShow: 1,
      dots: true,
      arrows: false
   }
}