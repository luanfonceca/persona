function showProgressbar(form) {
  var progressbar = $('#email-feedback-progress-bar-template').html();
  form.find('.form-feedback').addClass('active').removeClass('hide');
  form.find('.form-feedback').html(progressbar);
}

function showMessage(type, message){
  var message = Mustache.to_html($('#email-feedback-message-template').html(), {
    'type': type,
    'message': message,
  });
  var feedback = $('.form-feedback.active');
  var form = feedback.parent();

  feedback.removeClass('active').html(message);
  form.find('.form-control').val('');
}

function sendEmail(email, name, subject, message, attachments){
  var attachments = attachments || [];
  var toEmail = 'luanfonceca@gmail.com';
  var toName = 'luan Fonseca';

  $.ajax({
    type: 'POST',
    url: 'https://mandrillapp.com/api/1.0/messages/send.json',
    data: {
      'key': 'B9Ny1dKD1C2b_YZH-yT8TA',
      'message': {
        'from_email': email,
        'from_name': name,
        'headers': {
          'Reply-To': email
        },
        'subject': subject,
        'html': message,
        'auto_text': true,
        'to': [
          {
            'email': toEmail,
            'name': toName,
            'type': 'to'
          }
        ],
        'attachments': attachments
      },
    }
  })
  .done(function(response) {
    if (!response[0].reject_reason) {
      showMessage('success', 'Mensagem enviada com sucesso!');
    } else {
      showMessage('danger', response[0].reject_reason);
    }
  })
  .fail(function(response) {
    showMessage('danger', 'Não conseguimos enviar seu Email, verifique se preencheu tudo corretamente.');
  });
}

$(function() {
  $('.form-contact').submit(function(e) {
    e.preventDefault();
    var self = $(this);

    var name = self.find('[name="name"]').val();
    var email = self.find('[name="email"]').val();
    var phone = self.find('[name="phone"]').val();
    var message = Mustache.to_html($('#email-template').html(), {
      'name': name,
      'email': email,
      'phone': phone,
      'message': self.find('[name="message"]').val(),
    });

    var subject = undefined;
    if (self.parents('#contato').length) {
      subject = 'Contato Persona';
    } else if (self.parents('#parceiros').length) {
      subject = 'Parceiros Persona';
    } else if (self.parents('#recrutamento').length) {
      subject = 'Regrutamento Persona';
    }

    var attachment = {};
    if(self.find('[name="attachment"]').val()){
      var file = self.find('[name="attachment"]')[0].files[0];
      attachment.name = file.name;
      attachment.type = file.type;

      var reader = new FileReader();
      reader.onload = function(event) {
        attachment.content = btoa(event.target.result);
        showProgressbar(self);
        sendEmail(email, name, subject, message, [attachment]);
      }
      reader.readAsBinaryString(file);
    } else {
      showProgressbar(self);
      sendEmail(email, name, subject, message);
    }
  });

  // Animations
  var pageHeight = $(window).height();
  var missionsHeight = $("#descricao-direita").offset().top;
  var customersHeight = $("#para-quem").height();
  var solutionsHeight = $("#o-que-fazemos").height();
  var onAnimationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  var removeClasses = function() {
    $(".navbar-nav li.active").removeClass('active');
  };

  $(window).scroll(function(){
    if ($(window).scrollTop() > (missionsHeight - pageHeight / 1.5)) {
      var classes = 'animated fadeInDown';
      $('#descricao-direita #visao').addClass(classes).one(onAnimationEnd, function() {
        $('#descricao-direita #missao').addClass(classes).one(onAnimationEnd, function() {
          $('#descricao-direita #valores').addClass(classes);
        });
      });
    }
    if ($(window).scrollTop() > (customersHeight - pageHeight / 2)) {
      $('#clientes .cliente').addClass('animated fadeIn');
    }
    if ($(window).scrollTop() > (solutionsHeight - pageHeight / 2)) {
      $('#o-que-fazemos .pilar').addClass('animated fadeIn');
    }
  });

  $('.btn-anchor').click(function() {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top
      }, 1000);

      if ($(this).attr('data-toggle') == 'modal') {
        var modal = $(this).attr('data-target');
        $(modal).modal('show');
      }

      return false;
    }
  });

  $(".navbar-persona").affix({
    offset: {
      top: function(e) {
        return $(window).height() - $(e).height();
      }
    }
  });

  $('.navbar-toggle').click(function() {
    if (!$(this).hasClass('collapsed')) {
      return;
    };

    var height = $(".navbar-persona").height();
    var offsetTop = $(".navbar-persona").offset().top;
    var pageOffsetTop = $(window).scrollTop() + $(window).height();
    if ((offsetTop + height) > (pageOffsetTop - 100)) {
       $("html, body").animate({
        scrollTop: '100px'
      });
    }
  });
});