$(document).ready(function(){
  let images = $('.main-images');
  cycleDiv(images[0], images[1], images[2]);
});

function cycleDiv(item1, item2, item3) {
  $(item1).fadeIn(1500).delay(7000).fadeOut(1500, function(){
    $(item2).fadeIn(1500).delay(7000).fadeOut(1500, function(){
      $(item3).fadeIn(1500).delay(7000).fadeOut(1500, function(){
        cycleDiv(item1, item2, item3);
      });
    });
  });
}

//preloading images
(new Image()).src = '../img/science.jpg'; 
(new Image()).src = '../img/testimonial.jpg';
(new Image()).src = '../img/demo.jpg';