import flask
import config
import os
import api
from flask.views import MethodView

app = flask.Flask(__name__)
app.config.from_object(config.flask[config.setting['mode']])
app.template_folder = os.path.abspath('./static/dist')
app.static_folder = os.path.abspath('./static')


def user_login_required(func):
    def wrapper(*args, **kwds):
        mail = flask.session.get('mail')
        if mail is None:
            return flask.redirect(flask.url_for('user_login'))

        return func(*args, **kwds)

    wrapper.__name__ = func.__name__
    return wrapper


@app.route('/')
@app.route('/index')
@user_login_required
def index():
    title = '首頁'
    return flask.render_template('./template/index.html', **locals())


@app.route('/create')
@user_login_required
def create():
    title = '新增表單'
    return flask.render_template('./template/create.html', **locals())


@app.route('/read')
@user_login_required
def read():
    title = '查詢表單'
    return flask.render_template('./template/read.html', **locals())


@app.route('/update')
@user_login_required
def update():
    title = '修改表單'
    return flask.render_template('./template/update.html', **locals())


@app.route('/delete')
@user_login_required
def delete():
    title = '刪除表單'
    return flask.render_template('./template/delete.html', **locals())


@app.route('/transfer-a')
@user_login_required
def transfer_a():
    title = '學分抵修申請'
    url_send = 'submit_create'
    form_type = 'a'
    return flask.render_template('./template/transfer-a.html', **locals())


@app.route('/transfer-b')
@user_login_required
def transfer_b():
    title = '學分抵充申請'
    url_send = 'submit_create'
    form_type = 'b'
    return flask.render_template('./template/transfer-b.html', **locals())


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS


def upload_file(form_id):
    if 'file' in flask.request.files:
        uploaded_file = flask.request.files['file']
        if uploaded_file.filename != '':
            if uploaded_file and allowed_file(uploaded_file.filename):
                # from werkzeug.utils import secure_filename
                # filename = secure_filename(filename=uploaded_file.filename)
                filename = f"{form_id}.pdf"
                if not os.path.exists(app.config['UPLOAD_FOLDER']):
                    os.mkdir(app.config['UPLOAD_FOLDER'])
                uploaded_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                status_code = api.insert_file(form_id)


@app.route('/submit-create', methods=['POST'])
@user_login_required
def submit_create():
    if flask.request.method == 'POST':
        form_data = flask.request.values.to_dict()
        status_code, form_id = api.insert(form_data)
        if status_code == config.SUCCESS:
            upload_file(form_id)
            flask.session['status_code'] = status_code
            flask.session['form_id'] = form_id
            return flask.redirect(flask.url_for('status_create'))
        elif status_code == config.ERROR:
            flask.flash('表單提交失敗。')
            return flask.redirect(flask.url_for('index'))


@app.route('/transcript/<file_name>')
@user_login_required
def transcript(file_name):
    form_id = flask.session.get('form_id')
    if str(form_id) + '.pdf' == file_name:
        return flask.send_from_directory(app.config['UPLOAD_FOLDER'], f'{file_name}')
    username = flask.session.get('username')
    if username is not None:
        return flask.send_from_directory(app.config['UPLOAD_FOLDER'], f'{file_name}')
    flask.abort(404)


@app.route('/status_create')
@user_login_required
def status_create():
    title = '提交結果'
    status_code = flask.session.get('status_code')
    form_id = flask.session.get('form_id')
    status_code, db_admin = api.fetch_admin_info()
    account = db_admin['email']
    subject = '收到一件課程抵免表單'
    content_html = f'''
    <body>
    <div style="font-size: larger;">
        <h2>管理員您好：</h2>
        <p>課程抵免申請系統提交了一件新的申請表單（編號：{form_id}），請您撥空前往審核表單，謝謝。</p>
        <h3><a href="{flask.url_for('admin', _external=True)}">點擊前往管理員頁面</a></h3>
        <h4>此郵件由<a href="{flask.url_for('index', _external=True)}">【課程抵免申請系統】</a>自動發送，請勿直接回覆。</h4>
    </div>
    </body>
    '''
    try:
        api.send_mail(target_account=account, msg_subject=subject, msg_content_html=content_html)
    except:
        app.logger.error('Send e-mail failed')
    return flask.render_template('./template/status-create.html', **locals())


