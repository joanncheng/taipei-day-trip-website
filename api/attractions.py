from flask import request, jsonify
from flask_restful import Resource
from models.database import mydbpool
from .helper import handle_error


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
            return handle_error()

        for attraction in result["attractions"]:
            format_attraction_data(attraction)

        res = {"nextPage": result["next_page"], "data": result["attractions"]}
        return jsonify(res)


class Attraction(Resource):
    def get(self, attractionId):
        attraction = mydbpool.find_one("attractions", {"id": attractionId})

        if attraction is None:
            return handle_error("No attraction found with that ID.", 400)

        if attraction is False:
            return handle_error()

        format_attraction_data(attraction)

        return jsonify({"data": attraction})
