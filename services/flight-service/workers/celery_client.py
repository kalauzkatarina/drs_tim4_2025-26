from celery import Celery
from Domen.Config.config import Config

celery_app = Celery(
    broker= Config.CELERY_BROKER_URL,
)

def notify_ticket_cancel(userId,ticketId):
    celery_app.send_task("email.task.send_ticket_cancelled_email",args=[userId,ticketId],)

def notify_flight_cancelled(flightId):
    celery_app.send_task(
        "email.task.send_flight_cancelled_email",
        args=[flightId]
    )