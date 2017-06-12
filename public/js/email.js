let timeouts = [];

$(document).ready(function(){
  // click handler for dropdown payment options;  
  $('.button-3d').each(function(){
    $(this).unbind().click(function(){
      let val = $(this).val();
      let name = $(this).attr('name');
      changeModalTitle(name);
      $('.dropdown').click(function(){
        $('.payment-options').unbind().click(function(){
          let file = val + '-' + $(this).attr('data-payment');
          showDownloadDiv();
          $('#machine-pdf').attr('href', '/pdf?filename=' +  file)
        });
      });
    });
  });

  $('#finance-modal').on('hidden.bs.modal', function(){
    hideDownloadDiv();
  });

  $('#finance-modal-email').click(function (){
    $('#email-modal').modal('show');
    return false;
  });

  $('#email-modal').on('hidden.bs.modal', function() {
    $('#contact_form').data('bootstrapValidator').resetForm();
  });

});

$(document).ready(function(){
  // there was a problem on my end with the download speed;
  // emailValidator was being called before function exist
  // this make sure the function exist before calling the emailValidator function
  let checkFunctionExist = setInterval(function() {
    if (typeof emailValidator === 'function') {
      emailValidator();
      clearInterval(checkFunctionExist);
    }
  }, 100);
});

function changeModalTitle(machine) {
  // change the title text of the payment modal
  let title = 'Please choose your payment options for '  + machine;
  $('.modal-title').text(title);
}


function showDownloadDiv() {
  // show download div containing the pdfs
  $('#download-div').slideDown('slow');
}

function hideDownloadDiv() {
  // hide download div containing the pdfs
  $('#download-div').hide();
}

function clearTimeouts() {
  // remove the first id in the timeout array until there are none
  timeouts.map(item => {
    clearTimeout(item);
    timeouts.shift();
  });
}

function showSendingMsg() {
  $('#sending-icon').css('display', 'block');
  $('#sending-message').css('display', 'block');  
}

function hideSendingMsg() {
  $('#sending-icon').css('display', 'none');
  $('#sending-message').css('display', 'none');  
}

function successHandler() {
  hideSendingMsg();
  $('#success-icon').css('display', 'block');
  $('#success-message').css('display', 'block');
  let myTimeout = window.setTimeout(() => {
    $('.ajax-modal').css('display', 'none');
    $('#success-icon').css('display', 'none');
    $('#success-message').css('display', 'none');
    clearForm();
    window.clearTimeout(myTimeout);
    myTimeout = undefined;
  }, 4000);
}

function errorHandler(response) {
  hideSendingMsg();
  let errorMsg = response.responseJSON.status;
  $('#error-icon').css('display', 'block');
  $('#error-message').css('display', 'block');
  $('#error-message').html(errorMsg);
  window.setTimeout(() => {
    $('.ajax-modal').css('display', 'none');
    $('#error-icon').css('display', 'none');
    $('#error-message').css('display', 'none');
    $('#error-message').html('');
  }, 4000);
}

function hideErrorMsg() {
  $('#error-icon').css('display', 'none');
  $('#error-message').css('display', 'none');    
}

function emailValidator() {
  // email validator from boostrapValidator
  $('#contact_form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please enter your name'
                    }
                }
            },
            subject: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter a subject'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your email address'
                    },
                    emailAddress: {
                        message: 'Please enter a valid email address'
                    }
                }
            },
            message: {
                validators: {
                    stringLength: {
                        min: 10,
                    },                  
                      notEmpty: {
                          message: 'Please enter a message'
                      }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            // Prevent form submission
            e.preventDefault();
            // reset validator checks
            $('#contact_form').data('bootstrapValidator').resetForm();
            // Get the form instance
            let $form = $(e.target);
            let formData = $(e.target).serialize()
            // Get the BootstrapValidator instance
            let bv = $form.data('bootstrapValidator');
            // show sending message
            $('.ajax-modal').css('display', 'block');
            showSendingMsg();
            // Use Ajax to submit form data
            $.ajax({
              url: '/send-email',
              type:'POST',
              data: formData,
              dataType:'json',
              error: function(res) {
                errorHandler(res);
              },
              success: successHandler
            });
        });
}

//form autofill for test email
function autofillForm(){
  $('#form-name').val('Terry Chong<script>console.log(\'hello\')</script>');
  $('#form-email').val('tchong916@gmail.com');
  $('#form-subject').val('Hi i am interested in macarons <script>console.log(\'hello\')</script>');
  $('#form-message').val('What is the price of 1 box of macarons? <script>console.log(\'hello\')</script>');
}

function clearForm() {
  $('#form-name').val('');
  $('#form-email').val('');
  $('#form-subject').val('');
  $('#form-message').val('');
}