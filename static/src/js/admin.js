import 'bootstrap-table/dist/bootstrap-table'
import 'bootstrap-table/dist/locale/bootstrap-table-zh-TW'

$(document).ready(function () {
    new bootstrap.Modal($('#infoModal'));
    new bootstrap.Modal($('#passwdModal'));
    new bootstrap.Modal($('#instructionsModal'));
})

var instructionsModal = document.getElementById('instructionsModal')
instructionsModal.addEventListener('hide.bs.modal', function () {
    $('video').each(function () {
        this.pause();
        this.currentTime = 0;
    });
})

function submit_form() {
    const passwd = $('#passwd')
    const passwd_confirm = $('#confirm-passwd')

    if (passwd.val() != "" && passwd.val() === passwd_confirm.val()) {
        $('#form-pwd').submit()
    } else {
        passwd.addClass('is-invalid')
        passwd_confirm.addClass('is-invalid')
    }
}

$('#send-passwd').click(function () {
    submit_form()
})

$('#passwd, #confirm-passwd').keypress(function (e) {
    const KEY_ENTER = 13
    if (e.which === KEY_ENTER) {
        submit_form();
    }
})