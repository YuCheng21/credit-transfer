$(document).ready(function () {
    $('#form').attr('action', url_send)
    new bootstrap.Modal($('#instructionsModal'));

})
var instructionsModal = document.getElementById('instructionsModal')
instructionsModal.addEventListener('hide.bs.modal', function () {
    $('video').each(function () {
        this.pause();
        this.currentTime = 0;
    });
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
    alert.addClass('alert-danger');
    row.append(alert)

    $('#mail').addClass('is-invalid')
    $('#pwd').addClass('is-invalid')

    $('#form > div:nth-child(3)').before(row);
}

