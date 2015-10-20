var EMAIL = 'luanfonceca@gmail.com';
var MESSAGE = '' +
  '<div class="alert alert-{{ status }}">' +
    '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
    '&nbsp;' +
    '{{ message }}' +
  '</div>';

function sendEmail(email, name, subject, message, attachments){
  var attachments = attachments || [];
  var to_email = 'luanfonceca@gmail.com';
  var to_name = 'luan Fonseca';

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
            'email': to_email,
            'name': to_name,
            'type': 'to'
          }
        ],
        'attachments': attachments
      },
    }
  })
  .done(function(response) {
    alert('We have sent your message!');
  })
  .fail(function(response) {
    alert('We were unable to send the message.');
  });
}

$(function() {
  $('.form-contact').submit(function(e) {
    e.preventDefault();
    var self = $(this);

    var subject = undefined;
    var attachment = {};
    var email = $('#email').val();
    var name = $('#name').val();
    var message = Mustache.to_html($('#email-template').html(), {
      'name': name,
      'email': email,
      'message': $('#message').val()
    });

    if (self.parents('#contato').length) {
      subject = 'Contato Persona';
    } else if (self.parents('#parceiros').length) {
      subject = 'Parceiros Persona';
    } else if (self.parents('#recrutamento').length) {
      subject = 'Regrutamento Persona';
    }

    if($('#attachment').val()){
      var file = $('#attachment')[0].files[0];
      attachment.name = file.name;
      attachment.type = file.type;

      var reader = new FileReader();
      reader.onload = function(event) {
        attachment.content = btoa(event.target.result);
        sendEmail(email, name, message, [attachment]);
      }
      reader.readAsBinaryString(file);
    } else {
      sendEmail(email, name, message);
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