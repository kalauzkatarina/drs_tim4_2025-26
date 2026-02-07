# from flask_mail import Mail
import resend as resend
from celery import Celery
from .config import Config

# mail = Mail()
resend.api_key = Config.RESEND_API_KEY
celery = Celery(__name__, broker=Config.CELERY_BROKER_URL)