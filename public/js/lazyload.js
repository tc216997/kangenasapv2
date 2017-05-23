let youtube = document.querySelectorAll('.youtube');
for (let i = 0; i < youtube.length; i++) {
  //createImage(youtube[i].dataset.embed, youtube[i]);
  youtube[i].addEventListener('click', function() {
    let mainPlayer = document.getElementById('main-ytplayer');
    let iframe = document.createElement('iframe');
    let temp = '';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', 'https://www.youtube.com/embed/' + this.dataset.embed + '?rel=0&showinfo=0&autoplay=1');
    iframe.className = "gradient-border";
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

function createImage(embed,div) {
  let source = 'https://img.youtube.com/vi/' + embed + '/hqdefault.jpg';
  let image = new Image();
  image.src = source;
  div.appendChild(image);
}