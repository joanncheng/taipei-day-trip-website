from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource
from models.database import mydbpool

api_bp = Blueprint("api_bp", __name__, url_prefix="/api")


@api_bp.errorhandler(500)
def interanl_server_error(e):
    return jsonify(error=True, message="Internal Server Error"), 500


api = Api(api_bp)


def format_attraction_data(data):
    data["latitude"] = float(data["latitude"])
    data["longitude"] = float(data["longitude"])
    data["images"] = data["images"].split(",")
    return data


class Attractions(Resource):
    def get(self):
        per_page = 12
        page = request.args.get("page", 0, type=int)
        if page < 0:
            page = 0
        keyword = request.args.get("keyword")

        result = mydbpool.get_pagination(per_page, page, keyword)
        if result is False:
            res = {"error": True, "message": "Something went wrong, please try again later."}
            return res, 500

        attractions = result["attractions"]
        pages = result["pages"]
        next_page = page + 1 if page + 1 <= pages else None

        for attraction in attractions:
            format_attraction_data(attraction)

        res = {"nextPage": next_page, "data": attractions}
        return jsonify(res)


class Attraction(Resource):
    def get(self, attractionId):
        attraction = mydbpool.get_attraction(attractionId)

        if attraction is None:
            res = {"error": True, "message": "No attraction found with that ID"}
            return res, 400

        if attraction is False:
            res = {"error": True, "message": "Something went wrong, please try again later."}
            return res, 500

        format_attraction_data(attraction)

        res = {"data": attraction}
        return jsonify(res)


api.add_resource(Attractions, "/attractions")
api.add_resource(Attraction, "/attraction/<attractionId>")
