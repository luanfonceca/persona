var EMAIL = 'luanfonceca@gmail.com';
var MESSAGE = '' +
  '<div class="alert alert-{{ status }}">' +
    '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
    '&nbsp;' +
    '{{ message }}' +
  '</div>';

$(function() {
  $('.form-formspree').submit(function(e) {
    e.preventDefault();

    var self = $(this);
    self.find('.messages').html('');
    $.ajax({
      url: '//flipmail.co/api/J3d2zZdpiouOTUIi3vTi',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: self.serialize(),
      dataType: 'json',
      success: function(data) {
        var success = MESSAGE.replace('{{ status }}', 'success');
        success = success.replace('{{ message }}', 'Email enviado com sucesso, obrigado');
        self.find('.messages').html(success);
      },
      error: function(err) {
        var error = MESSAGE.replace('{{ status }}', 'danger');
        error = error.replace('{{ message }}', 'deu errado');
        self.find('.messages').html(error);
      }
    });
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
});