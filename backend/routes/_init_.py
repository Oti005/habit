from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    from .routes import auth_routes, habit_routes, log_routes
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(habit_routes.bp)
    app.register_blueprint(log_routes.bp)

    return app
