from flask import request, jsonify
from flask_restful import Resource
from models.database import mydbpool


class User(Resource):
    def get(self):
        return "TODO"

    def post(self):
        return "TODO"

    def patch(self):
        return "TODO"

    def delete(self):
        return "TODO"
