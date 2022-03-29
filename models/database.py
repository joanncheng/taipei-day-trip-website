from flask import Blueprint
from mysql.connector import pooling, Error
from decouple import config

models_bp = Blueprint("models", __name__)


class Database:
    def __init__(self):
        self.cnxpool = pooling.MySQLConnectionPool(
            pool_name="mypool",
            pool_size=2,
            pool_reset_session=True,
            host="localhost",
            user=config("MYSQL_USER"),
            password=config("MYSQL_PASSWORD"),
            database="taipei_day_trip_website",
        )

    def get_pagination(self, per_page, page, keyword):
        try:
            cnx = self.cnxpool.get_connection()
            cursor = cnx.cursor(dictionary=True)

            offset = page * per_page

            if not keyword:
                cursor.execute(
                    "SELECT * FROM attractions ORDER BY id LIMIT %s OFFSET %s;",
                    (
                        per_page + 1,
                        offset,
                    ),
                )
            else:
                cursor.execute(
                    "SELECT * FROM attractions WHERE name LIKE %s ORDER BY id LIMIT %s OFFSET %s;",
                    (
                        "%" + keyword + "%",
                        per_page + 1,
                        offset,
                    ),
                )

            record = cursor.fetchall()

            if len(record) == per_page + 1:
                next_page = page + 1
                attractions = record[:-1]
            else:
                next_page = None
                attractions = record

            return {"next_page": next_page, "attractions": attractions}

        except Exception as e:
            print("Error occurred: ", e)
            return False

        finally:
            if cnx.is_connected():
                cursor.close()
                cnx.close()

    def find_one(self, table, option):
        try:
            cnx = self.cnxpool.get_connection()
            cursor = cnx.cursor(dictionary=True)

            for key, value in option.items():
                if table == "booking":
                    cursor.execute(
                        "SELECT * FROM booking JOIN attractions ON booking.attractionId = attractions.id WHERE "
                        + key
                        + "= %s;",
                        (value,),
                    )

                else:
                    cursor.execute("SELECT * FROM " + table + " WHERE " + key + "= %s;", (value,))

            return cursor.fetchone()

        except Exception as e:
            print("Error occurred when selecting: ", e)
            return False

        finally:
            if cnx.is_connected():
                cursor.close()
                cnx.close()

    def create_one(self, table, data):
        try:
            cnx = self.cnxpool.get_connection()
            cursor = cnx.cursor(dictionary=True)

            if table == "user":
                cursor.execute(
                    "INSERT INTO user (name, email, password) VALUES (%s, %s, %s);",
                    (
                        data["name"],
                        data["email"],
                        data["password"],
                    ),
                )

            elif table == "booking":
                cursor.execute("DELETE FROM booking WHERE userId = %s;", (data["userId"],))

                cursor.execute(
                    "INSERT INTO booking (userId, attractionId, date, time, price) VALUES (%s, %s, %s, %s, %s);",
                    (
                        data["userId"],
                        data["attractionId"],
                        data["date"],
                        data["time"],
                        data["price"],
                    ),
                )

            cnx.commit()
            return True

        except Exception as e:
            print("Error occurred when inserting: ", e)
            cnx.rollback()
            return False

        finally:
            if cnx.is_connected():
                cursor.close()
                cnx.close()

    def delete_one(self, table, option):
        try:
            cnx = self.cnxpool.get_connection()
            cursor = cnx.cursor(dictionary=True)

            for key, value in option.items():
                cursor.execute("DELETE FROM " + table + " WHERE " + key + "= %s;", (value,))

            cnx.commit()
            return True

        except Exception as e:
            print("Error occurred when deleting: ", e)
            cnx.rollback()
            return False

        finally:
            if cnx.is_connected():
                cursor.close()
                cnx.close()


try:
    mydbpool = Database()
except Error as e:
    print("Error while connecting to MySQL: ", e)
