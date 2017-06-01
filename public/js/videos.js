let images = [],
    ytVids = ['lT-jChFTVK0',
              'TuM_mvZkgUg',
              '5tW3E5qVFB8',
              'QBGfmmwXpdY',
              'pQ9eBInocsY',
              'VBwIujo8CHA',
              '1kSlStEjxQM',
              '6AR486pYRM8',
              '_TDbtsgEJLc',
              '-b08RkL2SSo',
              'd-pnt4KOwfc',
              '7BacVU597mI',
              'M8j5vSUuuXo',
              'alJ9aKht1_k',
              'LO_oqoVQacc',
              'TOc2VAucb5I',
              '8xhyzcxLLfM',
              'Zq6v1sC1Lik',
              'd1oRfWKw69s',
              'Gy1z1z-nstE',
              '8kdUU-9RwLk',
              '4XVrzoCgGVk'],
    features = ['kiPo8G-Dsb0','6-zywkEqbtM','lh76nCh3kfs'],
    youtube = document.querySelectorAll('.youtube');
    //preload the images so the images don't load on fade
    (new Image()).src = 'https://image.ibb.co/k66H8F/science.jpg'; 
    (new Image()).src = 'https://image.ibb.co/icGjoF/testimonial.jpg';
    (new Image()).src = 'https://image.ibb.co/bHYKNa/demo.jpg';

// youtube video click handler
for (let i = 0; i < youtube.length; i++) {
  youtube[i].addEventListener('click', function(e){
    e.preventDefault();
    let oldEmbed = $('.iframe-container').attr('data-video');
    let embed = this.getElementsByTagName('img')[0].dataset.embed;
    let source = 'https://www.youtube.com/embed/' + embed + '?rel=0&showinfo=1';
    let imgSrc = 'https://img.youtube.com/vi/' + oldEmbed + '/hqdefault.jpg';
    $('iframe').attr('src', source);
    $('.iframe-container').attr('data-video', embed);
    this.getElementsByTagName('img')[0].src = imgSrc;
  });
}


$(document).ready(function(){
  // push the three main images item to array
  $('.main-images').each(function(i, item) {
    images.push(item);
  });
  // fade in fade out each image recursively
  cycleDiv(images[0], images[1], images[2]);
  // click handler and animation for modal opening
  $('.watch-now-button').each(function(i, item){
    $(item).click(function() {
      stopped = true;
      $("#videoModal").off("webkitAnimationEnd oanimationend msAnimationEnd animationend").css("display", "block");
      loadIframe(this.dataset.embed);
      mainImageLoader();
    });
  });
  // modal close handler
  $('.modal-close').click(function(){
    $('#videoModal').addClass('unfoldOut');
    $('#videoModal').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
      $('#videoModal').removeClass('unfoldOut');
      $('#videoModal').css('display', 'none');
    });
  });

});

function loadIframe(embed) {
  // change iframe source in the main container
  let source = 'https://www.youtube.com/embed/' + embed;
  $('iframe').attr('src', source);
  $('.iframe-container').attr('data-video', embed);
}

function swapIframe(newEmbed, el) {
  // swap iframe container picture and embed with the new element
  let currentVid = document.getElementById('iframe-container').dataset.video;
  let source = 'https://www.youtube.com/embed/' + newEmbed;
  $('iframe').attr('src', source);
  $('.iframe-container').attr('data-video', newEmbed);
  el.childNodes[1].src = 'https://img.youtube.com/vi/' + currentVid + '/hqdefault.jpg'
}

function cycleDiv(item1, item2, item3) {
  // takes in the divs, and fade them
  $(item1).fadeIn(1500).delay(2000).fadeOut(1500, function(){
    $(item2).fadeIn(1500).delay(2000).fadeOut(1500, function(){
      $(item3).fadeIn(1500).delay(2000).fadeOut(1500, function(){
        cycleDiv(item1, item2, item3);
      });
    });
  });    
}

function mainImageLoader() {
  // load mobile grid or carousel image
  let winWidth = $(window).width();
  if(winWidth < 992) {
    loadMobileGrid(ytVids, features, 'firstLoad');
  } else {
    loadCarouselImage(ytVids, features);
  }
}

function loadCarouselImage(vids, mainVids) {
  // load carousel image
  let nowPlaying = $('.iframe-container').attr('data-video');
  let newVids = removeStringFromArray(nowPlaying, mainVids).concat(vids);
  let carouselA = $('.carousel-a');
  for(let i = 0; i < carouselA.length; i++) {
    let source = 'https://img.youtube.com/vi/' + newVids[i] + '/hqdefault.jpg';
    carouselA[i].dataset.embed = newVids[i];
    carouselA[i].setAttribute('href', '#');
    carouselA[i].setAttribute('onclick', 'swapIframe("' + newVids[i] + '", this)');
    carouselA[i].childNodes[1].src = source;
  }
}

function loadMobileGrid(vids, mainVids, initialLoad) {
  //  load grid for mobile display
  let n = 0;
  let nowPlaying = $('.iframe-container').attr('data-video');
  let newVids = removeStringFromArray(nowPlaying, mainVids).concat(vids);
  let gridImages = document.querySelectorAll('.grid-images');
  // onclick handler for image
  $('#image-loader').on('click', function(){
    for(let i = 0; i < gridImages.length; i++) {
      gridImages[i].src = 'https://img.youtube.com/vi/' + newVids[n] + '/hqdefault.jpg';
      $(gridImages[i]).attr('data-embed', newVids[n])
      n++;
    }
    // at the end of the vids
    if (n >= 24) {
      $('#image-loader').remove();
      $('.video-footer-h2').css('display', 'block');
    }
  });

  if (initialLoad) {
    for(let i = 0; i < gridImages.length; i++) {
      gridImages[i].src = 'https://img.youtube.com/vi/' + newVids[n] + '/hqdefault.jpg';
      $(gridImages[i]).attr('data-embed', newVids[n])
      n++;
    }
  }
}

function removeStringFromArray(str, array) {
  // remove item from array
  let index = array.indexOf(str);
  if (index > -1) {
      array.splice(index, 1);
  }
  return array
}

// check if the item is first
Array.prototype.isFirst = function(item) {
  return this[0] === item;
}
