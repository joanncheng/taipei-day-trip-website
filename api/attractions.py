import re
from flask import request, jsonify
from flask_restful import Resource
from models.database import mydbpool


def format_attraction_data(data):
    data["latitude"] = float(data["latitude"])
    data["longitude"] = float(data["longitude"])
    data["images"] = data["images"].split(",")
    return data


def handle_error(message, status_code):
    return {"error": True, "message": message}, status_code


class Attractions(Resource):
    def get(self):
        per_page = 12
        page = request.args.get("page", 0, type=int)
        if page < 0:
            page = 0
        keyword = request.args.get("keyword")

        result = mydbpool.get_pagination(per_page, page, keyword)
        if result is False:
            return handle_error("Something went wrong, please try again later.", 500)

        if len(result) == per_page + 1:
            next_page = page + 1
            attractions = result[:-1]
        else:
            next_page = None
            attractions = result

        for attraction in attractions:
            format_attraction_data(attraction)

        res = {"nextPage": next_page, "data": attractions}
        return jsonify(res)


class Attraction(Resource):
    def get(self, attractionId):
        attraction = mydbpool.get_attraction(attractionId)

        if attraction is None:
            return handle_error("No attraction found with that ID.", 400)

        if attraction is False:
            return handle_error("Something went wrong, please try again later.", 500)

        format_attraction_data(attraction)

        res = {"data": attraction}
        return jsonify(res)