@app.route('/submit-update', methods=['POST'])
@user_login_required
def submit_update():
    if flask.request.method == 'POST':
        form_data = flask.request.values.to_dict()
        status_code = api.login(form_data)
        if status_code == config.ERROR:
            flask.flash('登入失敗，可能是表單編號或表單密碼錯誤')
            return flask.redirect(flask.url_for('update'))
        elif status_code == config.SUCCESS:
            status_code = api.editable(form_data)
            if status_code == config.ERROR:
                return flask.redirect(flask.url_for('read_only'))
            elif status_code == config.SUCCESS:
                status_code, db_info, db_trans = api.fetch_form(form_data)
                if status_code == config.SUCCESS:
                    flask.session['db_info'] = db_info
                    flask.session['db_trans'] = db_trans
                    return flask.redirect(flask.url_for('status_update'))


@app.route('/status_update')
@user_login_required
def status_update():
    db_info = flask.session.get('db_info')
    db_trans = flask.session.get('db_trans')
    flask.session['form_id'] = db_info['id']
    url_send = 'submit_status_update'
    if db_info['type'] == 'a':
        title = '學分抵修申請'
        form_type = 'a'
        return flask.render_template('./template/update-transfer-a.html', **locals())
    elif db_info['type'] == 'b':
        title = '學分抵充申請'
        form_type = 'b'
        return flask.render_template('./template/update-transfer-b.html', **locals())


@app.route('/submit-status-update', methods=['POST'])
@user_login_required
def submit_status_update():
    if flask.request.method == 'POST':
        form_id = flask.session.get('form_id')
        form_data = flask.request.values.to_dict()
        status_code = api.update_save(form_data, form_id)
        upload_file(form_id)
        if status_code == config.SUCCESS:
            return flask.redirect(flask.url_for('status_success'))
        elif status_code == config.ERROR:
            flask.flash('表單提交失敗。')
            return flask.redirect(flask.url_for('index'))


@app.route('/status-success')
@user_login_required
def status_success():
    title = '提交成功'
    message = '成功提交表單！'
    return flask.render_template('./template/status-success.html', **locals())


@app.route('/read-only')
@user_login_required
def read_only():
    title = '不可編輯'
    message = '該表單已審核完畢，處於不可編輯狀態！'
    danger = True
    return flask.render_template('./template/status-success.html', **locals())


@app.route('/submit-read', methods=['POST'])
@user_login_required
def submit_read():
    if flask.request.method == 'POST':
        form_data = flask.request.values.to_dict()
        status_code = api.login(form_data)
        if status_code == config.ERROR:
            flask.flash('登入失敗，可能是表單編號或表單密碼錯誤')
            return flask.redirect(flask.url_for('read'))
        elif status_code == config.SUCCESS:
            status_code, db_info, db_trans = api.fetch_form(form_data)
            if status_code == config.SUCCESS:
                flask.session['db_info'] = db_info
                flask.session['db_trans'] = db_trans
                return flask.redirect(flask.url_for('status_read'))


@app.route('/status_read')
@user_login_required
def status_read():
    db_info = flask.session.get('db_info')
    db_trans = flask.session.get('db_trans')
    flask.session['form_id'] = db_info['id']
    if db_info['type'] == 'a':
        title = '學分抵修申請'
        form_type = 'a'
        return flask.render_template('./template/read-transfer-a.html', **locals())
    elif db_info['type'] == 'b':
        title = '學分抵充申請'
        form_type = 'b'
        return flask.render_template('./template/read-transfer-b.html', **locals())


@app.route('/submit-delete', methods=['POST'])
@user_login_required
def submit_delete():
    if flask.request.method == 'POST':
        form_data = flask.request.values.to_dict()
        status_code = api.login(form_data)
        if status_code == config.ERROR:
            flask.flash('登入失敗，可能是表單編號或表單密碼錯誤')
            return flask.redirect(flask.url_for('delete'))
        elif status_code == config.SUCCESS:
            status_code = api.editable(form_data)
            if status_code == config.ERROR:
                return flask.redirect(flask.url_for('read_only'))
            elif status_code == config.SUCCESS:
                status_code = api.delete_form(form_data)
                target_file = os.path.join(app.config['UPLOAD_FOLDER'], f"{form_data['form-id']}.pdf")
                if os.path.exists(target_file):
                    os.remove(target_file)
                if status_code == config.SUCCESS:
                    title = '刪除成功'
                    message = '成功刪除表單！'
                    return flask.render_template('./template/status-success.html', **locals())


def admin_login_required(func):
    def wrapper(*args, **kwds):
        username = flask.session.get('username')
        pwd = flask.session.get('pwd')
        if None in (username, pwd):
            return flask.redirect(flask.url_for('admin_login'))

        return func(*args, **kwds)

    wrapper.__name__ = func.__name__
    return wrapper


@app.route('/admin')
@admin_login_required
def admin():
    title = '管理員頁面'

    status_code, db_form = api.admin_fetch_list()
    status_code, db_admin = api.fetch_admin_info()
    return flask.render_template('./template/admin.html', **locals())


