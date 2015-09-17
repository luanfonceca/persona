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
});