from flask import Blueprint, request, jsonify
from backend import db
from backend.models import Habit
from backend.utils.auth import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("habits", __name__, url_prefix="/api/habits")

@bp.route("/", methods=["GET"])
@jwt_required()
#get all habits for a user
def get_habits():
    user_id = get_jwt_identity() #get the user ID from the JWT token
    habits= Habit.query.filter_by(user_id=user_id).all()
    result = [{
        "id": h.id,
        "name": h.name,
        "description":h.description,
        "frequency":h.frequency,
        "category_id":h.category_id,
        "created_at":h.created_at,
       }
       for h in habits
    ]
    return jsonify(result), 200

#creating a new habit

@bp.route("/", methods=["POST"])
@jwt_required()
def create_habit():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_habit= Habit(
        name=data.get("name"),
        description=data.get("description"),
        frequency=data.get("frequency"),
        category_id=data.get("category_id"),
        user_id=user_id, #it will get the user_id form the JWT token instead of sending it in the request body
        created_at=data.get("created_at")
    )

    db.session.add(new_habit)
    db.session.commit()
    return jsonify({"message": "Habit created", "habit_id": new_habit.id}),201

#updating a new message
@bp.route("/<int:habit_id>", methods=["PUT"])
@jwt_required()
def update_habit(habit_id):
    user_id = get_jwt_identity()
    habit=Habit.query.filter_by(id=habit_id, user_id=user_id).first() #filtering by user_id to ensure the user can only update their own habits

    #if the habit does not exist return an error
    if not habit:
        return jsonify({"error": "Habit not found"}), 404
    
    data=request.get_json()
    habit.name=data.get("name",habit.name)
    habit.description=data.get("description",habit.description)
    habit.frequency=data.get("frequency", habit.frequency)
    habit.category_id=data.get("category_id", habit.category_id)

    db.session.commit()
    return jsonify({"message":"Habit updated"}), 200

#deleting a habit
@bp.route("/<int:habit_id>", methods=["DELETE"])
@jwt_required()
def delete_habit(habit_id):
    user_id = get_jwt_identity()
    habit=Habit.query.filter_by(id=habit_id, user_id=user_id).first()
    if not habit:
        return jsonify({"error": "Habit not found"}), 404
    
    db.session.delete(habit)
    db.session.commit()
    return jsonify({"message": "habit deleted"}), 200