@app.route('/admin-info-submit', methods=['POST'])
@admin_login_required
def admin_info_submit():
    form_data = flask.request.values.to_dict()
    status_code = api.admin_info_submit(form_data)
    return flask.redirect(flask.url_for('admin'))


@app.route('/admin-fetch/<form_id>')
@admin_login_required
def admin_fetch(form_id):
    buffer = {'form-id': form_id}
    status_code, db_info, db_trans = api.fetch_form(buffer)
    if status_code == config.SUCCESS:
        flask.session['db_info'] = db_info
        flask.session['db_trans'] = db_trans
        return flask.redirect(flask.url_for('admin_verify', form_id=form_id))


@app.route('/form-download/<form_id>')
@admin_login_required
def form_download(form_id):
    buffer = {'form-id': form_id}
    status_code, db_info, db_trans = api.fetch_form(buffer)
    status_code, db_admin = api.fetch_admin_info()

    if status_code == config.SUCCESS:
        status_code, file = api.form_download(db_info, db_trans, db_admin)
        response = flask.make_response(file)
        response.headers['Content-Disposition'] = f"attachment; filename={db_info['id']}-{db_info['stu_id']}.docx"
        response.mimetype = 'application/octet-stream'
        return response

    flask.abort(404)


@app.route('/stu-form-download/<form_id>')
def stu_form_download(form_id):
    session_id = flask.session.get('form_id')
    if str(session_id) == form_id:
        buffer = {'form-id': form_id}
        status_code, db_info, db_trans = api.fetch_form(buffer)
        status_code, db_admin = api.fetch_admin_info()

        if status_code == config.SUCCESS:
            status_code, file = api.form_download(db_info, db_trans, db_admin)
            response = flask.make_response(file)
            response.headers['Content-Disposition'] = f"attachment; filename={db_info['id']}-{db_info['stu_id']}.docx"
            response.mimetype = 'application/octet-stream'
            return response
    flask.abort(404)


@app.route('/admin-<form_id>')
@admin_login_required
def admin_verify(form_id):
    db_info = flask.session.get('db_info')
    db_trans = flask.session.get('db_trans')
    flask.session['form_id'] = db_info['id']
    title = f'審核表單'
    if db_info['type'] == 'a':
        form_type = 'a'
        return flask.render_template('./template/admin-verify-a.html', **locals())
    elif db_info['type'] == 'b':
        form_type = 'b'
        return flask.render_template('./template/admin-verify-b.html', **locals())


@app.route('/admin-<form_id>/verify', methods=['POST'])
@admin_login_required
def admin_verify_submit(form_id):
    form_data = flask.request.values.to_dict()
    status_code = api.admin_verify_submit(form_data, form_id)
    if status_code == config.SUCCESS:
        return flask.redirect(flask.url_for('admin'))
    flask.abort(404)


@app.route('/admin-login')
def admin_login():
    title = '管理員登入'
    url_admin_login = 'admin_login_verify'
    return flask.render_template('./template/admin-login.html', **locals())


@app.route('/admin-logout')
def admin_logout():
    flask.session.pop('username', None)
    flask.session.pop('pwd', None)
    return flask.redirect(flask.url_for('admin'))


@app.route('/admin-login/verify', methods=['POST'])
def admin_login_verify():
    form_data = flask.request.values.to_dict()
    status_code = api.admin_login_verfiy(form_data)
    if status_code is config.ERROR:
        flask.flash('登入失敗，可能是帳號或密碼錯誤')
        return flask.redirect(flask.url_for('admin_login'))
    elif status_code is config.SUCCESS:
        flask.session['username'] = form_data['username']
        flask.session['pwd'] = form_data['pwd']
        return flask.redirect(flask.url_for('admin'))


@app.route('/api/transfer:<stu_id>')
def api_get_stu_id(stu_id):
    results = api.api_get_stu_id(stu_id)
    response = flask.jsonify(results)
    return response


@app.errorhandler(404)
def err_handler(e):
    title = '訪問頁面失敗'
    return flask.render_template('./template/404.html', **locals())


# @app.route('/register')
# def register():
#     title = '註冊'
#     url_send = 'index'
#     return flask.render_template('./template/register.html', **locals())


