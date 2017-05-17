$(document).ready(function(){
  //$('#finance-modal').modal('show');
  $('.button-3d').each(function(){
    $(this).unbind().click(function(){
      let val = $(this).val();
      let name = $(this).attr('name');
      changeModalTitle(name);
      $('.dropdown').click(function(){
        $('.payment-options').unbind().click(function(){
          console.log('clicked')
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
  $('#finance-modal-email').click(function (){
    $('#email-modal').modal('show');
    return false;
  });
});

$(document).ready(function(){
  let checkFunctionExist = setInterval(function() {
    if (typeof emailValidator === 'function') {
      emailValidator();
      clearInterval(checkFunctionExist);
    }
  }, 100);
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

function emailValidator() {
  $('#contact_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
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
                      notEmpty: {
                          message: 'Please enter a message'
                      }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            //$('#success_message').slideDown({ opacity: "show" }, "slow"); //Show success message ...
            //$('#error_message').slideDown({opacity:'show'}, 'slow') // show error message
            // load spinner

            //$('#contact_form').data('bootstrapValidator').resetForm(); // reset the form fields???

            // Prevent form submission
            e.preventDefault();
            // Get the form instance
            let $form = $(e.target);
            let formData = $(e.target).serialize()
            // Get the BootstrapValidator instance
            let bv = $form.data('bootstrapValidator');
            // Use Ajax to submit form data
            $.ajax({
              url: '/send-email',
              type:'POST',
              data: formData,
              dataType:'json',
              success: function(response) {
                if (response.error) {
                  // show error message
                  $('#error_message').slideDown({opacity:'show'}, 'slow');
                } else {
                  // show ok message
                  $('#success_message').slideDown({ opacity: "show" }, "slow")
                  console.log('yay it went through!');
                }
              }
            });
        });
}
