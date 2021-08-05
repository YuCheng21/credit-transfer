$(document).ready(function () {
    $('#form').attr('action', url_admin_login)
})

if (typeof (msg_flash) != 'undefined') {
    const alert = $(`<div><i class="fas fa-exclamation-triangle me-2"></i>${msg_flash}</div>`);

    alert.addClass('alert');
    alert.addClass('alert-danger');

    $('#username').addClass('is-invalid')
    $('#pwd').addClass('is-invalid')

    $('#send').before(alert);
}

$('#send').click(function () {
    send_form()
})

$('input').keypress(function (e) {
    const KEY_ENTER = 13
    if (e.which === KEY_ENTER) {
        send_form()
    }
})

function send_form() {
    const username = $('#username');
    const pwd = $('#pwd');
    if (username.val().length > 0 && pwd.val().length > 0) {
        $('#form').submit()
    }
}