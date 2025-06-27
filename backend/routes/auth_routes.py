from flask import Blueprint, request, jsonify
from backend import db
from backend.models import User
from backend.utils.auth import hash_password, verify_password
from sqlalchemy import or_

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@bp.route("/signup", methods=["POST"])
def signup():
    data=request.json
    username=data.get("username")
    email=data.get("email")
    password=data.get("password")

    #checking if user exists
    if User.query.filter((User.username==username) | (User.email==email)).first():
        return jsonify ({"error": "User already exists"}), 400
    
    #saving user to the database if the do not exit
    user=User(username=username, email=email, password_hash=hash_password(password))
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201

@bp.route("/login", methods=["POST"])
def login():
    data=request.json
    identifier=data.get("identifier") #allowa the user to enter either username or email
    password=data.get("password")

    user=User.query.filter(or_(User.username == identifier) | (User.email == identifier)).first()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({"error": "Invalid credentials"}), 401
    
    return jsonify({"message": "Login successful", "user_id": user.id}), 200



