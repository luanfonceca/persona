
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

// function sendEmail(email, name, subject, message, attachments){
function sendEmail(data){
  var toEmail = 'luanfonceca@gmail.com';
  var toName = 'Atendimento Persona Consult';
  var bccEmail = '168h.com.br@gmail.com';
  var bccName = 'Atendimento Persona Consult';

  data.append('to_name', toName);
  data.append('to_email', toEmail);
  data.append('bcc_name', bccName);
  data.append('bcc_email', bccEmail);

  $.ajax({
    url: 'https://statical.herokuapp.com/send/',
    type: 'POST',
    data: data,
    cache: false,
    processData: false,
    contentType: false
  }).done(function(response) {
    if (response.message == 'success') {
      showMessage('success', 'Mensagem enviada com sucesso!');
    } else {
      showMessage('danger', response.message);
    }
  }).fail(function(response) {
    showMessage('danger', 'Não conseguimos enviar seu Email, verifique se preencheu tudo corretamente.');
  });
}

function setEqualHeight(columns) {
  var tallestColumn = 0;
  columns.each(function() {
    currentHeight = $(this).height();
    if(currentHeight > tallestColumn) {
      tallestColumn  = currentHeight;
    }
  });

  columns.each(function() {
    currentHeight = $(this).height();
    difference = tallestColumn - currentHeight;

    $(this).find('button').css({
      'position': 'relative',
      'top': difference + 'px'
    });
  });

  $(this).height(tallestColumn);
}

$(function() {
  $('.form-contact').submit(function(e) {
    e.preventDefault();
    var self = $(this);

    var data = new FormData(self[0]);
    var name = self.find('[name="name"]').val();
    var email = self.find('[name="email"]').val();
    var phone = self.find('[name="phone"]').val();
    var message = Mustache.to_html($('#email-template').html(), {
      'name': name,
      'email': email,
      'phone': phone,
      'message': self.find('[name="message"]').val(),
    });
    data.set('message', message);

    showProgressbar(self);
    sendEmail(data);
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

  setEqualHeight($(".pilar"));
});