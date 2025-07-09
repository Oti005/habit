from flask import Blueprint, request, jsonify
from backend import db
from backend.models import Habit, HabitLog, Category
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin

bp = Blueprint("habits", __name__, url_prefix="/api/habits")

@bp.route("/", methods=["GET"])
@jwt_required()
@cross_origin(origins=["http://localhost:5173", "http://localhost:3000"], supports_credentials=True)
def get_habits():
    user_id = get_jwt_identity()
    habits = Habit.query.filter_by(user_id=user_id).all()
    result = []
    for h in habits:
        result.append({
            "id": h.id,
            "title": h.title,
            "description": h.description,
            "frequency": h.frequency.split(",") if h.frequency else [],
            "is_active": h.is_active,
            "created_at": h.created_at,
        })
    return jsonify(result), 200

@bp.route("/", methods=["POST"])
@jwt_required()
@cross_origin(origins=["http://localhost:5173", "http://localhost:3000"], supports_credentials=True)
def create_habit():
    user_id = get_jwt_identity()
    data = request.get_json()
    freq = ",".join(data.get("frequency", [])) if isinstance(data.get("frequency"), list) else data.get("frequency")
    new_habit = Habit(
        title=data.get("title"),
        description=data.get("description"),
        frequency=freq,
        user_id=user_id,
        # created_at=data.get("created_at")
    )
    db.session.add(new_habit)
    db.session.commit()
    return jsonify({
        "id": new_habit.id,
        "title": new_habit.title,
        "description": new_habit.description,
        "frequency": new_habit.frequency.split(",") if new_habit.frequency else [],
        "is_active": new_habit.is_active,
        # "created_at": new_habit.created_at,
    }), 201

@bp.route("/<int:habit_id>/logs", methods=["GET"])
@jwt_required()
@cross_origin(origins=["http://localhost:5173", "http://localhost:3000"], supports_credentials=True)
def get_habit_logs(habit_id):
    user_id = get_jwt_identity()
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first()
    if not habit:
        return jsonify({"error": "Habit not found"}), 404
    logs = HabitLog.query.filter_by(habit_id=habit_id).all()
    result = [{
        "id": log.id,
        "log_date": log.log_date,
        "is_completed": log.is_completed,
        "created_at": log.created_at,
    } for log in logs]
    return jsonify(result), 200

@bp.route("/logs", methods=["GET"])
@jwt_required()
@cross_origin(origins=["http://localhost:5173", "http://localhost:3000"], supports_credentials=True)
def get_logs():
    user_id = get_jwt_identity()
    habits = Habit.query.filter_by(user_id=user_id).all()
    logs = []
    for habit in habits:
        for log in habit.logs:
            logs.append({
                "id": log.id,
                "habit_id": habit.id,
                "title": habit.title,
                "is_completed": log.is_completed,
                "date_completed": log.log_date,
            })
    return jsonify(logs), 200

# Add a categories endpoint
@bp.route("/categories", methods=["GET"])
@jwt_required()
@cross_origin(origins=["http://localhost:5173", "http://localhost:3000"], supports_credentials=True)
def get_categories():
    user_id = get_jwt_identity()
    categories = Category.query.filter_by(user_id=user_id).all()
    result = [{"id": c.id, "name": c.name} for c in categories]
    return jsonify(result), 200