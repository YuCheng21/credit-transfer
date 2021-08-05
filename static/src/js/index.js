if (typeof (msg_flash) != 'undefined') {
    $('.modal-body p').html(msg_flash)
    let infoModal = new bootstrap.Modal($('#infoModal'));
    infoModal.show();
}

$(document).ready(function () {
    $('button.btn-create').click(function () {
        location.href = url_create;
    })
    $('button.btn-read').click(function () {
        location.href = url_read;
    })
    $('button.btn-update').click(function () {
        location.href = url_update;
    })
    $('button.btn-delete').click(function () {
        location.href = url_delete;
    })
})
