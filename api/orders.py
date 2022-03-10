from flask import request, jsonify
from flask_restful import Resource
from models.database import mydbpool


class Orders(Resource):
    def post(self):
        return "TODO"


class Order(Resource):
    def get(self, orderNumber):
        return "TODO"
