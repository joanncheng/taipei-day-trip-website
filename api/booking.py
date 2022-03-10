from flask import request, jsonify
from flask_restful import Resource
from models.database import mydbpool


class Booking(Resource):
    def get(self):
        return "TODO"

    def post(self):
        return "TODO"

    def delete(self):
        return "TODO"
