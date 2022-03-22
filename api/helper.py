import bcrypt


def handle_error(message, status_code):
    return {"error": True, "message": message}, status_code


def correct_password(candidate_pw, user_pw):
    candidate_pw = candidate_pw.encode("utf-8")
    user_pw = user_pw.encode("utf-8")
    return bcrypt.checkpw(candidate_pw, user_pw)
