from flask import Blueprint, request, jsonify
from backend import db
from backend.models import Log, Habit
from backend.utils.auth import datetime

bp = Blueprint("logs", __name__, url_prefix="/api/logs")

#to get logs for a specific habit
@bp.route("/habit/<int:habit_id>", methods=["GET"])
def get_logs(habit_id):
    logs= Log.query.filter_by(habit_id=habit_id).order_by(Log.date.desc()).all()
    result= [{"id": log.id, "date": log.date.isoformat()} for log in logs]
    return jsonify(result), 200

#adding a new log entry example like a user completed a habit today
@bp.route("/habit/<int:habit_id>", methods=["POST"])
def add_log(habit_id):
    habit=Habit.query.get(habit_id)
    if not habit:
        return jsonify({"error": "Habit not found"}), 404
    
    log_entry = Log(habit_id=habit_id, date=datetime.utcnow().date())
    db.session.add(log_entry)
    db.session.commit()
    return jsonify ({"message": "Log entry created"}), 201


