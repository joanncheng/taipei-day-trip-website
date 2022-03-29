import bcrypt
from decouple import config
import jwt


def handle_error(message="Something went wrong, please try again later.", status_code=500):
    return {"error": True, "message": message}, status_code


def correct_password(candidate_pw, user_pw):
    candidate_pw = candidate_pw.encode("utf-8")
    user_pw = user_pw.encode("utf-8")
    return bcrypt.checkpw(candidate_pw, user_pw)


def decode_jwt(token):
    return jwt.decode(token, config("JWT_SECRET"), algorithms="HS256")
