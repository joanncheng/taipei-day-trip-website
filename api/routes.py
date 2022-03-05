from flask import Blueprint, jsonify
from flask_restful import Api
from .user import User
from .attractions import Attraction, Attractions
from .booking import Booking
from .orders import Orders, Order


api_bp = Blueprint("api_bp", __name__, url_prefix="/api")

api = Api(api_bp)

api.add_resource(User, "/user")

api.add_resource(Attractions, "/attractions")
api.add_resource(Attraction, "/attraction/<attractionId>")

api.add_resource(Booking, "/booking")

api.add_resource(Orders, "/orders")
api.add_resource(Order, "/order/<orderNumber>")
