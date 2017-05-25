let youtube = document.querySelectorAll('.youtube');
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
