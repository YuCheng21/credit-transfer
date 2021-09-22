import os
import datetime

# ============================ #
#           flask              #
# ============================ #

class BaseConfig:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JSON_AS_ASCII = False
    UPLOAD_FOLDER = os.path.abspath('./upload')
    PERMANENT_SESSION_LIFETIME = datetime.timedelta(minutes=30)
    SESSION_REFRESH_EACH_REQUEST = True
    SESSION_COOKIE_NAME = 'ct-session'


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class ProductionConfig(BaseConfig):
    DEBUG = False


flask = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}

# Upload Config
ALLOWED_EXTENSIONS = {'pdf'}

# ============================ #
#           mysql              #
# ============================ #

mysql_conf = {
    'host': os.environ.get('mysql_host'),
    'user': os.environ.get('mysql_user'),
    'password': os.environ.get('mysql_password'),
    'database': 'credit-transfer'
}

# ============================ #
#           smtplib            #
# ============================ #

email_sender = {
    'sender_account': os.environ.get('sender_account'),
    'sender_password': os.environ.get('sender_password')
}

# ============================ #
#          Variable            #
# ============================ #

# Status Code
SUCCESS = 200
ERROR = 400
