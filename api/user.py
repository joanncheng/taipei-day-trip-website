from flask import request, jsonify, make_response
from flask_restful import Resource
from decouple import config
import jwt
from datetime import datetime, timedelta, timezone
import bcrypt
from models.database import mydbpool
from .helper import handle_error, correct_password


def send_jwt(email):
    payload = {
        "email": email,
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=int(config("JWT_EXPIRY_DAY"))),
    }

    token = jwt.encode(payload, config("JWT_SECRET"), algorithm="HS256")
    res = make_response(jsonify({"ok": True}))
    res.set_cookie("jwt", token, httponly=True)
    return res


class User(Resource):
    def get(self):
        try:
            token = request.cookies.get("jwt")
            if not token:
                return {"data": None}

            decoded = jwt.decode(token, config("JWT_SECRET"), algorithms="HS256")
            user_email = decoded["email"]

            user = mydbpool.find_user(user_email)

            user.pop("password")

            return jsonify({"data": user})

        except Exception as e:
            print("From GET api/user: ", e)
            return {"data": None}

    def post(self):
        data = request.json

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return handle_error("請輸入姓名、電子郵件、密碼 ", 400)

        if mydbpool.find_user(email):
            return handle_error("此電子信箱已被註冊", 400)

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        new_user = mydbpool.create_user(name, email, hashed_password)

        if not new_user:
            return handle_error("Something went wrong, please try again later.", 500)

        return send_jwt(email)

    def patch(self):
        data = request.json

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return handle_error("請輸入電子信箱、密碼 ", 400)

        user = mydbpool.find_user(email)

        if user is None or not correct_password(password, user["password"]):
            return handle_error("電子信箱或密碼輸入錯誤", 400)

        if user is False:
            return handle_error("Something went wrong, please try again later.", 500)

        return send_jwt(email)

    def delete(self):
        res = make_response(jsonify({"ok": True}))
        res.set_cookie("jwt", "loggedout", expires=datetime.now(tz=timezone.utc) + timedelta(seconds=10), httponly=True)

        return res
