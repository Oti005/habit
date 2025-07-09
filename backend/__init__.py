#initializing flask
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask import request

db=SQLAlchemy()    #ORM instances
migrate=Migrate()  #migration manager
jwt = JWTManager() #JWT manager for handling JSON Web Tokens

def create_app():
    app= Flask(__name__)
    app.config.from_object(Config) #load settings from config.py

    db.init_app(app)  #initializing DB with app
    migrate.init_app(app,db) #enabling maigration
    jwt.init_app(app) #initializing JWT manager with app

    CORS(
        app,
        resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:3000"], "supports_credentials": True}},
        # credentials=True,
        supports_credentials=True
    )
    @app.before_request
    def handle_options_requests():
        if request.method == "OPTIONS":
            return '', 200

    #importing and registering your route files(blueprints)
    from backend.routes.auth_routes import bp as auth_bp
    from backend.routes.habit_routes import bp as habit_bp
    from backend.routes.log_routes import bp as log_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(habit_bp)
    app.register_blueprint(log_bp)

    return app #returns the Flak app instance
