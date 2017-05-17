$(function(){
  console.log('loaded')
  $('.button-3d').each(function(){
    $(this).unbind().click(function(){
      let val = $(this).val();
      let name = $(this).attr('name');
      console.log(name)
      changeModalTitle();
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

function changeModalTitle() {
  let title = 'Please choose your payment options for '  + name;
  $('.modal-title').text(title);
}

function removeEmail() {
  $('#modal-contact').remove();
}

function showDownloadDiv() {
  $('#download-div').slideDown('slow');
}