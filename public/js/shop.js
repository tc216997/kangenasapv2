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
                      stringLength: {
                        min: 10,
                        max: 200,
                        message:'Please enter at least 10 characters and no more than 200'
                    },
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
            var $form = $(e.target);
            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');
            // Use Ajax to submit form data
            $.post($form.attr('action'), $form.serialize(), function(result) {
                console.log(result);
            }, 'json');
        });
}