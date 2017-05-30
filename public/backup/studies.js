$(document).ready(function(){
  $('.panel').on('shown.bs.collapse', function(e){
      let selected = $(this);
      $(window).scrollTop(selected.offset().top);
  });
});