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