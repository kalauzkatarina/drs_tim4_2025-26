import requests
from flask_mail import Message
from .extensions import mail, celery
from .config import Config

@celery.task
def send_email(to,subject,body):
        recipients = to if isinstance(to,list) else [to]
        msg = Message(subject,sender=Config.MAIL_USERNAME,recipients=recipients,body=body)
        mail.send(msg)


@celery.task(name="email.task.send_ticket_cancelled_email")
def send_ticket_cancel_email(userId,ticketId):
        # GET user
        user_resp = requests.get(f"http://localhost:5001/api/users/{userId}")
        user_data = user_resp.json()
        recipients = [user_data["email"]]

        # GET ticket (opciono, samo za info u mejlu)
        ticket_resp = requests.get(f"http://localhost:5002/api/tickets/{ticketId}")
        ticket_data = ticket_resp.json()

        msg = Message(
                "Ticket cancelled",
                sender=Config.MAIL_USERNAME,
                recipients=recipients,
                body=f"Your ticket #{ticketId} has been cancelled."
        )
        mail.send(msg)

@celery.task(name="email.task.send_flight_cancelled_email")
def send_flight_cancelled_email(flightId):
        tickets = requests.get(f"http://127.0.0.1:5002/api/tickets/flights-tickets/{flightId}")

        for ticket in tickets:
                user = requests.get(f"http://127.0.0.1:5001/api/users/{ticket.userId}")

                msg = Message("Flight cancelled",sender=Config.MAIL_USERNAME,recipients=user.email,body=f"Your flight {flightId} has been cancelled.\nYour ticket {ticket.id} is no longer valid.")

                mail.send(msg)
