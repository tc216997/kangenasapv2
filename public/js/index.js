$(document).ready(function(){
  // on problem button click
  let pModal = $('#index-yt-modal') 
  let pModalBtns = $('.index-yt-modal-btns');
  pModalBtns.on('click', function(){
    let source = 'https://www.youtube.com/embed/' + this.dataset.embed;
    $('#index-modal-iframe').attr('src', source);
    $('#index-yt-modal').addClass('unfoldIn').modal('show');
  });
  // on modal show event
  $(pModal).on('show.bs.modal', function(){
    // create a one time click event handler for close button
    $('#index-modal-yt-close').one('click', function(){
      //on end of modal animation event
      $(pModal).on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
        pModal.modal('hide');
      });
      pModal.removeClass('unfoldIn').addClass('unfoldOut');
    });
  });
  // after the modal is hidden from sight
  pModal.on('hidden.bs.modal', function() {
    pModal.removeClass('unfoldOut');
    // take off event animation binding for modal animation event
    pModal.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
    // take off handler for close button
    $('#index-modal-yt-close').off('click');
  });
});