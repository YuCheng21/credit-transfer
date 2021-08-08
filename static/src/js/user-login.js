$(document).ready(function () {
    $('#form').attr('action', url_send)
})

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
    const mail = $('#mail');
    const pwd = $('#pwd');
    if (mail.val().length > 0 && pwd.val().length > 0) {
        $('#form').submit()
    }
}

$('#register').click(function () {
    location.href = url_register;
})

if (typeof (msg_flash) != 'undefined') {
    const row = $('<div class="col-12"></div>')
    const alert = $(`<div><i class="fas fa-exclamation-triangle me-2"></i>${msg_flash}</div>`);

    alert.addClass('alert');
    alert.addClass('alert-danger w-100');

    $('#mail').addClass('is-invalid')
    $('#pwd').addClass('is-invalid')
    row.append(alert)

    $('#form > div:nth-child(3)').before(row);
}