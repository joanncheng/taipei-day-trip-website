from flask import request, jsonify
from flask_restful import Resource
from models.database import mydbpool
from api.booking import authenticate
from decouple import config
import time
import requests
import json
from .helper import handle_error


class Orders(Resource):
    method_decorators = [authenticate]

    def post(self, user):
        try:
            req = request.json
            order = req["order"]

            number = time.strftime("%Y%m%d%H%M%S") + "U" + str(user["id"])

            order_data = {
                "number": number,
                "attractionId": order["trip"]["attraction"]["id"],
                "userId": user["id"],
                "date": order["trip"]["date"],
                "time": order["trip"]["time"],
                "price": order["price"],
                "name": order["contact"]["name"],
                "email": order["contact"]["email"],
                "phone": order["contact"]["phone"],
                "status": 1,
            }

            if not all(value for value in order_data.values()) or order_data["price"] <= 0:
                return handle_error("Please provide valid data.", 400)

            is_inserted = mydbpool.create_one("orders", order_data)
            if not is_inserted:
                return handle_error()

            tappay_data = {
                "prime": req["prime"],
                "partner_key": config("TAPPAY_PARTNER_KEY"),
                "merchant_id": config("TAPPAY_MERCHANT_ID"),
                "details": "A day trip no." + number,
                "amount": order["price"],
                "cardholder": {
                    "name": order["contact"]["name"],
                    "email": order["contact"]["email"],
                    "phone_number": order["contact"]["phone"],
                },
                "remember": False,
            }

            header = {"Content-Type": "application/json", "x-api-key": config("TAPPAY_PARTNER_KEY")}
            tappay_result = requests.post(config("TAPPAY_API_URL"), data=json.dumps(tappay_data), headers=header)
            tappay_result = tappay_result.json()

            if tappay_result["status"] == 0:
                is_updated = mydbpool.update_one("orders", {"status": 0, "number": number})
                is_deleted = mydbpool.delete_one("booking", {"userId": user["id"]})
                if not is_updated or not is_deleted:
                    return handle_error()
                res = {"data": {"number": number, "payment": {"status": 0, "message": "付款成功"}}}
                return jsonify(res)
            else:
                res = {
                    "data": {
                        "number": number,
                        "payment": {"status": 1, "message": "付款失敗 (%s)" % (tappay_result["msg"])},
                    }
                }
                return jsonify(res)
        except KeyError as e:
            return handle_error("Please provide valid data (%s)" % (str(e)), 400)
        except Exception as e:
            print("From POST api/orders: ", e)
            return handle_error()


class Order(Resource):
    method_decorators = [authenticate]

    def get(self, user, orderNumber):

        order = mydbpool.find_one("orders", {"number": orderNumber})

        if order is None:
            return {"data": None}

        if order is False:
            return handle_error()

        if order["userId"] != user["id"]:
            return handle_error("You don't have permission.", 403)

        res = {
            "data": {
                "number": order["number"],
                "price": order["price"],
                "trip": {
                    "attraction": {
                        "id": order["attractionId"],
                        "name": order["attractionName"],
                        "address": order["address"],
                        "image": order["images"].split(",")[0],
                    },
                    "date": str(order["date"]),
                    "time": order["time"],
                },
                "contact": {"name": order["name"], "email": order["email"], "phone": order["phone"]},
                "status": order["status"],
            }
        }
        return jsonify(res)
