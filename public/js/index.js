$(document).ready(function(){
  let pModal = $('#index-yt-modal'), 
      pModalBtns = $('.index-yt-modal-btns'),
      textModal = $('#index-text-modal'),
      textModalBtns = $('.index-text-modal-btns');
      
  pModalBtns.on('click', function(){
    //prevent modal from closing by clicking the outside area or keyboard
    $(pModal).modal({backdrop: 'static', keyboard: false})
    addIframe(this.dataset.embed)
    // unfoldIn is the modal animation class
    pModal.addClass('unfoldIn').modal('show');
  });

  textModalBtns.on('click', function(){
    //prevent modal from closing by clicking the outside area or keyboard
    $(textModal).modal({backdrop: 'static', keyboard: false});
    textModal.addClass('unfoldIn').modal('show');

    if (this.dataset.embed === 'article1') {
      $('#modal-article1').removeClass('display-none');
    } 
    if (this.dataset.embed === 'article2') {
      $('#modal-article2').removeClass('display-none');
    } 
    if (this.dataset.embed === 'article3') {
      $('#modal-article3').removeClass('display-none');
    }
  });

  // on modal show event
  pModal.on('show.bs.modal', function(){
    onModalOpen(pModal, $('#index-modal-yt-close'), document.getElementById('index-yt-modal'));
  });

  textModal.on('show.bs.modal', function() {
    onModalOpen(textModal, $('#index-modal-text-close'), document.getElementById('index-text-modal'));
  });

  textModal.on('shown.bs.modal', function(){
    // scroll the modal window to top of element
    $(textModal).animate({ scrollTop: 0 }, 'slow');
  });
  // after the modal is hidden from sight
  pModal.on('hidden.bs.modal', function() {
    onModalHidden(pModal, $('#index-modal-yt-close'));
  });
  
  textModal.on('hidden.bs.modal', function() {
    onModalHidden(textModal, $('#index-modal-text-close'));
    if($('#modal-article1').attr('class') !== 'display-none') {
      $('#modal-article1').addClass('display-none');
    } 
    if ($('#modal-article2').attr('class') !== 'display-none') {
      $('#modal-article2').addClass('display-none');
    } 
    if ($('#modal-article3').attr('class') !== 'display-none') {
      $('#modal-article3').addClass('display-none');
    }
  });
});


function addIframe(embed) {
  // add iframe with source to iframe-container
  $('#iframe-container').html('');
  let iframe = $('<iframe id="index-modal-iframe" src="#" allowfullscreen></iframe>')
  let source = 'https://www.youtube.com/embed/' + embed;
  $(iframe).attr('src', source);
  $('#iframe-container').append(iframe);  
}

function onModalHidden(targetModal, modalCloseBtn) {
    targetModal.removeClass('unfoldOut');
    // take off event animation binding for modal animation event
    targetModal.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
    // take off handler for close button
    modalCloseBtn.off('click');
}

function onModalOpen(targetModal, modalCloseBtn, jsModalObject) {
    modalCloseBtn.one('click', function(){
      //on end of modal animation event
      $(targetModal).on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
        targetModal.modal('hide');
      });
      targetModal.removeClass('unfoldIn').addClass('unfoldOut');
    });
    targetModal.on('click', function(e) {
      // close modal if clicked outside of modal
      // overridding the modal backdrop static essentially
      if (e.target === jsModalObject) {
        $(targetModal).on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
        targetModal.modal('hide');
        });
        targetModal.removeClass('unfoldIn').addClass('unfoldOut');
      }
    });
}