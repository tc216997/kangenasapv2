$(document).ready(function(){
  $('.panel').on('shown.bs.collapse', function(e){
      let selected = $(this)
      let container = $('body');

      $(window).scrollTop(selected.offset().top)
  });
});