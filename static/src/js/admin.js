import 'bootstrap-table/dist/bootstrap-table'
import 'bootstrap-table/dist/locale/bootstrap-table-zh-TW'

$(document).ready(function () {
    new bootstrap.Modal($('#infoModal'));
    new bootstrap.Modal($('#instructionsModal'));
})

var instructionsModal = document.getElementById('instructionsModal')
instructionsModal.addEventListener('hide.bs.modal', function () {
    $('video').each(function () {
        this.pause();
        this.currentTime = 0;
    });
})