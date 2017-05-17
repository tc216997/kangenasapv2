$(document).ready(function(){
  $('.button-3d').each(function(){
    $(this).unbind().click(function(){
      let val = $(this).val();
      let name = $(this).attr('name');
      changeModalTitle(name);
      $('.dropdown').click(function(){
        $('.payment-options').unbind().click(function(){
          let file = val + '-' + $(this).attr('data-payment');
          hideEmail();
          showDownloadDiv();
          $('#machine-pdf').attr('href', '/pdf?filename=' +  file)
        });
      });
    });
  });
  $('#finance-modal').on('hidden.bs.modal', function(){
    showEmail();
    hideDownloadDiv();
  });
});

function changeModalTitle(machine) {
  let title = 'Please choose your payment options for '  + machine;
  $('.modal-title').text(title);
}

function showEmail(){
  $('#modal-contact').show();
}

function hideEmail() {
  $('#modal-contact').hide();
}

function showDownloadDiv() {
  $('#download-div').slideDown('slow');
}

function hideDownloadDiv() {
  $('#download-div').hide();
}