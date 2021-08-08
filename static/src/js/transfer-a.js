let infoModal = new bootstrap.Modal($('#infoModal'));
let liveToast = new bootstrap.Toast($('#liveToast'));

function submit_from() {
    const pwd = $('#pwd');
    const pwd_confirm = $('#pwd-confirm');
    const stu_name = $('#stu-name')
    const stu_id = $('#stu-id')
    const stu_tel = $('#stu-tel')
    if (pwd.val() != "" && pwd.val() === pwd_confirm.val()) {
        if (stu_name.val() != "" && stu_id.val() != "" && stu_tel.val() != "") {
            var form = $('#form');
            var field = $('<input></input>');
            field.attr('type', 'hidden');
            field.attr('name', pwd.attr('name'));
            field.attr('value', pwd.val())
            form.append(field)
            $('#form').submit()

            const loading = $('<div class="loading">Loading&#8230;</div>');
            $('body').prepend(loading);
            infoModal.hide()
        } else {
            stu_name.addClass('is-invalid')
            stu_id.addClass('is-invalid')
            stu_tel.addClass('is-invalid')
            infoModal.hide()
            liveToast.show()
        }

    } else {
        pwd.addClass('is-invalid')
        pwd_confirm.addClass('is-invalid')
    }
}

$('#send').click(function () {
    submit_from();

    // /* 使用 post() 函數方法提交表單內容，但在此處必須使用 formData 提交「file」，因此不使用該方法。 */
    // function post(path, parameters) {
    //     var form = $('<form></form>');
    //
    //     form.attr("method", "post");
    //     form.attr("action", path);
    //     form.attr("enctype", "multipart/form-data");
    //
    //     $.each(parameters, function (key, value) {
    //         var field = $('<input></input>');
    //
    //         field.attr("type", "hidden");
    //         field.attr("name", key);
    //         field.attr("value", value);
    //
    //         form.append(field);
    //     });
    //
    //     $(document.body).append(form);
    //     form.submit();
    // }
    //
    // const formData = new FormData(document.querySelector('#form'));
    // const parameters = {};
    // formData.forEach(function (value, key) {
    //     parameters[key] = value;
    // });
    // if (typeof (url_send) != 'undefined') {
    //     if (url_send == '/submit-create') {
    //         parameters['pwd'] = pwd;
    //         parameters['pwd_confirm'] = pwd_confirm;
    //     }
    //     post(url_send, parameters)
    // }
})

$('#pwd, #pwd-confirm').keypress(function (e) {
    const KEY_ENTER = 13
    if (e.which === KEY_ENTER) {
        submit_from();
    }
})

$(document).ready(function () {

    if (typeof (url_send) != 'undefined') {
        $('#form').attr('action', url_send)
    }

    if (typeof (db_info) != 'undefined' && typeof (db_trans) != 'undefined') {
        if (Object.keys(db_info).length) {
            $('#stu-name').val(db_info['stu_name'])
            $('#stu-id').val(db_info['stu_id'])
            $('#stu-tel').val(db_info['stu_tel'])
            if (db_info['edu_sys'] != '') {
                $(`input[name='edu-sys'][value=${db_info['edu_sys']}]`).prop('checked', true)
            }
            if (db_info['campus'] != '') {
                $(`input[name='campus'][value=${db_info['campus']}]`).prop('checked', true)
            }
            $('#department').val(db_info['department'])
            $('#grade').val(db_info['grade'])
            $('#class').val(db_info['class'])
            if (db_info['stu_type'] != '') {
                $(`input[name='stu-type'][value=${db_info['stu_type']}]`).prop('checked', true)
            }
            $('#stu-type-school').val(db_info['stu_type_school'])
            $('#stu-type-department').val(db_info['stu_type_department'])
            $('#stu-type-other').val(db_info['stu_type_other'])
            $.each(db_trans, function (item, index) {
                $(`input[name='sbj-${item + 1}-getTerm']`).val(index['get_term'])
                $(`input[name='sbj-${item + 1}-getName']`).val(index['get_name'])
                $(`input[name='sbj-${item + 1}-getCredit']`).val(index['get_credit'])
                $(`input[name='sbj-${item + 1}-getScore']`).val(index['get_score'])
                $(`input[name='sbj-${item + 1}-setTerm']`).val(index['set_term'])
                $(`input[name='sbj-${item + 1}-setName']`).val(index['set_name'])
                $(`input[name='sbj-${item + 1}-setCredit']`).val(index['set_credit'])
                $(`select[name='sbj-${item + 1}-setType']>option[value='${index['set_type']}']`).prop('selected', true)
                $(`select[name='sbj-${item + 1}-setVerify']>option[value='${index['set_verify']}']`).prop('selected', true)
            })
        }
    }
})
