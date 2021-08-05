$('#send').click(function () {
    $('#form').submit()
})

if (typeof (msg_flash) != 'undefined') {
    const alert = $('<div><i class="fas fa-exclamation-triangle me-2"></i>表單編號或表單密碼錯誤</div>');

    alert.addClass('alert');
    alert.addClass('alert-danger');

    $('#form-id').addClass('is-invalid')
    $('#pwd').addClass('is-invalid')

    $('#send').before(alert);
}

$('input').keypress(function (e) {
    const KEY_ENTER = 13
    if (e.which === KEY_ENTER){
        $('#form').submit()
    }
})