class Register(MethodView):
    def get(self):
        title = '註冊'
        url_send = 'register'
        return flask.render_template('./template/register.html', **locals())

    def post(self):
        form_data = flask.request.values.to_dict()
        try:
            mail_account, mail_domain = form_data['mail'].split('@')
        except:
            return msg(title='無效的信箱', message='該信箱格式不正確。', danger=True)
        ALLOW_DOMAIN = 'nkust.edu.tw'
        if mail_domain != ALLOW_DOMAIN:
            return msg(title='無效的信箱', message='該信箱並非高雄科技大學信箱。', danger=True)
        if len(mail_account) < 10:
            return msg(title='無效的信箱', message='該信箱並非電機系信箱。', danger=True)
        ALLOW_ACCOUNT = [{'index': [5, 6], 'value': [0, 4]},
                         {'index': [5, 6], 'value': [5, 4]}]
        for key, value in enumerate(ALLOW_ACCOUNT):
            if mail_account[value['index'][0]] == str(value['value'][0]) and \
                    mail_account[value['index'][1]] == str(value['value'][1]):
                break
        else:
            return msg(title='無效的信箱', message='該信箱並非電機系信箱，若為轉系生請至系辦人工申請表單。', danger=True)
        status_code = api.registered_user(form_data)
        if status_code is config.ERROR:
            flask.abort(404)
        elif status_code == 'Already have this mail':
            return msg(title='無效的信箱', message='該信箱已經註冊過，請確認信箱使否正確。', danger=True)
        elif status_code is config.SUCCESS or status_code == 'Send verify mail':
            token = api.generate_verify_token(form_data)

            account = form_data['mail']
            subject = '使用者帳號註冊'
            content_html = f'''
                        <body>
                        <div style="font-size: larger;">
                            <h2>您好：</h2>
                            <p>您在【課程抵免申請系統】提交了一份註冊表單，請點選下方連接來驗證您的帳號。</p>
                            <h3><a href="{flask.url_for('token_verify', _external=True, token=token)}">驗證帳號</a></h3>
                            <h4>此郵件由<a href="{flask.url_for('index', _external=True)}">【課程抵免申請系統】</a>自動發送，請勿直接回覆。</h4>
                        </div>
                        </body>
                        '''
            try:
                api.send_mail(target_account=account, msg_subject=subject, msg_content_html=content_html)
            except:
                app.logger.error('Send e-mail failed')
            message = '提交註冊申請成功，請前往信箱查看驗證信件，並點選【驗證帳號】連結來驗證您的帳號。'
            if status_code == 'Send verify mail':
                message = '該信箱已註冊過，尚未完成驗證，請前往信箱點擊驗證連結來驗證帳號。'
            return msg(title='驗證信箱', message=message)


def msg(title, message, danger=False):
    return flask.render_template('./template/status-success.html', **locals())


register_view = Register.as_view('register')
app.add_url_rule('/register', view_func=register_view, methods=['GET', ])
app.add_url_rule('/register', view_func=register_view, methods=['POST', ])


@app.route('/token-verify')
def token_verify():
    token = flask.request.values.get('token')
    if token == '' or token == None:
        flask.abort(404)
    else:
        try:
            status_code = api.token_verify(token)
            if status_code == 'token expired':
                return '許可證過期'
        except:
            app.logger.error('verify email failed')
            return '驗證信箱失敗'
        else:
            return '成功驗證信箱'


class UserVerify(MethodView):
    def get(self):
        title = '驗證信箱'
        url_send = 'user_verify'
        return flask.render_template('./template/user-verify.html', **locals())


user_verify_view = UserVerify.as_view('user_verify')
app.add_url_rule('/user_verify', view_func=user_verify_view, methods=['GET'])


class UserLogin(MethodView):
    def get(self):
        title = '登入'
        url_send = 'user_login'
        url_register = 'register'
        return flask.render_template('./template/user-login.html', **locals())
    def post(self):
        form_data = flask.request.values.to_dict()
        status_code = api.user_login(form_data)
        if status_code is config.ERROR:
            flask.flash('登入失敗，可能是帳號或密碼錯誤')
            return flask.redirect(flask.url_for('user_login'))
        elif status_code is config.SUCCESS:
            flask.session['mail'] = form_data['mail']
            return flask.redirect(flask.url_for('index'))
        flask.abort(404)


user_login_view = UserLogin.as_view('user_login')
app.add_url_rule('/user-login', view_func=user_login_view, methods=['GET'])
app.add_url_rule('/user-login', view_func=user_login_view, methods=['POST'])


@app.route('/user-logout')
def user_logout():
    flask.session.pop('mail', None)
    return flask.redirect(flask.url_for('user_login'))


if __name__ == '__main__':
    if config.setting['mode'] == 'development':
        app.run(host='127.0.0.1', port=config.setting['port'])
    elif config.setting['mode'] == 'deployment':
        from waitress import serve

        serve(app, host='0.0.0.0', port=config.setting['port'])
