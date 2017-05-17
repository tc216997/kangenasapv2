$(function(){
  console.log('loaded')
  $('.button-3d').each(function(){
    $(this).unbind().click(function(){
      let val = $(this).val();
      let name = $(this).attr('name');
      changeModalTitle(name);
      $('.dropdown').click(function(){
        $('.payment-options').unbind().click(function(){
          let file = val + '-' + $(this).attr('data-payment');
          removeEmail();
          showDownloadDiv();
          console.log('/pdf?filename=' +  file)
          $('#machine-pdf').attr('href', '/pdf?filename=' +  file)
        });
      });
    });
  });
});

function changeModalTitle(machine) {
  let title = 'Please choose your payment options for '  + machine;
  console.log(machine)
  console.log(title);
  $('.modal-title').text(title);
}

function removeEmail() {
  $('#modal-contact').remove();
}

function showDownloadDiv() {
  $('#download-div').slideDown('slow');
}