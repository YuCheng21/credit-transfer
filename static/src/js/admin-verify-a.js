$(document).ready(function () {
    console.log('ok')
    $('#stu-name').attr('disabled', true);
    $('#stu-id').attr('disabled', true);
    $('#stu-tel').attr('disabled', true);
    $(`input[name='edu-sys']`).attr('disabled', true);
    $(`input[name='campus']`).attr('disabled', true);
    $('#department').attr('disabled', true);
    $('#grade').attr('disabled', true);
    $('#class').attr('disabled', true);
    $(`input[name='stu-type']`).attr('disabled', true);
    $('#stu-type-school').attr('disabled', true);
    $('#stu-type-department').attr('disabled', true);
    $('#stu-type-other').attr('disabled', true);
    $.each(db_trans, function (item, index) {
        $(`input[name='sbj-${item + 1}-getTerm']`).attr('disabled', true);
        $(`input[name='sbj-${item + 1}-getName']`).attr('disabled', true);
        $(`input[name='sbj-${item + 1}-getCredit']`).attr('disabled', true);
        $(`input[name='sbj-${item + 1}-getScore']`).attr('disabled', true);
        $(`input[name='sbj-${item + 1}-setTerm']`).attr('disabled', true);
        $(`input[name='sbj-${item + 1}-setName']`).attr('disabled', true);
        $(`input[name='sbj-${item + 1}-setCredit']`).attr('disabled', true);
        $(`select[name='sbj-${item + 1}-setType']`).attr('disabled', true);
        $(`select[name='sbj-${item + 1}-setVerify']`).attr('disabled', false);
    })
    $(`input[name='file']`).attr('disabled', true);
})

function post(path, parameters) {
    var form = $('<form></form>');

    form.attr("method", "post");
    form.attr("action", path);
    form.attr("enctype", "multipart/form-data");

    $.each(parameters, function (key, value) {
        var field = $('<input></input>');

        field.attr("type", "hidden");
        field.attr("name", key);
        field.attr("value", value);

        form.append(field);
    });

    $(document.body).append(form);
    form.submit();
}


$('#admin-send').click(function () {
    const parameters = {};
    $('select.sbj-set-verify').each(function (i, obj) {
        parameters[$(obj).attr('name')] = $(obj).val();
    })
    console.log(parameters)
    if (typeof (url_send) != 'undefined') {

        post(url_send, parameters)
    }
})