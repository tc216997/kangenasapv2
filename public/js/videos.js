let ytVids = ['lT-jChFTVK0',
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
    features = ['kiPo8G-Dsb0','6-zywkEqbtM','lh76nCh3kfs'];
    //preload images
    (new Image()).src = '../img/science.jpg'; 
    (new Image()).src = '../img/testimonial.jpg';
    (new Image()).src = '../img/demo.jpg';


$(document).ready(function(){
  let images = $('.main-images');
  cycleDiv(images[0], images[1], images[2]);

  $('.watch-now-button').each(function(i, item){
    $(item).click(function() {
      $('#videoModal').css('display', 'block');
      $('.iframe-container').append(createIframe($(this).attr('data-embed')));
      loadCarouselImages(ytVids, features);
      loadMobileGrid(ytVids, features, true);
      loadCarouselItems();
      $('.main-images').stop(true);
    });
  });
  
  //$('.iframe-container').append(createIframe(features[0]));
  //carousel images
  //carousel logic
});

function cycleDiv(item1, item2, item3, stop) {
  $(item1).fadeIn(1500).delay(5000).fadeOut(1500, function(){
    $(item2).fadeIn(1500).delay(5000).fadeOut(1500, function(){
      $(item3).fadeIn(1500).delay(5000).fadeOut(1500, function(){
        cycleDiv(item1, item2, item3);
      });
    });
  });    
}


/**mobile lazy load**/
/*
let youtube = document.querySelectorAll('.youtube');
for (let i = 0; i < youtube.length; i++) {
  //createImage(youtube[i].dataset.embed, youtube[i]);
  youtube[i].addEventListener('click', function() {
    let mainPlayer = document.getElementById('main-ytplayer');
    let iframe = document.createElement('iframe');
    let temp = '';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', 'https://www.youtube.com/embed/' + this.dataset.embed + '?rel=0&showinfo=0&autoplay=1');
    // change image to clicked img src to mainImgSrc
    this.childNodes[3].src = 'https://img.youtube.com/vi/' + mainPlayer.dataset.embed + '/hqdefault.jpg';
    temp = mainPlayer.dataset.embed;
    mainPlayer.innerHTML = '<div class="text-center iframe-spinner" id="iframe-spinner"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>';
    mainPlayer.appendChild(iframe);
    
    mainPlayer.setAttribute('data-embed', this.dataset.embed);
    this.setAttribute('data-embed', temp);
    //console.log('main player: ', mainImgSrc);
    //console.log('side player div: ', clickedImgSrc)
  });    
}
*/

function loadCarouselItems() {
  $('.carousel .item').each(function(){
    var next = $(this).next();
    if (!next.length) {
      next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));
    for (var i=0;i<2;i++) {
      next = next.next();
      if (!next.length) {
        next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));
    }
  });
}

function createCarouselImage(embed, first) {
  let outerDiv = $('<div></div>').addClass('item');
  if (first) {
    outerDiv.addClass('active');
  }
  let innerDiv = $('<div class="col-md-3 col-lg-3 col-sm-3"></div>')
  let btn = $('<a href="#"></a>');
  let image = $('<img class="img-responsive">');
  let source = 'https://img.youtube.com/vi/' + embed + '/hqdefault.jpg';
  image.attr('src', source);
  btn.append(image);
  innerDiv.append(btn);
  outerDiv.append(innerDiv);
  return outerDiv;
}

function createIframe(embed) {
  let iframe = $('<iframe frameborder=0 allowfullscreen></iframe>');
  let source = 'https://www.youtube.com/embed/' + embed;
  iframe.attr('src', source);
  $('.iframe-container').attr('data-video', embed);
  return iframe;
}

function loadCarouselImages(vids, mainVids) {
  // get vids that loaded
  let nowPlaying = $('.iframe-container').attr('data-video');
  let newVids = removeStringFromArray(nowPlaying, mainVids).concat(vids);
  newVids.map(function(x){
    if(newVids.isFirst(x)) { 
      $('.carousel-inner').append(createCarouselImage(x, true));
    } else {
      $('.carousel-inner').append(createCarouselImage(x, false));
    }
  });
}

function loadMobileGrid(vids, mainVids, initialLoad) {
  let n = 0;
  let nowPlaying = $('.iframe-container').attr('data-video');
  let newVids = removeStringFromArray(nowPlaying, mainVids).concat(vids);
  let gridImages = document.querySelectorAll('.grid-images');

  $('#image-loader').on('click', function(){
    for(let i = 0; i < gridImages.length; i++) {
      gridImages[i].src = 'https://img.youtube.com/vi/' + newVids[n] + '/hqdefault.jpg';
      $(gridImages[i]).attr('data-embed', newVids[n])
      n++;
    }
    if (n >= 24) {
      $('#image-loader').remove();
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
  let index = array.indexOf(str);
  if (index > -1) {
      array.splice(index, 1);
  }
  return array
}

Array.prototype.isFirst = function(item) {
  return this[0] === item;
}