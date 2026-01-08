from flask import Flask
from Database.InitializationDataBase import db
from Domen.Models.Users import Users
from Extensions.Bcrypt import bcrypt
from Routes.UserRoutes import user_bp

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@localhost:5555/users_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
db.init_app(app)
bcrypt.init_app(app)
app.register_blueprint(user_bp)

if __name__ == "__main__":
    with app.app_context():
            # create_all() proverava sve klasu koje nasleđuju db.Model
            db.create_all()
            print("Tabele su uspešno kreirane u bazi!")

    app.run(debug=True, port=5001)