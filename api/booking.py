from flask import request, jsonify
from flask_restful import Resource
from functools import wraps
from models.database import mydbpool
from .helper import handle_error, decode_jwt


def authenticate(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.cookies.get("jwt")

        if not token or token == "loggedout":
            return handle_error("You don't have permission.", 403)

        decoded = decode_jwt(token)
        user = mydbpool.find_one("user", {"email": decoded["email"]})

        if user:
            return func(user, *args, **kwargs)

        return handle_error("You don't have permission.", 403)

    return wrapper


class Booking(Resource):
    method_decorators = [authenticate]

    def get(self, user):
        booking = mydbpool.find_one("booking", {"userId": user["id"]})
        if booking is None:
            return {"data": None}

        if booking is False:
            return handle_error()

        res = {
            "data": {
                "attraction": {
                    "id": booking["attractionId"],
                    "name": booking["name"],
                    "address": booking["address"],
                    "image": booking["images"].split(",")[0],
                },
                "date": str(booking["date"]),
                "time": booking["time"],
                "price": booking["price"],
            }
        }
        return jsonify(res)

    def post(self, user):
        try:
            data = request.json

            if not all(key in data for key in ("attractionId", "date", "time", "price")) or not all(
                value for value in data.values()
            ):
                return handle_error("Please provide valid attractionId, date, time and price.", 400)

            data["userId"] = user["id"]
            booked = mydbpool.create_one("booking", data)

            if booked:
                return jsonify({"ok": True})

            return handle_error()

        except Exception as e:
            print("From POST api/booking: ", e)
            return handle_error()

    def delete(self, user):
        is_deleted = mydbpool.delete_one("booking", {"userId": user["id"]})
        if is_deleted:
            return jsonify({"ok": True})
        return handle_error()
