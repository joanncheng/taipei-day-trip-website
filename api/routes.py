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
        keyword = request.args.get("keyword")

        if page < 0:
            page = 0

        count = mydbpool.get_number_of_rows(keyword)
        pages = count // per_page
        offset = page * per_page
        next_page = None if page + 1 > pages else page + 1

        attractions = mydbpool.paginate(per_page, offset, keyword)

        if attractions is False:
            res = {"error": True, "message": "Something went wrong, please try again later."}
            return res, 500

        for attraction in attractions:
            format_attraction_data(attraction)

        res = {"nextPage": next_page, "data": attractions}
        return jsonify(res)


class Attraction(Resource):
    def get(self, attractionId):
        attraction = mydbpool.query("SELECT * FROM attractions WHERE id = %s", [attractionId])

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
